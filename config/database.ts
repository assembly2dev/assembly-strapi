// No Node built-ins to avoid TS type issues in config context

// Use SQLite by default for local development to avoid remote DB connection errors.
// Switch to Postgres by setting DATABASE_CLIENT=postgres (and related env vars).
export default ({ env }) => {
  const client = env('DATABASE_CLIENT', 'sqlite');

  if (client === 'postgres') {
    return {
      connection: {
        client: 'postgres',
        connection: {
          host: env('DATABASE_HOST'),
          port: env.int('DATABASE_PORT', 5432),
          database: env('DATABASE_NAME'),
          user: env('DATABASE_USERNAME'),
          password: env('DATABASE_PASSWORD'),
          ssl: env.bool('DATABASE_SSL', true)
            ? { rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', false) }
            : false,
          schema: env('DATABASE_SCHEMA', 'public'),
        },
        pool: {
          min: env.int('DATABASE_POOL_MIN', 2),
          max: env.int('DATABASE_POOL_MAX', 10),
          acquireTimeoutMillis: env.int('DATABASE_ACQUIRE_TIMEOUT', 60000),
          createTimeoutMillis: env.int('DATABASE_CREATE_TIMEOUT', 30000),
          destroyTimeoutMillis: env.int('DATABASE_DESTROY_TIMEOUT', 5000),
          idleTimeoutMillis: env.int('DATABASE_IDLE_TIMEOUT', 30000),
          reapIntervalMillis: env.int('DATABASE_REAP_INTERVAL', 1000),
          createRetryIntervalMillis: env.int('DATABASE_CREATE_RETRY_INTERVAL', 200),
        },
        acquireConnectionTimeout: env.int('DATABASE_ACQUIRE_CONNECTION_TIMEOUT', 60000),
        debug: env.bool('DATABASE_DEBUG', false),
      },
    };
  }

  // SQLite default
  return {
    connection: {
      client: 'sqlite',
      connection: {
        filename: env('DATABASE_FILENAME', '.tmp/data.db'),
      },
      useNullAsDefault: true,
    },
  };
};
