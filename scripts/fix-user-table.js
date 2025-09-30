#!/usr/bin/env node

/**
 * Fix User Table Script for Assembly Strapi Authentication System
 * 
 * This script adds missing columns to the up_users table to support the authentication system.
 */

const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  database: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

async function fixUserTable() {
  try {
    console.log('🔌 Connecting to PostgreSQL database...');
    await client.connect();
    console.log('✅ Connected to database successfully');

    // Check current columns
    console.log('\n🔍 Checking current up_users table structure...');
    const columnsResult = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'up_users' 
      AND table_schema = 'public'
      ORDER BY ordinal_position
    `);

    console.log('Current columns:');
    const existingColumns = columnsResult.rows.map(row => row.column_name);
    columnsResult.rows.forEach(row => {
      console.log(`  - ${row.column_name} (${row.data_type})`);
    });

    // Define columns to add
    const columnsToAdd = [
      { name: 'email', type: 'VARCHAR(255)', nullable: true },
      { name: 'username', type: 'VARCHAR(255)', nullable: true },
      { name: 'password', type: 'VARCHAR(255)', nullable: true },
      { name: 'confirmed', type: 'BOOLEAN', nullable: true, default: 'false' },
      { name: 'blocked', type: 'BOOLEAN', nullable: true, default: 'false' },
      { name: 'emailVerified', type: 'BOOLEAN', nullable: true, default: 'false' },
      { name: 'verificationCode', type: 'VARCHAR(6)', nullable: true },
      { name: 'verificationCodeExpires', type: 'TIMESTAMP', nullable: true },
      { name: 'lastLoginAttempt', type: 'TIMESTAMP', nullable: true },
      { name: 'loginAttempts', type: 'INTEGER', nullable: true, default: '0' },
      { name: 'accountLocked', type: 'BOOLEAN', nullable: true, default: 'false' },
      { name: 'accountLockedUntil', type: 'TIMESTAMP', nullable: true },
      { name: 'firstName', type: 'VARCHAR(255)', nullable: true },
      { name: 'lastName', type: 'VARCHAR(255)', nullable: true },
      { name: 'phoneNumber', type: 'VARCHAR(255)', nullable: true },
      { name: 'lastActive', type: 'TIMESTAMP', nullable: true },
      { name: 'isActive', type: 'BOOLEAN', nullable: true, default: 'true' }
    ];

    // Add missing columns
    console.log('\n🔧 Adding missing columns...');
    for (const column of columnsToAdd) {
      if (!existingColumns.includes(column.name)) {
        const defaultClause = column.default ? ` DEFAULT ${column.default}` : '';
        const nullableClause = column.nullable ? '' : ' NOT NULL';
        
        try {
          await client.query(`
            ALTER TABLE up_users 
            ADD COLUMN ${column.name} ${column.type}${defaultClause}${nullableClause}
          `);
          console.log(`✅ Added column: ${column.name}`);
        } catch (error) {
          console.log(`❌ Failed to add column ${column.name}: ${error.message}`);
        }
      } else {
        console.log(`⏭️  Column ${column.name} already exists`);
      }
    }

    // Create indexes for performance
    console.log('\n🔧 Creating indexes...');
    const indexesToCreate = [
      { name: 'idx_up_users_email', column: 'email' },
      { name: 'idx_up_users_username', column: 'username' },
      { name: 'idx_up_users_verification_code', column: 'verificationCode' },
      { name: 'idx_up_users_verification_expires', column: 'verificationCodeExpires' },
      { name: 'idx_up_users_account_locked', column: 'accountLocked' },
      { name: 'idx_up_users_login_attempts', column: 'loginAttempts' },
      { name: 'idx_up_users_email_verified', column: 'emailVerified' }
    ];

    for (const index of indexesToCreate) {
      try {
        await client.query(`
          CREATE INDEX IF NOT EXISTS ${index.name} ON up_users(${index.column})
        `);
        console.log(`✅ Created index: ${index.name}`);
      } catch (error) {
        console.log(`❌ Failed to create index ${index.name}: ${error.message}`);
      }
    }

    // Verify final structure
    console.log('\n🔍 Final table structure:');
    const finalColumnsResult = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'up_users' 
      AND table_schema = 'public'
      ORDER BY ordinal_position
    `);

    finalColumnsResult.rows.forEach(row => {
      console.log(`  - ${row.column_name} (${row.data_type})`);
    });

    console.log('\n🎉 User table fix completed!');
    console.log('\n📝 Next steps:');
    console.log('1. Test the authentication endpoints');
    console.log('2. Run: node scripts/test-auth.js');

  } catch (error) {
    console.error('❌ Database fix error:', error.message);
  } finally {
    await client.end();
  }
}

// Run the fix
fixUserTable().catch(console.error);
