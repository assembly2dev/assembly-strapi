/**
 * Content Manager Homepage Fix Middleware
 * 
 * This middleware intercepts problematic content-manager homepage endpoints
 * and returns mock data instead of 401 errors to prevent admin panel redirects.
 */

export default (config, { strapi }) => {
  return async (ctx, next) => {
    // Check if this is a problematic content-manager homepage endpoint
    if (ctx.path.startsWith('/content-manager/homepage/')) {
      // Return mock data for these endpoints to prevent 401 errors
      if (ctx.path.includes('count-documents')) {
        ctx.status = 200;
        ctx.body = { data: { count: 0 } };
        return;
      }
      
      if (ctx.path.includes('recent-documents')) {
        ctx.status = 200;
        ctx.body = { data: [] };
        return;
      }
      
      // For any other content-manager homepage endpoints
      ctx.status = 200;
      ctx.body = { data: null };
      return;
    }
    
    // For all other requests, continue normally
    await next();
  };
};
