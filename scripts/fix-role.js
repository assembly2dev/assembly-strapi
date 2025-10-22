const { Client } = require('pg');

const dbConfig = {
  host: 'assembly-db-singapore.cspkrkicfu7p.ap-southeast-1.rds.amazonaws.com',
  port: 5432,
  database: 'postgres',
  user: 'root',
  password: 'assembly1234singapore',
  ssl: { rejectUnauthorized: false }
};

async function fixRole() {
  const client = new Client(dbConfig);
  try {
    await client.connect();
    
    // Get user ID
    const user = await client.query('SELECT id FROM admin_users WHERE email = $1', ['assembly2dev@gmail.com']);
    if (user.rows.length === 0) {
      console.log('❌ User not found');
      return;
    }
    
    const userId = user.rows[0].id;
    
    // Get role ID (usually 1 for super admin)
    const role = await client.query('SELECT id FROM admin_roles LIMIT 1');
    if (role.rows.length === 0) {
      console.log('❌ No roles found');
      return;
    }
    
    const roleId = role.rows[0].id;
    
    // Assign role
    await client.query(`
      INSERT INTO admin_users_roles_lnk (user_id, role_id, role_ord, user_ord)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT DO NOTHING
    `, [userId, roleId, 1, 1]);
    
    console.log('✅ Role assigned!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

fixRole();
