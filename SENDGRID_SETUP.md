# SendGrid Email Configuration Guide

## Overview
This guide will help you configure SendGrid as your email provider for the Assembly Strapi authentication system.

## Prerequisites
- SendGrid account (sign up at https://sendgrid.com)
- Verified domain in SendGrid
- API key from SendGrid dashboard

## Configuration Steps

### 1. Update Environment Variables

Update your `.env` file with the following SendGrid configuration:

```bash
# Email Configuration
SENDGRID_API_KEY=your-sendgrid-api-key-here
EMAIL_FROM=noreply@assembly.com
EMAIL_REPLY_TO=support@assembly.com
```

### 2. Get Your SendGrid API Key

1. Log in to your SendGrid dashboard
2. Go to **Settings** → **API Keys**
3. Click **Create API Key**
4. Choose **Restricted Access** and select permissions:
   - ✅ **Mail Send** (Full Access)
   - ✅ **Mail Settings** (Read Access)
5. Click **Create & View**
6. **Copy the API key immediately** - it will only be shown once!

### 3. Verify Your Domain

1. In SendGrid dashboard, go to **Settings** → **Sender Authentication**
2. Click **Authenticate Your Domain**
3. Enter your domain (e.g., `assembly.com`)
4. Follow the DNS verification steps
5. Wait for domain verification to complete

### 4. Set Up Sender Email

1. In SendGrid dashboard, go to **Settings** → **Sender Authentication**
2. Click **Single Sender Verification**
3. Add your sender email address (e.g., `noreply@assembly.com`)
4. Verify the email address

### 5. Test Email Configuration

After updating your `.env` file, restart your Strapi server:

```bash
npm run develop
```

Then test the authentication system:

```bash
node scripts/test-auth.js
```

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `SENDGRID_API_KEY` | Your SendGrid API key | `SG.abc123...` |
| `EMAIL_FROM` | Sender email address | `noreply@assembly.com` |
| `EMAIL_REPLY_TO` | Reply-to email address | `support@assembly.com` |

## Troubleshooting

### Common Issues

#### "Missing SENDGRID_API_KEY" Error
- Ensure your `.env` file contains the correct `SENDGRID_API_KEY`
- Verify the API key is valid and has mail send permissions
- Restart Strapi after updating environment variables

#### "Invalid API Key" Error
- Check that your API key is correctly copied from SendGrid dashboard
- Ensure the API key has the necessary permissions
- Verify your SendGrid account is active

#### "Domain Not Verified" Error
- Complete domain verification in SendGrid dashboard
- Ensure DNS records are properly configured
- Wait for DNS propagation (can take up to 24 hours)

#### "Sender Not Verified" Error
- Verify your sender email address in SendGrid
- Ensure the sender email is associated with a verified domain
- Check that the sender email matches your domain

### Testing Email Delivery

1. **Check SendGrid Activity**: Go to your SendGrid dashboard and check the **Activity** section for email delivery status

2. **Test with a Simple Email**: Use the test script to send a verification email:
   ```bash
   curl -X POST http://localhost:1337/api/auth/sign-up \
     -H "Content-Type: application/json" \
     -d '{"email": "test@example.com", "username": "testuser", "password": "testpassword123", "acceptTerms": true}'
   ```

3. **Check Email Templates**: Ensure your email templates in `src/emails/` are properly formatted

## SendGrid Benefits

- **High Deliverability**: Excellent inbox placement rates
- **Detailed Analytics**: Track email opens, clicks, and bounces
- **Reliable Service**: 99.9% uptime guarantee
- **Easy Integration**: Simple API and comprehensive documentation
- **Free Tier**: 100 emails per day for free

## Support

For SendGrid-specific issues:
- SendGrid Documentation: https://docs.sendgrid.com/
- SendGrid Support: https://support.sendgrid.com/

For Assembly Strapi issues:
- Check the authentication system logs
- Review the `AUTH_SETUP.md` guide
- Test with the provided scripts
