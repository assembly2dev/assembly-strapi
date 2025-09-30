export default [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
  {
    name: 'global::rate-limit',
    config: {
      match: ['/api/auth'],
      windowSec: process.env.LOGIN_RATE_LIMIT_WINDOW_SEC ? Number(process.env.LOGIN_RATE_LIMIT_WINDOW_SEC) : 60,
      max: process.env.LOGIN_RATE_LIMIT_MAX ? Number(process.env.LOGIN_RATE_LIMIT_MAX) : 10,
    },
  },
  {
    name: 'global::error-handler',
    config: {},
  },
  {
    name: 'global::validation',
    config: {},
  },
  {
    name: 'global::auth-permissions',
    config: {},
  },
];
