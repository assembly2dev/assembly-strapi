/**
 * Test script to fetch instructors from the API
 * Usage: node scripts/test-fetch-instructors.js
 */

const axios = require('axios');

// Configuration
const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';

async function testFetchInstructors() {
  console.log('Testing instructor API endpoints...');
  console.log(`Target Strapi URL: ${STRAPI_URL}`);
  
  try {
    // Test 1: Fetch all instructors
    console.log('\n1. Testing GET /api/instructors...');
    const allInstructors = await axios.get(`${STRAPI_URL}/api/instructors`);
    console.log(`✅ Found ${allInstructors.data.data?.length || 0} instructors`);
    
    if (allInstructors.data.data?.length > 0) {
      console.log('Sample instructor:', {
        id: allInstructors.data.data[0].id,
        name: allInstructors.data.data[0].attributes?.name,
        role: allInstructors.data.data[0].attributes?.role,
        specialty: allInstructors.data.data[0].attributes?.specialty
      });
    }
    
    // Test 2: Fetch with populate
    console.log('\n2. Testing GET /api/instructors?populate=*...');
    const instructorsWithPopulate = await axios.get(`${STRAPI_URL}/api/instructors?populate=*`);
    console.log(`✅ Found ${instructorsWithPopulate.data.data?.length || 0} instructors with relations`);
    
    // Test 3: Fetch specific instructor (if any exist)
    if (allInstructors.data.data?.length > 0) {
      const firstInstructorId = allInstructors.data.data[0].id;
      console.log(`\n3. Testing GET /api/instructors/${firstInstructorId}...`);
      const specificInstructor = await axios.get(`${STRAPI_URL}/api/instructors/${firstInstructorId}`);
      console.log('✅ Fetched specific instructor:', {
        id: specificInstructor.data.data.id,
        name: specificInstructor.data.data.attributes?.name,
        role: specificInstructor.data.data.attributes?.role
      });
    }
    
    // Test 4: Test filtering
    console.log('\n4. Testing GET /api/instructors?filters[specialty][$eq]=Real Estate Economics...');
    const filteredInstructors = await axios.get(`${STRAPI_URL}/api/instructors?filters[specialty][$eq]=Real Estate Economics`);
    console.log(`✅ Found ${filteredInstructors.data.data?.length || 0} instructors with Real Estate Economics specialty`);
    
    // Test 5: Test search
    console.log('\n5. Testing GET /api/instructors?search=Michael...');
    const searchResults = await axios.get(`${STRAPI_URL}/api/instructors?search=Michael`);
    console.log(`✅ Found ${searchResults.data.data?.length || 0} instructors matching "Michael"`);
    
    console.log('\n🎉 All API tests completed successfully!');
    console.log('\nAvailable endpoints:');
    console.log('- GET /api/instructors - List all instructors');
    console.log('- GET /api/instructors/:id - Get specific instructor');
    console.log('- GET /api/instructors?populate=* - Get with relations');
    console.log('- GET /api/instructors?filters[specialty][$eq]=value - Filter by specialty');
    console.log('- GET /api/instructors?search=term - Search instructors');
    console.log('- GET /api/instructors?sort=name:asc - Sort results');
    console.log('- GET /api/instructors?pagination[page]=1&pagination[pageSize]=5 - Pagination');
    
  } catch (error) {
    console.error('❌ Error testing instructor API:', error.response?.data || error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Make sure your Strapi server is running:');
      console.log('   npm run develop');
    }
  }
}

// Run the test if this script is executed directly
if (require.main === module) {
  testFetchInstructors().catch(console.error);
}

module.exports = { testFetchInstructors };
