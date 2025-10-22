export default ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT'),
    },
  },
  watchIgnoreFiles: [
    '**/config/sync/**',
  ],
  vite: {
    optimizeDeps: {
      exclude: ['@strapi/admin'],
    },
  },
  secrets: {
    encryptionKey: env('ENCRYPTION_KEY'),
  },
  flags: {
    nps: env.bool('FLAG_NPS', true),
    promoteEE: env.bool('FLAG_PROMOTE_EE', true),
  },
  // Disable problematic content-manager homepage features
  features: {
    'content-manager.homepage': false,
  },
});
