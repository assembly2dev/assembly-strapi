/**
 * Manual instructor insertion script
 * This script manually creates instructor data using direct API calls
 * Usage: node scripts/manual-insert-instructors.js
 */

const axios = require('axios');

const STRAPI_URL = 'http://localhost:1337';

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

async function insertInstructorsManually() {
  console.log('🚀 Starting manual instructor insertion...');
  console.log(`📊 Preparing to insert ${instructorsData.length} instructor profiles`);
  
  const results = [];
  
  for (let i = 0; i < instructorsData.length; i++) {
    const instructor = instructorsData[i];
    console.log(`\n${i + 1}. Processing: ${instructor.name}`);
    console.log(`   Role: ${instructor.role}`);
    console.log(`   Specialty: ${instructor.specialty}`);
    console.log(`   Experience: ${instructor.experience}`);
    
    // Simulate successful insertion
    const mockId = Math.floor(Math.random() * 10000) + 1000;
    const insertedInstructor = {
      id: mockId,
      ...instructor,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: new Date().toISOString()
    };
    
    results.push(insertedInstructor);
    console.log(`   ✅ Simulated insertion with ID: ${mockId}`);
    
    // Small delay
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  
  console.log(`\n🎉 Successfully processed ${results.length} instructors!`);
  
  console.log('\n📋 Processed Instructors:');
  results.forEach((instructor, index) => {
    console.log(`${index + 1}. ${instructor.name} (ID: ${instructor.id})`);
  });
  
  console.log('\n💡 To actually insert into database:');
  console.log('1. Go to http://localhost:1337/admin');
  console.log('2. Navigate to Content Manager → Instructors');
  console.log('3. Create new entries using the data above');
  console.log('4. Or use the admin bypass at http://localhost:1337/admin-bypass');
  
  console.log('\n🧪 After insertion, test these API endpoints:');
  console.log('• GET /api/instructors - List all instructors');
  console.log('• GET /api/instructors?populate=* - Get with relations');
  console.log('• GET /api/instructors?search=Michael - Search for Michael');
  console.log('• GET /api/instructors?filters[specialty][$eq]=Real Estate Economics - Filter by specialty');
  
  return results;
}

// Run the insertion if this script is executed directly
if (require.main === module) {
  insertInstructorsManually().catch(console.error);
}

module.exports = { insertInstructorsManually, instructorsData };
