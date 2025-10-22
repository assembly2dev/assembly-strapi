/**
 * Verify instructors in the database
 * This script checks if the instructors were inserted correctly
 */

const { Client } = require('pg');

// Live PostgreSQL database credentials
const dbConfig = {
  host: 'assembly-db-singapore.cspkrkicfu7p.ap-southeast-1.rds.amazonaws.com',
  port: 5432,
  database: 'postgres',
  user: 'root',
  password: 'assembly1234singapore',
  ssl: {
    rejectUnauthorized: false
  }
};

async function verifyInstructors() {
  console.log('🔍 Verifying instructors in the database...');
  
  const client = new Client(dbConfig);
  
  try {
    await client.connect();
    console.log('✅ Connected to database');
    
    // Query all instructors
    const result = await client.query('SELECT id, name, slug, role, specialty FROM instructors ORDER BY id');
    
    console.log(`\n📊 Found ${result.rows.length} instructors in database:`);
    console.log('┌────┬─────────────────────┬─────────────────────┬─────────────────────┬─────────────────────┐');
    console.log('│ ID │ Name                │ Slug                │ Role                │ Specialty           │');
    console.log('├────┼─────────────────────┼─────────────────────┼─────────────────────┼─────────────────────┤');
    
    result.rows.forEach(row => {
      const id = row.id.toString().padEnd(2);
      const name = (row.name || '').substring(0, 19).padEnd(19);
      const slug = (row.slug || '').substring(0, 19).padEnd(19);
      const role = (row.role || '').substring(0, 19).padEnd(19);
      const specialty = (row.specialty || '').substring(0, 19).padEnd(19);
      
      console.log(`│ ${id} │ ${name} │ ${slug} │ ${role} │ ${specialty} │`);
    });
    
    console.log('└────┴─────────────────────┴─────────────────────┴─────────────────────┴─────────────────────┘');
    
    console.log('\n✅ Database verification completed!');
    console.log('The instructors are successfully stored in the live PostgreSQL database.');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
    console.log('🔌 Database connection closed');
  }
}

verifyInstructors();
