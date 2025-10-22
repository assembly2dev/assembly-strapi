export default (config, { strapi }) => {
  return async (ctx, next) => {
    try {
      // Add database health check for critical endpoints
      if (ctx.path.includes('/api/auth/') || ctx.path.includes('/api/course/')) {
        // Quick database connectivity test
        await strapi.db.connection.raw('SELECT 1');
      }
      
      await next();
    } catch (error) {
      // Log database connection issues
      if (error.message.includes('timeout') || error.message.includes('connection')) {
        strapi.log.error('Database connection issue detected:', {
          path: ctx.path,
          method: ctx.method,
          error: error.message,
          timestamp: new Date().toISOString()
        });
        
        // Return appropriate error response
        ctx.status = 503;
        ctx.body = {
          error: 'Service temporarily unavailable',
          message: 'Database connection issue. Please try again later.',
          timestamp: new Date().toISOString()
        };
        return;
      }
      
      // Re-throw other errors
      throw error;
    }
  };
};
