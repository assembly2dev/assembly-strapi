const { Client } = require('pg');

const dbConfig = {
  host: 'assembly-db-singapore.cspkrkicfu7p.ap-southeast-1.rds.amazonaws.com',
  port: 5432,
  database: 'postgres',
  user: 'root',
  password: 'assembly1234singapore',
  ssl: { rejectUnauthorized: false }
};

async function checkRoleTable() {
  const client = new Client(dbConfig);
  try {
    await client.connect();
    
    // Check admin_users_roles_lnk structure
    const roleCols = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'admin_users_roles_lnk'
      ORDER BY ordinal_position
    `);
    
    console.log('🔗 admin_users_roles_lnk columns:');
    roleCols.rows.forEach(row => console.log(`  - ${row.column_name}: ${row.data_type}`));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

checkRoleTable();
