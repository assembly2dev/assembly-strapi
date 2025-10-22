#!/bin/bash

# Database Timeout Fix Script
# This script helps apply the database connection pool optimization

echo "🔧 Database Timeout Fix Script"
echo "=============================="

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found!"
    echo "Please create a .env file first."
    exit 1
fi

# Backup current .env file
echo "📋 Creating backup of current .env file..."
cp .env .env.backup.$(date +%Y%m%d_%H%M%S)

echo "✅ Backup created: .env.backup.$(date +%Y%m%d_%H%M%S)"

# Create optimized .env content
echo "🔧 Applying database timeout fixes..."

# Update the database pool settings in .env
sed -i.tmp 's/DATABASE_POOL_MIN=.*/DATABASE_POOL_MIN=2/' .env
sed -i.tmp 's/DATABASE_POOL_MAX=.*/DATABASE_POOL_MAX=8/' .env
sed -i.tmp 's/DATABASE_ACQUIRE_CONNECTION_TIMEOUT=.*/DATABASE_ACQUIRE_CONNECTION_TIMEOUT=60000/' .env
sed -i.tmp 's/DATABASE_ACQUIRE_TIMEOUT=.*/DATABASE_ACQUIRE_TIMEOUT=60000/' .env
sed -i.tmp 's/DATABASE_CREATE_TIMEOUT=.*/DATABASE_CREATE_TIMEOUT=30000/' .env
sed -i.tmp 's/DATABASE_IDLE_TIMEOUT=.*/DATABASE_IDLE_TIMEOUT=30000/' .env
sed -i.tmp 's/DATABASE_DEBUG=.*/DATABASE_DEBUG=true/' .env

# Clean up temporary files
rm -f .env.tmp

echo "✅ Database pool settings updated!"
echo ""
echo "📊 New Settings Applied:"
echo "  - DATABASE_POOL_MIN=2"
echo "  - DATABASE_POOL_MAX=8"
echo "  - DATABASE_ACQUIRE_CONNECTION_TIMEOUT=60000"
echo "  - DATABASE_ACQUIRE_TIMEOUT=60000"
echo "  - DATABASE_CREATE_TIMEOUT=30000"
echo "  - DATABASE_IDLE_TIMEOUT=30000"
echo "  - DATABASE_DEBUG=true"
echo ""
echo "🚀 Next Steps:"
echo "1. Restart your Strapi application:"
echo "   npm run develop"
echo ""
echo "2. Monitor the logs for connection pool activity"
echo "3. Test your application with concurrent requests"
echo ""
echo "📖 For more details, see: DATABASE_TIMEOUT_FIX.md"
echo ""
echo "✅ Fix applied successfully!"
