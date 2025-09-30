/**
 * course middlewares
 */

export default {
  // Middleware to filter published courses for public access
  'find-middleware': async (ctx, next) => {
    // If no auth, only show published courses
    if (!ctx.state.user) {
      if (!ctx.query.filters) {
        ctx.query.filters = {};
      }
      ctx.query.filters.status = { $eq: 'Published' };
    }
    await next();
  },

  'findOne-middleware': async (ctx, next) => {
    // If no auth, only allow access to published courses
    if (!ctx.state.user) {
      const { id } = ctx.params;
      const course = await strapi.entityService.findOne('api::course.course', id, {
        fields: ['status']
      });
      
      if (!course || course.status !== 'Published') {
        return ctx.notFound('Course not found');
      }
    }
    await next();
  }
};
