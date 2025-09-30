export default {
  routes: [
    {
      method: 'POST',
      path: '/auth/login',
      handler: 'auth.login',
      config: { auth: false },
    },
    {
      method: 'POST',
      path: '/auth/login/verify-2fa',
      handler: 'auth.verify2fa',
      config: { auth: false },
    },
    {
      method: 'POST',
      path: '/auth/sign-up',
      handler: 'auth.signUp',
      config: { auth: false },
    },
    {
      method: 'POST',
      path: '/auth/verify-email',
      handler: 'auth.verifyEmail',
      config: { auth: false },
    },
    {
      method: 'POST',
      path: '/auth/retrieve-password',
      handler: 'auth.retrievePassword',
      config: { auth: false },
    },
    {
      method: 'POST',
      path: '/auth/reset-password',
      handler: 'auth.resetPassword',
      config: { auth: false },
    },
    {
      method: 'POST',
      path: '/auth/2fa/setup/init',
      handler: 'auth.twofaInit',
      config: {
        auth: {
          scope: ['authenticated']
        }
      },
    },
    {
      method: 'POST',
      path: '/auth/2fa/setup/confirm',
      handler: 'auth.twofaConfirm',
      config: {
        auth: {
          scope: ['authenticated']
        }
      },
    },
    {
      method: 'POST',
      path: '/auth/2fa/disable',
      handler: 'auth.twofaDisable',
      config: {
        auth: {
          scope: ['authenticated']
        }
      },
    },
    {
      method: 'POST',
      path: '/auth/logout',
      handler: 'auth.logout',
      config: {
        auth: {
          scope: ['authenticated']
        },
        policies: [],
        middlewares: [],
        description: 'Logout user and invalidate session',
        tag: {
          plugin: 'auth',
          name: 'Auth',
          actionType: 'create'
        }
      },
    },
    {
      method: 'GET',
      path: '/auth/profile',
      handler: 'auth.getProfile',
      config: {
        auth: {
          scope: ['authenticated']
        },
        policies: [],
        middlewares: [],
        description: 'Get current user profile',
        tag: {
          plugin: 'auth',
          name: 'Auth',
          actionType: 'find'
        }
      },
    },
  ],
};


