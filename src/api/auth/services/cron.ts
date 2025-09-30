

export default ({ strapi }) => ({
  async cleanupExpiredSessions() {
    try {
      const sessionService = strapi.service('api::auth.session');
      const cleanedCount = await sessionService.cleanupExpiredSessions();
      
      strapi.log.info(`Cleaned up ${cleanedCount} expired sessions`);
      return cleanedCount;
    } catch (error) {
      strapi.log.error('Error cleaning up expired sessions:', error);
      return 0;
    }
  },

  async cleanupOldAuthLogs() {
    try {
      const loggerService = strapi.service('api::auth.logger');
      const deletedCount = await loggerService.cleanupOldLogs(30); // Keep 30 days
      
      strapi.log.info(`Cleaned up ${deletedCount} old auth logs`);
      return deletedCount;
    } catch (error) {
      strapi.log.error('Error cleaning up old auth logs:', error);
      return 0;
    }
  },

  async unlockExpiredAccounts() {
    try {
      const unlockedCount = await strapi.query('plugin::users-permissions.user').updateMany({
        where: {
          accountLocked: true,
          accountLockedUntil: {
            $lt: new Date()
          }
        },
        data: {
          accountLocked: false,
          accountLockedUntil: null,
          loginAttempts: 0
        }
      });
      
      strapi.log.info(`Unlocked ${unlockedCount} expired accounts`);
      return unlockedCount;
    } catch (error) {
      strapi.log.error('Error unlocking expired accounts:', error);
      return 0;
    }
  },

  async clearExpiredVerificationCodes() {
    try {
      const clearedCount = await strapi.query('plugin::users-permissions.user').updateMany({
        where: {
          verificationCode: {
            $not: null
          },
          verificationCodeExpires: {
            $lt: new Date()
          }
        },
        data: {
          verificationCode: null,
          verificationCodeExpires: null
        }
      });
      
      strapi.log.info(`Cleared ${clearedCount} expired verification codes`);
      return clearedCount;
    } catch (error) {
      strapi.log.error('Error clearing expired verification codes:', error);
      return 0;
    }
  },

  async runAllCleanupTasks() {
    const results = await Promise.allSettled([
      this.cleanupExpiredSessions(),
      this.cleanupOldAuthLogs(),
      this.unlockExpiredAccounts(),
      this.clearExpiredVerificationCodes()
    ]);

    const summary = {
      sessionsCleaned: results[0].status === 'fulfilled' ? results[0].value : 0,
      logsCleaned: results[1].status === 'fulfilled' ? results[1].value : 0,
      accountsUnlocked: results[2].status === 'fulfilled' ? results[2].value : 0,
      codesCleared: results[3].status === 'fulfilled' ? results[3].value : 0
    };

    strapi.log.info('Cleanup tasks completed:', summary);
    return summary;
  }
});
