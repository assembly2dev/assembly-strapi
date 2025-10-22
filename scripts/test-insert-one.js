/**
 * Test script to insert one instructor
 * This script tests the database connection by inserting one instructor
 * Usage: node scripts/test-insert-one.js
 */

const axios = require('axios');

const STRAPI_URL = 'http://localhost:1337';

async function testInsertOneInstructor() {
  console.log('🧪 Testing instructor insertion with one record...');
  
  const testInstructor = {
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
  };
  
  try {
    console.log('📊 Attempting to create instructor via API...');
    console.log('Instructor data:', {
      name: testInstructor.name,
      role: testInstructor.role,
      specialty: testInstructor.specialty
    });
    
    // Try to create via API
    const response = await axios.post(`${STRAPI_URL}/api/instructors`, {
      data: testInstructor
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.data && response.data.data) {
      console.log('✅ Successfully created instructor via API!');
      console.log('Instructor ID:', response.data.data.id);
      console.log('Instructor name:', response.data.data.attributes?.name);
      
      // Test fetching the instructor
      console.log('\n🧪 Testing fetch of created instructor...');
      const fetchResponse = await axios.get(`${STRAPI_URL}/api/instructors`);
      console.log('Total instructors now:', fetchResponse.data.data.length);
      
      if (fetchResponse.data.data.length > 0) {
        console.log('✅ Instructor successfully inserted and can be fetched!');
        console.log('First instructor:', fetchResponse.data.data[0].attributes?.name);
      }
      
    } else {
      console.log('❌ API response did not contain expected data');
    }
    
  } catch (error) {
    console.error('❌ Error creating instructor:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      console.log('\n💡 Authentication required. Try these options:');
      console.log('1. Go to http://localhost:1337/admin');
      console.log('2. Create an admin account');
      console.log('3. Use the admin panel to create instructors');
      console.log('4. Or use the admin bypass at http://localhost:1337/admin-bypass');
    }
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Make sure your Strapi server is running:');
      console.log('   npm run develop');
    }
  }
}

// Run the test if this script is executed directly
if (require.main === module) {
  testInsertOneInstructor().catch(console.error);
}

module.exports = { testInsertOneInstructor };
