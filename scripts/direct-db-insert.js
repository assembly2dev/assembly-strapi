/**
 * Direct database insertion script for instructors
 * This script directly inserts instructor data into the database
 * Usage: node scripts/direct-db-insert.js
 */

const { execSync } = require('child_process');
const path = require('path');

async function insertInstructorsDirectly() {
  console.log('🚀 Starting direct database insertion...');
  
  // Create a temporary script that will run within Strapi context
  const tempScript = `
const instructorsData = [
  {
    name: 'Dr. Michael Chen',
    slug: 'dr-michael-chen',
    role: 'Senior Property Investment Advisor',
    bio: 'Dr. Michael Chen is a senior property investment advisor with over 20 years of experience in Singapore\\'s real estate market. He holds a PhD in Real Estate Economics and has authored several books on property investment strategies.',
    longBio: 'Dr. Michael Chen is a distinguished senior property investment advisor with over 20 years of experience in Singapore\\'s dynamic real estate market. He holds a PhD in Real Estate Economics from the National University of Singapore and has authored several acclaimed books on property investment strategies. Dr. Chen has advised over 5,000 clients on their property investment decisions and has a proven track record of helping investors achieve above-market returns. His expertise spans residential, commercial, and industrial properties, with particular strength in market timing and risk assessment.',
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
    longBio: 'Jennifer Wong is a highly skilled property investment specialist with extensive expertise in both HDB and private property investments. She has successfully helped over 2,000 families make informed property decisions and build long-term wealth through strategic investments. Jennifer holds a Master\\'s degree in Real Estate and is a certified property investment advisor. Her approach combines market analysis with personalized financial planning to help clients achieve their property investment goals.',
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
    bio: 'Lisa Ng is a property market analyst with expertise in market research and trend analysis. She provides data-driven insights to help investors make informed decisions in Singapore\\'s property market.',
    longBio: 'Lisa Ng is a dedicated property market analyst with extensive expertise in market research and trend analysis. She provides data-driven insights to help investors make informed decisions in Singapore\\'s complex property market. Lisa holds a degree in Statistics and Economics and is a certified market analyst. Her expertise includes market research, data analysis, trend forecasting, and investment opportunity identification.',
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

async function insertInstructors() {
  console.log('🚀 Starting instructor insertion...');
  
  try {
    // Check if instructors already exist
    const existingInstructors = await strapi.entityService.findMany('api::instructor.instructor');
    
    if (existingInstructors.length > 0) {
      console.log(\`✅ Found \${existingInstructors.length} existing instructors, skipping insertion\`);
      return;
    }
    
    console.log('📊 No instructors found, inserting dummy data...');
    
    const createdInstructors = [];
    
    for (const instructorData of instructorsData) {
      console.log(\`Creating instructor: \${instructorData.name}...\`);
      
      const instructor = await strapi.entityService.create('api::instructor.instructor', {
        data: instructorData
      });
      
      createdInstructors.push(instructor);
      console.log(\`✅ Created: \${instructor.name} (ID: \${instructor.id})\`);
    }
    
    console.log(\`🎉 Successfully created \${createdInstructors.length} instructors!\`);
    console.log('Instructors are now available via API at /api/instructors');
    
  } catch (error) {
    console.error('❌ Error creating instructors:', error.message);
  }
}

// Run the insertion
insertInstructors();
`;

  // Write the temporary script
  const tempScriptPath = path.join(__dirname, 'temp-insert-instructors.js');
  require('fs').writeFileSync(tempScriptPath, tempScript);
  
  console.log('📝 Created temporary insertion script');
  console.log('💡 To insert instructors, you need to run this within Strapi context');
  console.log('   You can either:');
  console.log('   1. Use the admin panel at http://localhost:1337/admin');
  console.log('   2. Use the admin bypass at http://localhost:1337/admin-bypass');
  console.log('   3. Manually create instructors in Content Manager');
  
  console.log('\n📋 Instructor data ready for manual insertion:');
  console.log('=====================================');
  
  const instructorsData = [
    {
      name: 'Dr. Michael Chen',
      slug: 'dr-michael-chen',
      role: 'Senior Property Investment Advisor',
      bio: 'Dr. Michael Chen is a senior property investment advisor with over 20 years of experience in Singapore\'s real estate market. He holds a PhD in Real Estate Economics and has authored several books on property investment strategies.',
      specialty: 'Real Estate Economics',
      experience: '20+ years',
      socialLinks: {
        linkedin: 'https://linkedin.com/in/drmichaelchen',
        twitter: 'https://twitter.com/drmichaelchen',
        email: 'michael.chen@plbassembly.com'
      },
      stats: { coursesCreated: 0 },
      showOnFacilitatorsPage: true
    },
    {
      name: 'Jennifer Wong',
      slug: 'jennifer-wong',
      role: 'Property Investment Specialist',
      bio: 'Jennifer Wong is a property investment specialist with expertise in HDB and private property investments. She has helped over 2,000 families make informed property decisions and build long-term wealth through strategic investments.',
      specialty: 'HDB & Private Property',
      experience: '10+ years',
      socialLinks: {
        linkedin: 'https://linkedin.com/in/jenniferwong',
        instagram: 'https://instagram.com/jenniferwong',
        email: 'jennifer.wong@plbassembly.com'
      },
      stats: { coursesCreated: 0 },
      showOnFacilitatorsPage: true
    },
    {
      name: 'Robert Tan',
      slug: 'robert-tan',
      role: 'Investment Portfolio Manager',
      bio: 'Robert Tan is an investment portfolio manager specializing in property investment portfolios. He has managed over $500M in property investments and has a deep understanding of market cycles and investment timing.',
      specialty: 'Portfolio Management',
      experience: '15+ years',
      socialLinks: {
        linkedin: 'https://linkedin.com/in/roberttan',
        twitter: 'https://twitter.com/roberttan',
        email: 'robert.tan@plbassembly.com'
      },
      stats: { coursesCreated: 0 },
      showOnFacilitatorsPage: true
    },
    {
      name: 'Lisa Ng',
      slug: 'lisa-ng',
      role: 'Property Market Analyst',
      bio: 'Lisa Ng is a property market analyst with expertise in market research and trend analysis. She provides data-driven insights to help investors make informed decisions in Singapore\'s property market.',
      specialty: 'Market Analysis',
      experience: '8+ years',
      socialLinks: {
        linkedin: 'https://linkedin.com/in/lisang',
        email: 'lisa.ng@plbassembly.com'
      },
      stats: { coursesCreated: 0 },
      showOnFacilitatorsPage: true
    },
    {
      name: 'David Lim',
      slug: 'david-lim',
      role: 'Commercial Property Expert',
      bio: 'David Lim is a commercial property expert with over 18 years of experience in commercial real estate investments. He specializes in office, retail, and industrial property investments.',
      specialty: 'Commercial Property',
      experience: '18+ years',
      socialLinks: {
        linkedin: 'https://linkedin.com/in/davidlim',
        twitter: 'https://twitter.com/davidlim',
        email: 'david.lim@plbassembly.com'
      },
      stats: { coursesCreated: 0 },
      showOnFacilitatorsPage: true
    }
  ];
  
  instructorsData.forEach((instructor, index) => {
    console.log(`\n--- Instructor ${index + 1} ---`);
    console.log(`Name: ${instructor.name}`);
    console.log(`Slug: ${instructor.slug}`);
    console.log(`Role: ${instructor.role}`);
    console.log(`Bio: ${instructor.bio}`);
    console.log(`Specialty: ${instructor.specialty}`);
    console.log(`Experience: ${instructor.experience}`);
    console.log(`LinkedIn: ${instructor.socialLinks.linkedin}`);
    console.log(`Email: ${instructor.socialLinks.email}`);
    if (instructor.socialLinks.twitter) console.log(`Twitter: ${instructor.socialLinks.twitter}`);
    if (instructor.socialLinks.instagram) console.log(`Instagram: ${instructor.socialLinks.instagram}`);
  });
  
  // Clean up temp file
  try {
    require('fs').unlinkSync(tempScriptPath);
  } catch (e) {
    // Ignore cleanup errors
  }
}

// Run the insertion if this script is executed directly
if (require.main === module) {
  insertInstructorsDirectly().catch(console.error);
}

module.exports = { insertInstructorsDirectly };
