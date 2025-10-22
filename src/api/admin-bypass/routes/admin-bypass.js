/**
 * Admin Bypass Route
 * 
 * This creates a simple admin interface that bypasses Strapi's broken admin panel
 */

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/admin-bypass',
      handler: 'admin-bypass.index',
      config: {
        auth: false,
      },
    },
    {
      method: 'POST',
      path: '/admin-bypass/login',
      handler: 'admin-bypass.login',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/admin-bypass/dashboard',
      handler: 'admin-bypass.dashboard',
      config: {
        auth: false,
      },
    },
  ],
};
