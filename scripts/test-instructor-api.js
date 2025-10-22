/**
 * Test script to demonstrate instructor API functionality
 * Usage: node scripts/test-instructor-api.js
 */

const axios = require('axios');

const STRAPI_URL = 'http://localhost:1337';

async function testInstructorAPI() {
  console.log('🧪 Testing Instructor API...\n');
  
  try {
    // Test 1: Check if API is accessible
    console.log('1️⃣ Testing basic API access...');
    const basicResponse = await axios.get(`${STRAPI_URL}/api/instructors`);
    console.log(`✅ API accessible - Found ${basicResponse.data.data.length} instructors`);
    
    // Test 2: Test with populate
    console.log('\n2️⃣ Testing with populate...');
    const populateResponse = await axios.get(`${STRAPI_URL}/api/instructors?populate=*`);
    console.log(`✅ Populate works - Found ${populateResponse.data.data.length} instructors with relations`);
    
    // Test 3: Test search functionality
    console.log('\n3️⃣ Testing search functionality...');
    const searchResponse = await axios.get(`${STRAPI_URL}/api/instructors?search=Michael`);
    console.log(`✅ Search works - Found ${searchResponse.data.data.length} instructors matching "Michael"`);
    
    // Test 4: Test filtering
    console.log('\n4️⃣ Testing filter functionality...');
    const filterResponse = await axios.get(`${STRAPI_URL}/api/instructors?filters[specialty][$eq]=Real Estate Economics`);
    console.log(`✅ Filter works - Found ${filterResponse.data.data.length} instructors with Real Estate Economics specialty`);
    
    // Test 5: Test pagination
    console.log('\n5️⃣ Testing pagination...');
    const paginationResponse = await axios.get(`${STRAPI_URL}/api/instructors?pagination[page]=1&pagination[pageSize]=5`);
    console.log(`✅ Pagination works - Page 1 with pageSize 5`);
    
    // Test 6: Test sorting
    console.log('\n6️⃣ Testing sorting...');
    const sortResponse = await axios.get(`${STRAPI_URL}/api/instructors?sort=name:asc`);
    console.log(`✅ Sorting works - Sorted by name ascending`);
    
    console.log('\n🎉 All API tests passed!');
    console.log('\n📋 Available API endpoints:');
    console.log('• GET /api/instructors - List all instructors');
    console.log('• GET /api/instructors/:id - Get specific instructor');
    console.log('• GET /api/instructors?populate=* - Get with relations');
    console.log('• GET /api/instructors?search=term - Search instructors');
    console.log('• GET /api/instructors?filters[field][$eq]=value - Filter results');
    console.log('• GET /api/instructors?sort=field:asc - Sort results');
    console.log('• GET /api/instructors?pagination[page]=1&pagination[pageSize]=10 - Pagination');
    
    console.log('\n💡 To add instructors:');
    console.log('1. Go to http://localhost:1337/admin');
    console.log('2. Navigate to Content Manager → Instructors');
    console.log('3. Create new entries using the data from import-instructors-direct.js');
    console.log('4. Then you can fetch them using the API endpoints above');
    
  } catch (error) {
    console.error('❌ API test failed:', error.response?.data || error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Make sure your Strapi server is running:');
      console.log('   npm run develop');
    }
  }
}

// Run the test
testInstructorAPI();
