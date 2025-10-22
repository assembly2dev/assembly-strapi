/**
 * Direct PostgreSQL insertion script for instructors
 * This script directly inserts instructor data into the live PostgreSQL database
 * Usage: node scripts/direct-postgres-live-insert.js
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

const instructorsData = [
  {
    name: 'Dr. Michael Chen',
    slug: 'dr-michael-chen',
    role: 'Senior Property Investment Advisor',
    bio: 'Dr. Michael Chen is a senior property investment advisor with over 20 years of experience in Singapore\'s real estate market. He holds a PhD in Real Estate Economics and has authored several books on property investment strategies.',
    longBio: 'Dr. Michael Chen is a distinguished senior property investment advisor with over 20 years of experience in Singapore\'s dynamic real estate market. He holds a PhD in Real Estate Economics from the National University of Singapore and has authored several acclaimed books on property investment strategies. Dr. Chen has advised over 5,000 clients on their property investment decisions and has a proven track record of helping investors achieve above-market returns. His expertise spans residential, commercial, and industrial properties, with particular strength in market timing and risk assessment.',
    specialty: 'Real Estate Economics',
    experience: '20+ years',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/drmichaelchen',
      twitter: 'https://twitter.com/drmichaelchen',
      email: 'michael.chen@plbassembly.com'
    },
    stats: {
      coursesCreated: 0
    },
    showOnFacilitatorsPage: true
  },
  {
    name: 'Jennifer Wong',
    slug: 'jennifer-wong',
    role: 'Property Investment Specialist',
    bio: 'Jennifer Wong is a property investment specialist with expertise in HDB and private property investments. She has helped over 2,000 families make informed property decisions and build long-term wealth through strategic investments.',
    longBio: 'Jennifer Wong is a highly skilled property investment specialist with extensive expertise in both HDB and private property investments. She has successfully helped over 2,000 families make informed property decisions and build long-term wealth through strategic investments. Jennifer holds a Master\'s degree in Real Estate and is a certified property investment advisor. Her approach combines market analysis with personalized financial planning to help clients achieve their property investment goals.',
    specialty: 'HDB & Private Property',
    experience: '10+ years',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/jenniferwong',
      instagram: 'https://instagram.com/jenniferwong',
      email: 'jennifer.wong@plbassembly.com'
    },
    stats: {
      coursesCreated: 0
    },
    showOnFacilitatorsPage: true
  },
  {
    name: 'Robert Tan',
    slug: 'robert-tan',
    role: 'Investment Portfolio Manager',
    bio: 'Robert Tan is an investment portfolio manager specializing in property investment portfolios. He has managed over $500M in property investments and has a deep understanding of market cycles and investment timing.',
    longBio: 'Robert Tan is an accomplished investment portfolio manager with a specialization in property investment portfolios. He has successfully managed over $500M in property investments across various market cycles and has developed a deep understanding of market timing and investment strategies. Robert holds an MBA in Finance and is a chartered financial analyst. His expertise includes portfolio optimization, risk management, and market analysis.',
    specialty: 'Portfolio Management',
    experience: '15+ years',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/roberttan',
      twitter: 'https://twitter.com/roberttan',
      email: 'robert.tan@plbassembly.com'
    },
    stats: {
      coursesCreated: 0
    },
    showOnFacilitatorsPage: true
  },
  {
    name: 'Lisa Ng',
    slug: 'lisa-ng',
    role: 'Property Market Analyst',
    bio: 'Lisa Ng is a property market analyst with expertise in market research and trend analysis. She provides data-driven insights to help investors make informed decisions in Singapore\'s property market.',
    longBio: 'Lisa Ng is a dedicated property market analyst with extensive expertise in market research and trend analysis. She provides data-driven insights to help investors make informed decisions in Singapore\'s complex property market. Lisa holds a degree in Statistics and Economics and is a certified market analyst. Her expertise includes market research, data analysis, trend forecasting, and investment opportunity identification.',
    specialty: 'Market Analysis',
    experience: '8+ years',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/lisang',
      email: 'lisa.ng@plbassembly.com'
    },
    stats: {
      coursesCreated: 0
    },
    showOnFacilitatorsPage: true
  },
  {
    name: 'David Lim',
    slug: 'david-lim',
    role: 'Commercial Property Expert',
    bio: 'David Lim is a commercial property expert with over 18 years of experience in commercial real estate investments. He specializes in office, retail, and industrial property investments.',
    longBio: 'David Lim is a seasoned commercial property expert with over 18 years of experience in commercial real estate investments. He specializes in office, retail, and industrial property investments and has successfully completed over 200 commercial property transactions. David holds a degree in Real Estate and is a licensed commercial property consultant. His expertise includes commercial property valuation, lease negotiations, and investment analysis.',
    specialty: 'Commercial Property',
    experience: '18+ years',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/davidlim',
      twitter: 'https://twitter.com/davidlim',
      email: 'david.lim@plbassembly.com'
    },
    stats: {
      coursesCreated: 0
    },
    showOnFacilitatorsPage: true
  }
];

async function insertInstructorsDirectly() {
  console.log('🚀 Starting direct PostgreSQL insertion into LIVE database...');
  console.log(`📊 Preparing to insert ${instructorsData.length} instructor profiles`);
  console.log(`🌐 Database: ${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`);
  
  const client = new Client(dbConfig);
  
  try {
    // Connect to the database
    console.log('🔌 Connecting to PostgreSQL database...');
    await client.connect();
    console.log('✅ Connected to PostgreSQL database');
    
    // Check if instructors table exists and get its structure
    console.log('🔍 Checking database structure...');
    const tableCheck = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'instructors' 
      ORDER BY ordinal_position
    `);
    
    if (tableCheck.rows.length === 0) {
      console.log('❌ Instructors table not found. Please ensure Strapi has created the table first.');
      return;
    }
    
    console.log('📋 Table structure found:');
    tableCheck.rows.forEach(row => {
      console.log(`   - ${row.column_name}: ${row.data_type}`);
    });
    
    const createdInstructors = [];
    const now = new Date().toISOString();
    
    // Insert each instructor
    for (let i = 0; i < instructorsData.length; i++) {
      const instructor = instructorsData[i];
      console.log(`\n${i + 1}. Inserting: ${instructor.name}`);
      console.log(`   Role: ${instructor.role}`);
      console.log(`   Specialty: ${instructor.specialty}`);
      
      try {
        const insertQuery = `
          INSERT INTO instructors (
            name, slug, role, bio, long_bio, specialty, experience,
            social_links, stats, show_on_facilitators_page,
            created_at, updated_at, published_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
          RETURNING id, name
        `;
        
        const values = [
          instructor.name,
          instructor.slug,
          instructor.role,
          instructor.bio,
          instructor.longBio,
          instructor.specialty,
          instructor.experience,
          JSON.stringify(instructor.socialLinks),
          JSON.stringify(instructor.stats),
          instructor.showOnFacilitatorsPage,
          now,
          now,
          now
        ];
        
        const result = await client.query(insertQuery, values);
        const insertedInstructor = result.rows[0];
        
        console.log(`   ✅ Inserted with ID: ${insertedInstructor.id}`);
        createdInstructors.push(insertedInstructor);
        
      } catch (insertError) {
        console.log(`   ❌ Error inserting ${instructor.name}: ${insertError.message}`);
      }
    }
    
    console.log(`\n🎉 Database insertion completed!`);
    console.log(`Successfully inserted ${createdInstructors.length} instructors into LIVE database`);
    
    console.log('\n📋 Inserted Instructors:');
    createdInstructors.forEach((instructor, index) => {
      console.log(`${index + 1}. ${instructor.name} (ID: ${instructor.id})`);
    });
    
    console.log('\n🧪 Test the API now:');
    console.log('curl http://localhost:1337/api/instructors');
    console.log('curl "http://localhost:1337/api/instructors?populate=*"');
    console.log('curl "http://localhost:1337/api/instructors?search=Michael"');
    
    return createdInstructors;
    
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    throw error;
  } finally {
    await client.end();
    console.log('🔌 Database connection closed');
  }
}

// Run the insertion if this script is executed directly
if (require.main === module) {
  insertInstructorsDirectly()
    .then((instructors) => {
      console.log('\n✅ Script completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Script failed:', error.message);
      process.exit(1);
    });
}

module.exports = { insertInstructorsDirectly, instructorsData };
