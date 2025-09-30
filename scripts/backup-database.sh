#!/bin/bash

# Database Backup Script for Assembly Authentication System
# This script creates automated backups of the PostgreSQL database

# Configuration
BACKUP_DIR="/var/backups/postgresql/assembly_auth"
DB_NAME="postgres"
DB_USER="root"
DB_HOST="assembly-db-singapore.cspkrkicfu7p.ap-southeast-1.rds.amazonaws.com"
DB_PORT="5432"
RETENTION_DAYS=7

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Generate timestamp for backup filename
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/backup_$TIMESTAMP.sql"

# Log function
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

# Check if PostgreSQL is running
if ! pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" > /dev/null 2>&1; then
    log "ERROR: PostgreSQL is not running or not accessible"
    exit 1
fi

# Create backup
log "Starting database backup..."
if pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" --no-password > "$BACKUP_FILE"; then
    log "Backup completed successfully: $BACKUP_FILE"
    
    # Compress the backup
    gzip "$BACKUP_FILE"
    log "Backup compressed: $BACKUP_FILE.gz"
    
    # Get backup size
    BACKUP_SIZE=$(du -h "$BACKUP_FILE.gz" | cut -f1)
    log "Backup size: $BACKUP_SIZE"
    
    # Clean up old backups
    log "Cleaning up backups older than $RETENTION_DAYS days..."
    find "$BACKUP_DIR" -name "backup_*.sql.gz" -mtime +$RETENTION_DAYS -delete
    
    # Count remaining backups
    REMAINING_BACKUPS=$(find "$BACKUP_DIR" -name "backup_*.sql.gz" | wc -l)
    log "Remaining backups: $REMAINING_BACKUPS"
    
    # Optional: Send notification (uncomment and configure as needed)
    # if command -v curl > /dev/null 2>&1; then
    #     curl -X POST "https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK" \
    #          -H "Content-Type: application/json" \
    #          -d "{\"text\":\"Database backup completed: $BACKUP_FILE.gz ($BACKUP_SIZE)\"}"
    # fi
    
else
    log "ERROR: Database backup failed"
    exit 1
fi

log "Backup process completed"
