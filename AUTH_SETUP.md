# Assembly Strapi Authentication System Setup Guide

## Overview
This document provides complete setup instructions for the email verification-based authentication system using Strapi CMS and PostgreSQL.

## Prerequisites
- Node.js 18+ 
- PostgreSQL 12+ (AWS RDS)
- SendGrid account (for email delivery)
- Strapi 5.x

## Installation Steps

### 1. Install Dependencies
```bash
npm install @strapi/plugin-email @strapi/provider-email-sendgrid --legacy-peer-deps
```

### 2. Environment Configuration
Create a `.env` file in the root directory with the following variables:

```bash
# Strapi Configuration
HOST=0.0.0.0
PORT=1337
APP_KEYS=your-app-keys-here
API_TOKEN_SALT=your-api-token-salt-here
ADMIN_JWT_SECRET=your-admin-jwt-secret-here
JWT_SECRET=your-jwt-secret-here

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

# Email Configuration
SENDGRID_API_KEY=your-sendgrid-api-key
EMAIL_FROM=noreply@assembly.com
EMAIL_REPLY_TO=support@assembly.com

# Security Configuration
SESSION_SECRET=your-session-secret
COOKIE_SECRET=your-cookie-secret
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=5

# CORS Configuration
CORS_ORIGIN=http://localhost:3000,https://yourdomain.com
```

### 3. Database Setup

#### AWS RDS PostgreSQL
The system is configured to use the live AWS RDS PostgreSQL database:
- **Host**: assembly-db-singapore.cspkrkicfu7p.ap-southeast-1.rds.amazonaws.com
- **Port**: 5432
- **Database**: postgres
- **User**: root
- **SSL**: Enabled (required for AWS RDS)

#### Database Connection Test
```bash
# Test database connection
psql -h assembly-db-singapore.cspkrkicfu7p.ap-southeast-1.rds.amazonaws.com \
     -p 5432 \
     -U root \
     -d postgres \
     -c "SELECT version();"
```

### 4. Run Database Migrations
```bash
# Build the application
npm run build

# Start Strapi (this will run migrations automatically)
npm run develop
```

### 5. Create Admin User
1. Start Strapi: `npm run develop`
2. Navigate to `http://localhost:1337/admin`
3. Create your first admin user
4. Go to Content-Type Builder and publish the new content types:
   - Auth Log
   - User Session

### 6. Configure Email Provider
1. Sign up for SendGrid at https://sendgrid.com
2. Create an API key
3. Add the API key to your `.env` file
4. Verify your sender domain in SendGrid

## API Endpoints

### Authentication Endpoints

#### 1. Send Verification Code
```http
POST /api/auth/send-verification
Content-Type: application/json

{
  "email": "user@example.com"
}
```

#### 2. Verify Code and Login
```http
POST /api/auth/verify-code
Content-Type: application/json

{
  "email": "user@example.com",
  "code": "123456"
}
```

#### 3. Resend Verification Code
```http
POST /api/auth/resend-verification
Content-Type: application/json

{
  "email": "user@example.com"
}
```

#### 4. Logout
```http
POST /api/auth/logout
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "sessionToken": "session_token_here"
}
```

#### 5. Get User Profile
```http
GET /api/auth/profile
Authorization: Bearer <jwt_token>
```

## Security Features

### Rate Limiting
- Maximum 5 verification requests per 15 minutes per user
- Account locked for 15 minutes after 5 failed attempts
- Automatic unlock after lock period expires

### Session Management
- JWT tokens with 24-hour expiration
- Session tracking with IP and user agent
- Automatic cleanup of expired sessions

### Audit Logging
- All authentication events logged
- IP address and user agent tracking
- Failed attempt monitoring
- Security report generation

## Database Schema

### Users Table Extensions
- `emailVerified`: Boolean flag for email verification status
- `verificationCode`: 6-digit verification code
- `verificationCodeExpires`: Code expiration timestamp
- `lastLoginAttempt`: Last login attempt timestamp
- `loginAttempts`: Number of failed attempts
- `accountLocked`: Account lock status
- `accountLockedUntil`: Account lock expiration
- `firstName`, `lastName`: User profile fields
- `phoneNumber`: Contact information
- `lastActive`: Last activity timestamp
- `isActive`: Account status

### Auth Logs Table
- `userId`: Reference to user
- `action`: Type of authentication event
- `email`: Email used in attempt
- `ipAddress`: Client IP address
- `userAgent`: Client user agent
- `success`: Success status
- `errorMessage`: Error details
- `metadata`: Additional event data

### User Sessions Table
- `userId`: Reference to user
- `sessionToken`: Unique session identifier
- `refreshToken`: Token refresh capability
- `expiresAt`: Session expiration
- `ipAddress`: Session creation IP
- `userAgent`: Session creation user agent
- `isActive`: Session status
- `lastActivity`: Last activity timestamp

## Performance Optimization

### Database Indexes
- Email lookup optimization
- Verification code queries
- Session management
- Audit log queries
- Account lock status

### Connection Pooling
- Minimum 2 connections
- Maximum 10 connections
- 60-second acquire timeout
- Automatic connection cleanup

## Monitoring and Maintenance

### Automated Cleanup Tasks
- Expired session cleanup (hourly)
- Old auth log cleanup (30-day retention)
- Expired account unlock
- Expired verification code cleanup

### Security Monitoring
- Failed login attempt tracking
- Suspicious activity detection
- IP address monitoring
- User agent analysis

## Testing

### Test Cases
1. Send verification code to valid email
2. Send verification code to non-existent email
3. Verify code with correct code
4. Verify code with incorrect code
5. Verify code with expired code
6. Resend verification code
7. Rate limiting functionality
8. Account locking after multiple attempts

### Test Commands
```bash
# Test email sending
curl -X POST http://localhost:1337/api/auth/send-verification \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'

# Test code verification
curl -X POST http://localhost:1337/api/auth/verify-code \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "code": "123456"}'
```

## Production Deployment

### Environment Setup
1. Use production PostgreSQL instance (AWS RDS)
2. Configure SSL for database connections
3. Set up automated backups
4. Configure monitoring and alerting
5. Use production SendGrid account
6. Set up proper CORS configuration

### Security Checklist
- [ ] HTTPS enabled
- [ ] Strong JWT secrets
- [ ] Database SSL enabled
- [ ] Rate limiting configured
- [ ] Audit logging enabled
- [ ] Session management active
- [ ] Automated cleanup running
- [ ] Monitoring configured

### Backup Strategy
```bash
#!/bin/bash
# Daily backup script for AWS RDS
BACKUP_DIR="/var/backups/postgresql"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="postgres"

# Create backup
pg_dump -h assembly-db-singapore.cspkrkicfu7p.ap-southeast-1.rds.amazonaws.com \
        -U root \
        -d postgres \
        --no-password > $BACKUP_DIR/backup_$DATE.sql

# Keep only last 7 days
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete
```

## Troubleshooting

### Common Issues

#### Email Not Sending
- Check SendGrid API key
- Verify sender domain
- Check email configuration
- Review SendGrid logs

#### Database Connection Issues
- Verify database credentials
- Check network connectivity
- Validate SSL configuration
- Review connection pool settings

#### Rate Limiting Problems
- Check user account status
- Review auth logs
- Verify rate limiting configuration
- Check for account locks

### Log Analysis
```sql
-- Check recent auth events
SELECT * FROM auth_logs 
WHERE createdAt > NOW() - INTERVAL '1 hour' 
ORDER BY createdAt DESC;

-- Check failed login attempts
SELECT * FROM auth_logs 
WHERE action = 'login_attempt' AND success = false 
AND createdAt > NOW() - INTERVAL '24 hours';

-- Check active sessions
SELECT * FROM user_sessions 
WHERE isActive = true AND expiresAt > NOW();
```

## Support

For issues and questions:
1. Check the logs in `./logs/`
2. Review database connection
3. Verify environment variables
4. Test email configuration
5. Check rate limiting status

## License

This authentication system is part of the Assembly platform.
