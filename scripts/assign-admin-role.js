const { Client } = require('pg');

const dbConfig = {
  host: 'assembly-db-singapore.cspkrkicfu7p.ap-southeast-1.rds.amazonaws.com',
  port: 5432,
  database: 'postgres',
  user: 'root',
  password: 'assembly1234singapore',
  ssl: { rejectUnauthorized: false }
};

async function assignAdminRole() {
  const client = new Client(dbConfig);
  try {
    await client.connect();
    
    // First, get the admin user ID
    const userResult = await client.query('SELECT id FROM admin_users WHERE email = $1', ['assembly2dev@gmail.com']);
    
    if (userResult.rows.length === 0) {
      console.log('❌ Admin user not found');
      return;
    }
    
    const userId = userResult.rows[0].id;
    console.log(`📧 Found admin user with ID: ${userId}`);
    
    // Get the admin role ID (usually ID 1)
    const roleResult = await client.query('SELECT id FROM admin_roles WHERE code = $1', ['strapi-super-admin']);
    
    if (roleResult.rows.length === 0) {
      console.log('❌ Admin role not found');
      return;
    }
    
    const roleId = roleResult.rows[0].id;
    console.log(`🔑 Found admin role with ID: ${roleId}`);
    
    // Assign the role to the user
    await client.query(`
      INSERT INTO admin_users_roles_links (admin_user_id, admin_role_id, admin_user_id_order, admin_role_id_order)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT DO NOTHING
    `, [userId, roleId, 1, 1]);
    
    console.log('✅ Admin role assigned successfully!');
    console.log('📧 Email: assembly2dev@gmail.com');
    console.log('🔑 Password: Admin123!');
    console.log('👑 Role: Super Admin');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

assignAdminRole();
