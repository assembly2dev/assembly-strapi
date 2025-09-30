#!/usr/bin/env node

/**
 * Database Migration Runner for Assembly Strapi Authentication System
 * 
 * This script runs the database migrations to set up the authentication system.
 * Run this after publishing content types in the Strapi admin panel.
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const client = new Client({
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  database: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

// Mock knex object for migrations
const knex = {
  schema: {
    hasTable: async (tableName) => {
      const result = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = $1
        )
      `, [tableName]);
      return result.rows[0].exists;
    },
    alterTable: (tableName) => ({
      boolean: (columnName) => ({
        defaultTo: (defaultValue) => ({
          notNullable: () => {
            console.log(`Adding boolean column: ${columnName} to ${tableName}`);
            return client.query(`
              ALTER TABLE ${tableName} 
              ADD COLUMN IF NOT EXISTS ${columnName} BOOLEAN DEFAULT ${defaultValue} NOT NULL
            `);
          }
        })
      }),
      integer: (columnName) => ({
        defaultTo: (defaultValue) => ({
          notNullable: () => {
            console.log(`Adding integer column: ${columnName} to ${tableName}`);
            return client.query(`
              ALTER TABLE ${tableName} 
              ADD COLUMN IF NOT EXISTS ${columnName} INTEGER DEFAULT ${defaultValue} NOT NULL
            `);
          }
        })
      }),
      string: (columnName, length) => ({
        nullable: () => {
          const lengthClause = length ? `(${length})` : '';
          console.log(`Adding string column: ${columnName} to ${tableName}`);
          return client.query(`
            ALTER TABLE ${tableName} 
            ADD COLUMN IF NOT EXISTS ${columnName} VARCHAR${lengthClause}
          `);
        }
      }),
      timestamp: (columnName) => ({
        nullable: () => {
          console.log(`Adding timestamp column: ${columnName} to ${tableName}`);
          return client.query(`
            ALTER TABLE ${tableName} 
            ADD COLUMN IF NOT EXISTS ${columnName} TIMESTAMP
          `);
        }
      })
    }),
    createTable: async (tableName, callback) => {
      console.log(`Creating table: ${tableName}`);
      // This is a simplified version - in practice, you'd need to parse the callback
      // For now, we'll just log that the table should be created
      console.log(`Note: Table ${tableName} should be created via Strapi Content-Type Builder`);
    },
    raw: async (query) => {
      console.log(`Executing raw query: ${query}`);
      return client.query(query);
    }
  }
};

async function runMigrations() {
  try {
    console.log('🔌 Connecting to PostgreSQL database...');
    await client.connect();
    console.log('✅ Connected to database successfully');

    // Check if up_users table exists
    const usersTableExists = await knex.schema.hasTable('up_users');
    
    if (!usersTableExists) {
      console.log('❌ up_users table does not exist');
      console.log('📝 Please publish the User content type in Strapi admin first');
      console.log('   1. Go to http://localhost:1337/admin');
      console.log('   2. Navigate to Content-Type Builder');
      console.log('   3. Publish the User content type');
      console.log('   4. Run this script again');
      return;
    }

    console.log('✅ up_users table exists, running migrations...');

    // Run migration 001: Add verification fields
    console.log('\n🔄 Running migration 001: Add verification fields...');
    const migration001 = require('../database/migrations/001-add-verification-fields.js');
    
    // Update the migration to use the correct table name
    const originalUp = migration001.up;
    migration001.up = async (knex) => {
      // Replace users-permissions_user with up_users
      const modifiedKnex = {
        ...knex,
        schema: {
          ...knex.schema,
          alterTable: (tableName) => {
            const actualTableName = tableName === 'users-permissions_user' ? 'up_users' : tableName;
            return knex.schema.alterTable(actualTableName);
          },
          raw: async (query) => {
            const modifiedQuery = query.replace(/users-permissions_user/g, 'up_users');
            return knex.schema.raw(modifiedQuery);
          }
        }
      };
      return originalUp(modifiedKnex);
    };
    
    await migration001.up(knex);
    console.log('✅ Migration 001 completed');

    // Check if auth tables exist
    const authLogsExists = await knex.schema.hasTable('auth_logs');
    const userSessionsExists = await knex.schema.hasTable('user_sessions');

    if (!authLogsExists || !userSessionsExists) {
      console.log('\n📝 Auth tables need to be created via Strapi Content-Type Builder:');
      console.log('   1. Go to http://localhost:1337/admin');
      console.log('   2. Navigate to Content-Type Builder');
      console.log('   3. Publish: Auth Log, User Session, Auth Token');
      console.log('   4. Run this script again');
    } else {
      console.log('✅ All auth tables exist');
    }

    console.log('\n🎉 Database setup completed!');
    console.log('\n📝 Next steps:');
    console.log('1. Test the authentication endpoints');
    console.log('2. Run: node scripts/test-auth.js');

  } catch (error) {
    console.error('❌ Migration error:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Ensure all content types are published in Strapi admin');
    console.log('2. Check database connection and permissions');
    console.log('3. Verify the up_users table exists');
  } finally {
    await client.end();
  }
}

// Run migrations
runMigrations().catch(console.error);
