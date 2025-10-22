const { Client } = require('pg');

const dbConfig = {
  host: 'assembly-db-singapore.cspkrkicfu7p.ap-southeast-1.rds.amazonaws.com',
  port: 5432,
  database: 'postgres',
  user: 'root',
  password: 'assembly1234singapore',
  ssl: { rejectUnauthorized: false }
};

async function createAdmin() {
  const client = new Client(dbConfig);
  try {
    await client.connect();
    
    const hashedPassword = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'; // Admin123!
    
    await client.query(`
      INSERT INTO admin_users (email, password, firstname, lastname, is_active, blocked, prefered_language, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `, [
      'assembly2dev@gmail.com',
      hashedPassword,
      'Assembly',
      'Dev',
      true,
      false,
      'en',
      new Date(),
      new Date()
    ]);
    
    console.log('✅ Admin user created: assembly2dev@gmail.com / Admin123!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

createAdmin();
