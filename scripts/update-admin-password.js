const { Client } = require('pg');

const dbConfig = {
  host: 'assembly-db-singapore.cspkrkicfu7p.ap-southeast-1.rds.amazonaws.com',
  port: 5432,
  database: 'postgres',
  user: 'root',
  password: 'assembly1234singapore',
  ssl: { rejectUnauthorized: false }
};

async function updateAdminPassword() {
  const client = new Client(dbConfig);
  try {
    await client.connect();
    
    // Use the proper bcrypt hash for Admin123!
    const properHash = '$2b$10$XxJPPGEGOubfQYOjM4vH7.2b8hmfNr61rCVs/kq96cpJDpII3m9Zq';
    
    const result = await client.query(`
      UPDATE admin_users 
      SET password = $1, updated_at = $2
      WHERE email = $3
    `, [properHash, new Date(), 'assembly2dev@gmail.com']);
    
    if (result.rowCount > 0) {
      console.log('✅ Admin password updated successfully!');
      console.log('📧 Email: assembly2dev@gmail.com');
      console.log('🔑 Password: Admin123!');
    } else {
      console.log('❌ No admin user found with that email');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

updateAdminPassword();
