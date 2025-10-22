#!/usr/bin/env node

/**
 * Create Admin User Script for Assembly Strapi
 * 
 * This script creates an admin user for the Strapi admin panel.
 * It connects directly to the database and creates the admin user.
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

async function createAdminUser() {
  try {
    console.log('🔌 Connecting to PostgreSQL database...');
    await client.connect();
    console.log('✅ Connected to database successfully');

    // Check if admin_users table exists
    const adminUsersTableExists = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'admin_users'
      )
    `);

    if (!adminUsersTableExists.rows[0].exists) {
      console.log('❌ admin_users table does not exist');
      console.log('📝 Please start Strapi first to create the necessary tables:');
      console.log('   1. Run: npm run develop');
      console.log('   2. Wait for Strapi to initialize');
      console.log('   3. Run this script again');
      return;
    }

    // Check if admin user already exists
    const existingAdmin = await client.query(`
      SELECT id, email, firstname, lastname, is_active 
      FROM admin_users 
      WHERE email = $1
    `, ['admin@assembly.com']);

    if (existingAdmin.rows.length > 0) {
      console.log('✅ Admin user already exists:');
      console.log(`   Email: ${existingAdmin.rows[0].email}`);
      console.log(`   Name: ${existingAdmin.rows[0].firstname} ${existingAdmin.rows[0].lastname}`);
      console.log(`   Active: ${existingAdmin.rows[0].is_active}`);
      console.log('\n🔑 Login credentials:');
      console.log('   Email: admin@assembly.com');
      console.log('   Password: Admin123!');
      return;
    }

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
      console.log('📝 Please start Strapi first to create the necessary roles');
      return;
    }

    const superAdminRoleId = superAdminRole.rows[0].id;

    // Create the admin user
    const now = new Date().toISOString();
    const insertResult = await client.query(`
      INSERT INTO admin_users (
        firstname, lastname, email, password, is_active, blocked, 
        prefered_language, created_at, updated_at, created_by_id, updated_by_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING id
    `, [
      'Assembly', 'Admin', 'admin@assembly.com', hashedPassword, 
      true, false, 'en', now, now, null, null
    ]);

    const adminUserId = insertResult.rows[0].id;

    // Assign Super Admin role to the user
    await client.query(`
      INSERT INTO admin_users_roles_lnk (admin_user_id, admin_role_id, admin_user_order, admin_role_order)
      VALUES ($1, $2, $3, $4)
    `, [adminUserId, superAdminRoleId, 1, 1]);

    console.log('✅ Admin user created successfully!');
    console.log('\n👤 Admin User Details:');
    console.log(`   ID: ${adminUserId}`);
    console.log(`   Email: admin@assembly.com`);
    console.log(`   Name: Assembly Admin`);
    console.log(`   Role: Super Admin`);
    console.log(`   Active: true`);
    
    console.log('\n🔑 Login Credentials:');
    console.log('   Email: admin@assembly.com');
    console.log('   Password: Admin123!');
    
    console.log('\n🌐 Access URLs:');
    console.log('   Local: http://localhost:1337/admin');
    console.log('   Production: https://romantic-rhythm-4335e3f6aa.strapiapp.com/admin');

  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check your database connection');
    console.log('2. Ensure Strapi has been started at least once');
    console.log('3. Verify database credentials in .env file');
  } finally {
    await client.end();
  }
}

// Run the script
createAdminUser().catch(console.error);
