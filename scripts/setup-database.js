#!/usr/bin/env node

/**
 * Database Setup Script for Assembly Strapi Authentication System
 * 
 * This script helps set up the database schema for the authentication system.
 * Run this after publishing content types in the Strapi admin panel.
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

async function setupDatabase() {
  try {
    console.log('🔌 Connecting to PostgreSQL database...');
    await client.connect();
    console.log('✅ Connected to database successfully');

    // Check if Strapi tables exist
    console.log('\n📋 Checking existing tables...');
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name LIKE '%user%' OR table_name LIKE '%auth%'
      ORDER BY table_name
    `);
    
    console.log('Existing tables:');
    tablesResult.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });

    // Check if up_users table exists and has email column
    console.log('\n🔍 Checking up_users table structure...');
    const columnsResult = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'up_users' 
      AND table_schema = 'public'
      ORDER BY ordinal_position
    `);

    if (columnsResult.rows.length > 0) {
      console.log('up_users table columns:');
      columnsResult.rows.forEach(row => {
        console.log(`  - ${row.column_name} (${row.data_type})`);
      });
    } else {
      console.log('❌ up_users table does not exist');
      console.log('📝 You need to:');
      console.log('   1. Go to http://localhost:1337/admin');
      console.log('   2. Create an admin user if not already done');
      console.log('   3. Go to Content-Type Builder');
      console.log('   4. Publish the User content type');
      console.log('   5. Run this script again');
    }

    // Check for auth-related tables
    console.log('\n🔍 Checking auth-related tables...');
    const authTables = ['auth_logs', 'user_sessions', 'auth_tokens'];
    
    for (const tableName of authTables) {
      const exists = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = $1
        )
      `, [tableName]);
      
      if (exists.rows[0].exists) {
        console.log(`✅ ${tableName} table exists`);
      } else {
        console.log(`❌ ${tableName} table does not exist`);
      }
    }

    console.log('\n📝 Next steps:');
    console.log('1. If up_users table exists, the basic Strapi setup is complete');
    console.log('2. If auth tables are missing, you need to publish content types:');
    console.log('   - Go to http://localhost:1337/admin');
    console.log('   - Navigate to Content-Type Builder');
    console.log('   - Publish: Auth Log, User Session, Auth Token');
    console.log('3. After publishing, run the database migrations:');
    console.log('   - node scripts/run-migrations.js');

  } catch (error) {
    console.error('❌ Database setup error:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check your .env file has correct database credentials');
    console.log('2. Ensure the PostgreSQL server is accessible');
    console.log('3. Verify SSL settings if using AWS RDS');
  } finally {
    await client.end();
  }
}

// Run the setup
setupDatabase().catch(console.error);
