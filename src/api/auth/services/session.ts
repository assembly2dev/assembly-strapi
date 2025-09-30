export default ({ strapi }) => ({
  async createSession(userId, ipAddress, userAgent) {
    const sessionToken = strapi.plugins['users-permissions'].services.jwt.issue({
      id: userId,
      type: 'session'
    });

    const refreshToken = strapi.plugins['users-permissions'].services.jwt.issue({
      id: userId,
      type: 'refresh'
    });

    const session = await strapi.query('user-session').create({
      data: {
        userId,
        sessionToken,
        refreshToken,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        ipAddress,
        userAgent,
        isActive: true,
        lastActivity: new Date()
      }
    });

    return session;
  },

  async validateSession(sessionToken) {
    const session = await strapi.query('user-session').findOne({
      where: {
        sessionToken,
        isActive: true,
        expiresAt: {
          $gt: new Date()
        }
      }
    });

    if (session) {
      // Update last activity
      await strapi.query('user-session').update({
        where: { id: session.id },
        data: { lastActivity: new Date() }
      });
    }

    return session;
  },

  async deactivateSession(sessionToken, userId) {
    await strapi.query('user-session').update({
      where: { sessionToken, userId },
      data: { isActive: false }
    });
  },

  async deactivateAllUserSessions(userId) {
    await strapi.query('user-session').update({
      where: { userId, isActive: true },
      data: { isActive: false }
    });
  },

  async cleanupExpiredSessions() {
    const expiredSessions = await strapi.query('user-session').findMany({
      where: {
        $or: [
          { expiresAt: { $lt: new Date() } },
          { isActive: false }
        ]
      }
    });

    for (const session of expiredSessions) {
      await strapi.query('user-session').delete({
        where: { id: session.id }
      });
    }

    return expiredSessions.length;
  },

  async getUserActiveSessions(userId) {
    return await strapi.query('user-session').findMany({
      where: {
        userId,
        isActive: true,
        expiresAt: {
          $gt: new Date()
        }
      },
      orderBy: { lastActivity: 'desc' }
    });
  }
});
