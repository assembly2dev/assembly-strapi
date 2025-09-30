

export default ({ strapi }) => ({
  async logAuthEvent(data) {
    try {
      await strapi.query('auth-log').create({
        data: {
          userId: data.userId,
          action: data.action,
          email: data.email,
          ipAddress: data.ipAddress,
          userAgent: data.userAgent,
          success: data.success,
          errorMessage: data.errorMessage,
          metadata: data.metadata
        }
      });
    } catch (error) {
      strapi.log.error('Failed to log auth event:', error);
    }
  },

  async getRecentAuthEvents(userId, minutes = 15) {
    const cutoffTime = new Date(Date.now() - minutes * 60 * 1000);
    
    return await strapi.query('auth-log').findMany({
      where: {
        userId,
        createdAt: {
          $gte: cutoffTime
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  },

  async getFailedLoginAttempts(userId, minutes = 15) {
    const cutoffTime = new Date(Date.now() - minutes * 60 * 1000);
    
    return await strapi.query('auth-log').findMany({
      where: {
        userId,
        action: 'login_attempt',
        success: false,
        createdAt: {
          $gte: cutoffTime
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  },

  async cleanupOldLogs(daysToKeep = 30) {
    const cutoffDate = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000);
    
    const deletedCount = await strapi.query('auth-log').deleteMany({
      where: {
        createdAt: {
          $lt: cutoffDate
        }
      }
    });

    return deletedCount;
  },

  async getSecurityReport(userId) {
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [recentEvents, failedAttempts, successfulLogins] = await Promise.all([
      this.getRecentAuthEvents(userId, 24 * 60), // Last 24 hours
      this.getFailedLoginAttempts(userId, 24 * 60), // Last 24 hours
      strapi.query('auth-log').findMany({
        where: {
          userId,
          action: 'login_success',
          createdAt: {
            $gte: last7Days
          }
        }
      })
    ]);

    return {
      totalEvents24h: recentEvents.length,
      failedAttempts24h: failedAttempts.length,
      successfulLogins7d: successfulLogins.length,
      lastLogin: successfulLogins[0]?.createdAt || null,
      suspiciousActivity: failedAttempts.length > 5
    };
  }
});
