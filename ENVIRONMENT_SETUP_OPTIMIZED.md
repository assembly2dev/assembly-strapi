# Optimized Environment Setup Guide

## Database Connection Pool Optimization

The KnexTimeoutError indicates the database connection pool is exhausted. Here's an optimized configuration:

```bash
# Strapi Configuration
HOST=0.0.0.0
PORT=1337
APP_KEYS=GEAM0WMbKIZ8fwgGrQCeaTH1NA0ruzNz/ztPAu5XCTE=,rhldQ3VXUc+gQSzxtAcODSOUrJT97l5lqEzjuB4q1DU=,8malaYo139LSlHOdDYVm4UBaP21sKXI+UOICQLFlXhw=,D1czGUUs+OsAW0FvnVMAABBlkS48tgU6RVju5tFwO58=
API_TOKEN_SALT=xoIC482xcVbm+1kxlTThwQRBowsMEeJcNBwU2cOwm/c=
ADMIN_JWT_SECRET=vn2kR97NEGDN6jAbtnH/fFoHV930FI2LmLuGGPXYPBBLr38Un52uIBCQ0ZbaA8TYLQsTVQjN+FJKc65JbO82Qg==
JWT_SECRET=uYXrDtFzD/Vk45zanL/1Ng/EzP8Iup5N4+KZFME3Gom55N0q7xgU+Inomv+JTuQsHV9DK4W/E7yRFAFt639+4Q==
TRANSFER_TOKEN_SALT=your-transfer-token-salt-here
ENCRYPTION_KEY=your-encryption-key-here

# Database Configuration (AWS RDS) - OPTIMIZED
DATABASE_CLIENT=postgres
DATABASE_HOST=assembly-db-singapore.cspkrkicfu7p.ap-southeast-1.rds.amazonaws.com
DATABASE_PORT=5432
DATABASE_NAME=postgres
DATABASE_USERNAME=root
DATABASE_PASSWORD=assembly1234singapore
DATABASE_SSL=true
DATABASE_SSL_REJECT_UNAUTHORIZED=false
DATABASE_SCHEMA=public

# OPTIMIZED Connection Pool Settings
DATABASE_POOL_MIN=1
DATABASE_POOL_MAX=5
DATABASE_ACQUIRE_CONNECTION_TIMEOUT=30000
DATABASE_ACQUIRE_TIMEOUT=30000
DATABASE_CREATE_TIMEOUT=10000
DATABASE_DESTROY_TIMEOUT=5000
DATABASE_IDLE_TIMEOUT=10000
DATABASE_REAP_INTERVAL=1000
DATABASE_CREATE_RETRY_INTERVAL=100
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

## Key Optimizations Made:

1. **Reduced Pool Size**: `DATABASE_POOL_MAX=5` (from 10) to prevent pool exhaustion
2. **Shorter Timeouts**: Reduced connection timeouts to fail faster
3. **Faster Cleanup**: Reduced idle timeout to release connections quicker
4. **Explicit Client**: Set `DATABASE_CLIENT=postgres` to ensure PostgreSQL is used

## Quick Setup Commands:

```bash
# 1. Create the .env file with optimized settings
cp .env.example .env
# Edit .env with the optimized values above

# 2. Start Strapi with debug mode to see connection details
npm run develop -- --debug

# 3. If still having issues, try with SQLite for local testing
# Set DATABASE_CLIENT=sqlite in .env
```

## Troubleshooting:

- **Connection Pool Full**: Reduce `DATABASE_POOL_MAX` to 3 or 2
- **Slow Queries**: Increase `DATABASE_ACQUIRE_CONNECTION_TIMEOUT` to 60000
- **AWS RDS Issues**: Check if RDS instance is accessible and not overloaded
- **Local Development**: Consider using SQLite (`DATABASE_CLIENT=sqlite`) for faster local development
