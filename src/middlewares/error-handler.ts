/**
 * Global error handling middleware
 */

export default (config, { strapi }) => {
  return async (ctx, next) => {
    try {
      await next();
    } catch (error) {
      strapi.log.error('API Error:', error);
      
      // Handle different types of errors
      if (error.name === 'ValidationError') {
        return ctx.badRequest('Validation Error', {
          message: error.message,
          details: error.details
        });
      }
      
      if (error.name === 'CastError') {
        return ctx.badRequest('Invalid ID format');
      }
      
      if (error.code === 11000) {
        return ctx.badRequest('Duplicate entry', {
          field: Object.keys(error.keyPattern)[0]
        });
      }
      
      if (error.status === 401) {
        return ctx.unauthorized(error.message || 'Unauthorized');
      }
      
      if (error.status === 403) {
        return ctx.forbidden(error.message || 'Forbidden');
      }
      
      if (error.status === 404) {
        return ctx.notFound(error.message || 'Not found');
      }
      
      // Default error response
      const status = error.status || 500;
      const message = error.message || 'Internal server error';
      
      ctx.status = status;
      ctx.body = {
        error: {
          status,
          name: error.name || 'Error',
          message,
          details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }
      };
    }
  };
};
