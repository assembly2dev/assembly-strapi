#!/usr/bin/env node

/**
 * Simple Admin User Creation Script
 * 
 * This script creates a basic admin user without complex permissions
 * to bypass the content-manager homepage issues.
 */

const { Client } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Database connection configuration
const client = new Client({
  host: process.env.DATABASE_HOST || 'assembly-db-singapore.cspkrkicfu7p.ap-southeast-1.rds.amazonaws.com',
  port: process.env.DATABASE_PORT || 5432,
  database: process.env.DATABASE_NAME || 'postgres',
  user: process.env.DATABASE_USERNAME || 'root',
  password: process.env.DATABASE_PASSWORD || 'assembly1234singapore',
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

async function createSimpleAdmin() {
  try {
    console.log('🔌 Connecting to PostgreSQL database...');
    await client.connect();
    console.log('✅ Connected to database successfully');

    // Delete all existing admin users
    await client.query('DELETE FROM admin_users_roles_lnk');
    await client.query('DELETE FROM admin_users');
    console.log('🗑️ Deleted all existing admin users');

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash('Admin123!', saltRounds);

    // Get the Super Admin role ID
    const superAdminRole = await client.query(`
      SELECT id FROM admin_roles 
      WHERE code = 'strapi-super-admin'
    `);

    if (superAdminRole.rows.length === 0) {
      console.log('❌ Super Admin role not found');
      return;
    }

    const superAdminRoleId = superAdminRole.rows[0].id;

    // Create a simple admin user
    const now = new Date().toISOString();
    const insertResult = await client.query(`
      INSERT INTO admin_users (
        firstname, lastname, email, password, is_active, blocked, 
        prefered_language, created_at, updated_at, created_by_id, updated_by_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING id
    `, [
      'Simple', 'Admin', 'admin@simple.com', hashedPassword, 
      true, false, 'en', now, now, null, null
    ]);

    const adminUserId = insertResult.rows[0].id;

    // Assign Super Admin role to the user
    await client.query(`
      INSERT INTO admin_users_roles_lnk (user_id, role_id, role_ord, user_ord)
      VALUES ($1, $2, $3, $4)
    `, [adminUserId, superAdminRoleId, 1, 1]);

    console.log('✅ Simple admin user created successfully!');
    console.log('\n👤 Admin User Details:');
    console.log(`   ID: ${adminUserId}`);
    console.log(`   Email: admin@simple.com`);
    console.log(`   Name: Simple Admin`);
    console.log(`   Role: Super Admin`);
    console.log(`   Active: true`);
    
    console.log('\n🔑 Login Credentials:');
    console.log('   Email: admin@simple.com');
    console.log('   Password: Admin123!');
    
    console.log('\n🌐 Access URLs:');
    console.log('   Local: http://localhost:1337/admin');

  } catch (error) {
    console.error('❌ Error creating simple admin user:', error.message);
  } finally {
    await client.end();
  }
}

// Run the script
createSimpleAdmin().catch(console.error);
