/**
 * Authentication and permissions middleware
 */

export default (config, { strapi }) => {
  return async (ctx, next) => {
    // Skip authentication for public endpoints
    const publicEndpoints = [
      'GET /api/courses',
      'GET /api/courses/:id',
      'POST /api/courses',
      'PUT /api/courses/:id',
      'DELETE /api/courses/:id',
      'GET /api/instructors',
      'GET /api/instructors/:id',
      'GET /api/reviews',
      'GET /api/reviews/:id',
      // System endpoints
      'GET /_health',
      'GET /_health/',
      'GET /admin',
      'GET /admin/',
      'GET /admin/*',
      'GET /documentation',
      'GET /documentation/',
      'GET /documentation/*',
      // Auth endpoints (handled by Strapi's built-in auth)
      'POST /api/auth/*',
      'GET /api/auth/*',
      // Upload endpoints
      'GET /uploads/*',
      'POST /upload',
      'POST /upload/*'
    ];
    
    const method = ctx.method;
    const path = ctx.path;
    const endpoint = `${method} ${path.replace(/\/\d+$/, '/:id')}`;
    
    // Check if endpoint is public
    const isPublicEndpoint = publicEndpoints.some(publicEndpoint => {
      if (publicEndpoint.includes('*')) {
        // Handle wildcard patterns
        const pattern = publicEndpoint.replace('*', '.*');
        const regex = new RegExp(`^${pattern.replace(/\//g, '\\/')}$`);
        return regex.test(endpoint);
      }
      return publicEndpoint === endpoint;
    });
    
    if (isPublicEndpoint) {
      return await next();
    }
    
    // Check if user is authenticated
    if (!ctx.state.user) {
      return ctx.unauthorized('Authentication required');
    }
    
    // Check user permissions based on role
    const user = ctx.state.user;
    const userRole = user.role?.type || 'authenticated';
    
    // Define role-based permissions
    const permissions = {
      'admin': ['*'], // Admin can do everything
      'editor': [
        'api::course.course.create',
        'api::course.course.update',
        'api::course.course.delete',
        'api::instructor.instructor.create',
        'api::instructor.instructor.update',
        'api::instructor.instructor.delete',
        'api::review.review.create',
        'api::review.review.update',
        'api::review.review.delete'
      ],
      'viewer': [
        'api::course.course.find',
        'api::instructor.instructor.find',
        'api::review.review.find'
      ],
      'authenticated': [
        'api::review.review.create'
      ]
    };
    
    // Extract permission from the endpoint
    const endpointPermission = extractPermissionFromEndpoint(endpoint);
    
    // Check if user has permission
    const userPermissions = permissions[userRole] || [];
    const hasPermission = userPermissions.includes('*') || userPermissions.includes(endpointPermission);
    
    if (!hasPermission) {
      return ctx.forbidden('Insufficient permissions');
    }
    
    await next();
  };
};

function extractPermissionFromEndpoint(endpoint: string): string {
  const [method, path] = endpoint.split(' ');
  const pathParts = path.split('/');
  
  if (pathParts.length >= 3) {
    const contentType = pathParts[2]; // e.g., 'courses', 'instructors', 'reviews'
    const action = method.toLowerCase();
    
    return `api::${contentType.slice(0, -1)}.${contentType.slice(0, -1)}.${action}`;
  }
  
  return '';
}
