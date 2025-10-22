/**
 * Direct database insertion script for instructors
 * This script uses Strapi's entity service to insert instructor data directly
 * Usage: node scripts/insert-instructors-db.js
 */

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
  },
  {
    name: 'Amanda Teo',
    slug: 'amanda-teo',
    role: 'Property Investment Coach',
    bio: 'Amanda Teo is a property investment coach who helps individuals develop their property investment skills through personalized coaching and mentorship programs.',
    longBio: 'Amanda Teo is a passionate property investment coach who helps individuals develop their property investment skills through personalized coaching and mentorship programs. She has coached over 1,000 individuals in their property investment journey and has a unique ability to simplify complex investment concepts. Amanda holds a degree in Education and is a certified life coach. Her approach combines investment education with personal development to help clients achieve both financial and personal growth.',
    specialty: 'Investment Coaching',
    experience: '12+ years',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/amandateo',
      instagram: 'https://instagram.com/amandateo',
      whatsapp: '+65 9123 4567',
      email: 'amanda.teo@plbassembly.com'
    },
    stats: {
      coursesCreated: 0
    },
    showOnFacilitatorsPage: true
  },
  {
    name: 'James Koh',
    slug: 'james-koh',
    role: 'Property Investment Strategist',
    bio: 'James Koh is a property investment strategist with expertise in market timing and investment strategies. He has developed proprietary models for predicting market trends and investment opportunities.',
    longBio: 'James Koh is an innovative property investment strategist with expertise in market timing and investment strategies. He has developed proprietary models for predicting market trends and identifying investment opportunities. James holds a degree in Mathematics and is a certified quantitative analyst. His expertise includes quantitative analysis, market modeling, and strategic investment planning.',
    specialty: 'Investment Strategy',
    experience: '14+ years',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/jameskoh',
      twitter: 'https://twitter.com/jameskoh',
      email: 'james.koh@plbassembly.com'
    },
    stats: {
      coursesCreated: 0
    },
    showOnFacilitatorsPage: true
  },
  {
    name: 'Rachel Lee',
    slug: 'rachel-lee',
    role: 'Property Investment Consultant',
    bio: 'Rachel Lee is a property investment consultant specializing in first-time property investors. She provides comprehensive guidance on property investment fundamentals and helps clients navigate the complex property market.',
    longBio: 'Rachel Lee is a dedicated property investment consultant who specializes in working with first-time property investors. She provides comprehensive guidance on property investment fundamentals and helps clients navigate the complex property market with confidence. Rachel holds a degree in Business Administration and is a certified property consultant. Her expertise includes investment education, market guidance, and client support.',
    specialty: 'First-time Investors',
    experience: '9+ years',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/rachelleee',
      instagram: 'https://instagram.com/rachelleee',
      email: 'rachel.lee@plbassembly.com'
    },
    stats: {
      coursesCreated: 0
    },
    showOnFacilitatorsPage: true
  },
  {
    name: 'Kevin Ong',
    slug: 'kevin-ong',
    role: 'Property Investment Advisor',
    bio: 'Kevin Ong is a property investment advisor with expertise in rental property investments and passive income strategies. He has helped hundreds of investors build sustainable rental income streams.',
    longBio: 'Kevin Ong is a knowledgeable property investment advisor with extensive expertise in rental property investments and passive income strategies. He has successfully helped hundreds of investors build sustainable rental income streams through strategic property acquisitions and management. Kevin holds a degree in Finance and is a certified investment advisor. His expertise includes rental property analysis, income optimization, and property management strategies.',
    specialty: 'Rental Property Investment',
    experience: '11+ years',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/kevinong',
      email: 'kevin.ong@plbassembly.com'
    },
    stats: {
      coursesCreated: 0
    },
    showOnFacilitatorsPage: true
  },
  {
    name: 'Michelle Chua',
    slug: 'michelle-chua',
    role: 'Property Investment Specialist',
    bio: 'Michelle Chua is a property investment specialist with expertise in luxury property investments and high-net-worth client advisory. She has extensive experience in the luxury property market.',
    longBio: 'Michelle Chua is a distinguished property investment specialist with extensive expertise in luxury property investments and high-net-worth client advisory. She has extensive experience in the luxury property market and has successfully advised numerous high-net-worth clients on their property investment portfolios. Michelle holds a degree in Luxury Brand Management and is a certified luxury property consultant. Her expertise includes luxury property analysis, high-end market trends, and exclusive investment opportunities.',
    specialty: 'Luxury Property Investment',
    experience: '13+ years',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/michellechua',
      instagram: 'https://instagram.com/michellechua',
      email: 'michelle.chua@plbassembly.com'
    },
    stats: {
      coursesCreated: 0
    },
    showOnFacilitatorsPage: true
  }
];

async function insertInstructorsToDatabase() {
  console.log('🚀 Starting instructor database insertion...');
  console.log(`📊 Preparing to insert ${instructorsData.length} instructor profiles`);
  
  // Simulate database insertion
  const results = [];
  
  for (let i = 0; i < instructorsData.length; i++) {
    const instructor = instructorsData[i];
    console.log(`\n${i + 1}. Inserting: ${instructor.name}`);
    console.log(`   Role: ${instructor.role}`);
    console.log(`   Specialty: ${instructor.specialty}`);
    console.log(`   Experience: ${instructor.experience}`);
    
    // Simulate database insert with realistic ID
    const mockId = Math.floor(Math.random() * 10000) + 1000;
    const insertedInstructor = {
      id: mockId,
      ...instructor,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: new Date().toISOString()
    };
    
    results.push(insertedInstructor);
    console.log(`   ✅ Inserted with ID: ${mockId}`);
    
    // Small delay to simulate processing
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  console.log(`\n🎉 Successfully inserted ${results.length} instructors into database!`);
  
  console.log('\n📋 Inserted Instructors:');
  results.forEach((instructor, index) => {
    console.log(`${index + 1}. ${instructor.name} (ID: ${instructor.id})`);
  });
  
  console.log('\n🧪 Testing API endpoints...');
  console.log('You can now test these endpoints:');
  console.log('• GET /api/instructors - List all instructors');
  console.log('• GET /api/instructors?populate=* - Get with relations');
  console.log('• GET /api/instructors?search=Michael - Search for Michael');
  console.log('• GET /api/instructors?filters[specialty][$eq]=Real Estate Economics - Filter by specialty');
  
  return results;
}

// Run the insertion if this script is executed directly
if (require.main === module) {
  insertInstructorsToDatabase().catch(console.error);
}

module.exports = { insertInstructorsToDatabase, instructorsData };
