/**
 * Final verification script
 * This script confirms that instructors are successfully stored in the live database
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

async function finalVerification() {
  console.log('🎯 FINAL VERIFICATION: Instructors in Live Database');
  console.log('=' .repeat(60));
  
  const client = new Client(dbConfig);
  
  try {
    await client.connect();
    console.log('✅ Connected to live PostgreSQL database');
    
    // Get total count
    const countResult = await client.query('SELECT COUNT(*) as total FROM instructors');
    const total = countResult.rows[0].total;
    
    console.log(`📊 Total instructors in database: ${total}`);
    
    if (total > 0) {
      // Get all instructors with full details
      const result = await client.query(`
        SELECT id, name, slug, role, bio, specialty, experience, 
               show_on_facilitators_page, created_at
        FROM instructors 
        ORDER BY id
      `);
      
      console.log('\n📋 All Instructors:');
      console.log('┌────┬─────────────────────┬─────────────────────┬─────────────────────┐');
      console.log('│ ID │ Name                │ Role                │ Specialty           │');
      console.log('├────┼─────────────────────┼─────────────────────┼─────────────────────┤');
      
      result.rows.forEach(row => {
        const id = row.id.toString().padEnd(2);
        const name = (row.name || '').substring(0, 19).padEnd(19);
        const role = (row.role || '').substring(0, 19).padEnd(19);
        const specialty = (row.specialty || '').substring(0, 19).padEnd(19);
        
        console.log(`│ ${id} │ ${name} │ ${role} │ ${specialty} │`);
      });
      
      console.log('└────┴─────────────────────┴─────────────────────┴─────────────────────┘');
      
      console.log('\n🎉 SUCCESS! Instructors are successfully stored in the live database.');
      console.log('📝 Note: API may need relation fixes, but the core data is accessible.');
      
    } else {
      console.log('❌ No instructors found in database');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
    console.log('🔌 Database connection closed');
  }
}

finalVerification();
