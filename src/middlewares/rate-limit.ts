export default (config, { strapi }) => {
  return async (ctx, next) => {
    // Only apply rate limiting to API auth routes, never to admin endpoints
    const path = ctx.path;
    if (!path.startsWith('/api/auth')) {
      return await next();
    }

    const { email } = ctx.request.body;
    
    if (email) {
      try {
        const user = await strapi.query('plugin::users-permissions.user').findOne({
          where: { email: email.toLowerCase() }
        });

        if (user) {
          // Check if user is locked
          if (user.accountLocked && new Date() < new Date(user.accountLockedUntil)) {
            return ctx.tooManyRequests('Account temporarily locked. Please try again later.');
          }

          // Check rate limiting for verification requests
          const recentAttempts = await strapi.query('auth-log').findMany({
            where: {
              userId: user.id,
              action: {
                $in: ['verification_sent', 'verification_resent', 'login_attempt']
              },
              createdAt: {
                $gte: new Date(Date.now() - 15 * 60 * 1000) // Last 15 minutes
              }
            }
          });

          if (recentAttempts.length >= 5) {
            // Lock account for 15 minutes
            const lockUntil = new Date(Date.now() + 15 * 60 * 1000);
            await strapi.query('plugin::users-permissions.user').update({
              where: { id: user.id },
              data: {
                accountLocked: true,
                accountLockedUntil: lockUntil
              }
            });

            return ctx.tooManyRequests('Too many attempts. Account locked for 15 minutes.');
          }
        }
      } catch (error) {
        strapi.log.error('Rate limiting error:', error);
        // Continue with request if rate limiting check fails
      }
    }

    await next();
  };
};


