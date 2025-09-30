# Environment Setup Guide

## Required Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# Strapi Configuration
HOST=0.0.0.0
PORT=1337
APP_KEYS=your-app-keys-here,another-app-key,third-app-key,fourth-app-key
API_TOKEN_SALT=your-api-token-salt-here
ADMIN_JWT_SECRET=your-admin-jwt-secret-here
JWT_SECRET=your-jwt-secret-here
TRANSFER_TOKEN_SALT=your-transfer-token-salt-here
ENCRYPTION_KEY=your-encryption-key-here

# Database Configuration (AWS RDS)
DATABASE_HOST=assembly-db-singapore.cspkrkicfu7p.ap-southeast-1.rds.amazonaws.com
DATABASE_PORT=5432
DATABASE_NAME=postgres
DATABASE_USERNAME=root
DATABASE_PASSWORD=assembly1234singapore
DATABASE_SSL=true
DATABASE_SSL_REJECT_UNAUTHORIZED=false
DATABASE_SCHEMA=public
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10
DATABASE_ACQUIRE_CONNECTION_TIMEOUT=60000
DATABASE_DEBUG=false

# Email Configuration (SendGrid)
SENDGRID_API_KEY=your-sendgrid-api-key
EMAIL_FROM=noreply@assembly.com
EMAIL_REPLY_TO=support@assembly.com

# Security Configuration
SESSION_SECRET=your-session-secret
COOKIE_SECRET=your-cookie-secret
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=5
LOGIN_RATE_LIMIT_WINDOW_SEC=60
LOGIN_RATE_LIMIT_MAX=10

# CORS Configuration
CORS_ORIGIN=http://localhost:3000,https://yourdomain.com

# Feature Flags
FLAG_NPS=true
FLAG_PROMOTE_EE=true
```

## Quick Setup Commands

1. **Generate secure secrets:**
```bash
# Generate APP_KEYS (4 comma-separated values)
node -e "console.log(Array.from({length: 4}, () => require('crypto').randomBytes(32).toString('base64')).join(','))"

# Generate JWT secrets
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"
```

2. **Create the .env file:**
```bash
cp .env.example .env
# Then edit .env with your actual values
```

3. **Start the application:**
```bash
npm run develop
```

## Critical Variables for Authentication

The following variables are **REQUIRED** for authentication to work:

- `APP_KEYS` - Used for JWT token signing
- `JWT_SECRET` - Used for user authentication tokens
- `ADMIN_JWT_SECRET` - Used for admin panel authentication
- `API_TOKEN_SALT` - Used for API token generation

Without these, you will get 401 Unauthorized errors.

## Database Connection

The project is configured to use AWS RDS PostgreSQL. Make sure:
1. The database is accessible from your network
2. The credentials are correct
3. SSL is properly configured

## Next Steps

1. Create the `.env` file with the above configuration
2. Replace placeholder values with actual secrets
3. Restart the Strapi server
4. Test authentication endpoints
