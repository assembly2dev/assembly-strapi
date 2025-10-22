const { Client } = require('pg');

const dbConfig = {
  host: 'assembly-db-singapore.cspkrkicfu7p.ap-southeast-1.rds.amazonaws.com',
  port: 5432,
  database: 'postgres',
  user: 'root',
  password: 'assembly1234singapore',
  ssl: { rejectUnauthorized: false }
};

async function checkTables() {
  const client = new Client(dbConfig);
  try {
    await client.connect();
    
    // List all tables
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name LIKE '%admin%'
      ORDER BY table_name
    `);
    
    console.log('📋 Admin-related tables:');
    tables.rows.forEach(row => console.log(`  - ${row.table_name}`));
    
    // Check admin_users structure
    const userCols = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'admin_users'
      ORDER BY ordinal_position
    `);
    
    console.log('\n👤 admin_users columns:');
    userCols.rows.forEach(row => console.log(`  - ${row.column_name}: ${row.data_type}`));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

checkTables();
