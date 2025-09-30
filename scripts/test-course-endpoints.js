const axios = require('axios');

const BASE_URL = 'http://localhost:1337';

class CourseTester {
  constructor() {
    this.axios = axios.create({
      baseURL: BASE_URL,
      timeout: 10000,
    });
    this.createdCourseId = null;
  }

  async testCreateCourse() {
    console.log('🧪 Testing: POST /api/courses - Create Course');
    
    const courseData = {
      data: {
        title: 'Test Investment Course',
        sku: 'TEST-001',
        description: 'A comprehensive test course for investment strategies',
        price: 299.99,
        category: 'HDB Investment',
        type: 'Course',
        status: 'Draft',
        stock: 'In stock',
        featured: false,
        shortDescription: 'Learn investment strategies',
        learningOutcomes: ['Understand market trends', 'Analyze investment opportunities'],
        prerequisites: ['Basic financial knowledge'],
        duration: '4 weeks',
        level: 'Beginner',
        language: 'English',
        maxStudents: 50,
        currentStudents: 0,
        rating: 0,
        totalReviews: 0
      }
    };

    try {
      const response = await this.axios.post('/api/courses', courseData);
      
      if (response.data && response.data.data) {
        console.log('✅ Create course: SUCCESS');
        console.log('📝 Course ID:', response.data.data.id);
        console.log('📝 Course Title:', response.data.data.title);
        console.log('📝 Course SKU:', response.data.data.sku);
        this.createdCourseId = response.data.data.id;
        return response.data.data;
      } else {
        console.log('❌ Create course: FAILED - No data returned');
        return null;
      }
    } catch (error) {
      console.log('❌ Create course: ERROR', error.response?.data || error.message);
      return null;
    }
  }

  async testCreateCourseWithMissingFields() {
    console.log('🧪 Testing: POST /api/courses - Missing Required Fields');
    
    const incompleteData = {
      data: {
        title: 'Incomplete Course',
        // Missing required fields: sku, price, category, type
        description: 'This should fail'
      }
    };

    try {
      const response = await this.axios.post('/api/courses', incompleteData);
      console.log('❌ Missing fields test: FAILED (should have failed)');
      return false;
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Missing fields test: SUCCESS (correctly failed)');
        console.log('📝 Error message:', error.response.data.message);
        return true;
      } else {
        console.log('❌ Missing fields test: ERROR', error.response?.data || error.message);
        return false;
      }
    }
  }

  async testCreateCourseWithDuplicateSKU() {
    console.log('🧪 Testing: POST /api/courses - Duplicate SKU');
    
    const duplicateData = {
      data: {
        title: 'Duplicate SKU Course',
        sku: 'TEST-001', // Same SKU as first course
        price: 199.99,
        category: 'HDB Investment',
        type: 'Course',
        description: 'This should fail due to duplicate SKU'
      }
    };

    try {
      const response = await this.axios.post('/api/courses', duplicateData);
      console.log('❌ Duplicate SKU test: FAILED (should have failed)');
      return false;
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Duplicate SKU test: SUCCESS (correctly failed)');
        console.log('📝 Error message:', error.response.data.message);
        return true;
      } else {
        console.log('❌ Duplicate SKU test: ERROR', error.response?.data || error.message);
        return false;
      }
    }
  }

  async testUpdateCourse() {
    if (!this.createdCourseId) {
      console.log('❌ Update course: SKIPPED (no course created)');
      return false;
    }

    console.log('🧪 Testing: PUT /api/courses/:id - Update Course');
    
    const updateData = {
      data: {
        title: 'Updated Test Investment Course',
        description: 'Updated description for the test course',
        price: 399.99,
        status: 'Published',
        featured: true,
        shortDescription: 'Updated learning description',
        learningOutcomes: ['Updated outcome 1', 'Updated outcome 2', 'New outcome 3'],
        prerequisites: ['Updated prerequisite'],
        duration: '6 weeks',
        level: 'Intermediate'
      }
    };

    try {
      const response = await this.axios.put(`/api/courses/${this.createdCourseId}`, updateData);
      
      if (response.data && response.data.data) {
        console.log('✅ Update course: SUCCESS');
        console.log('📝 Updated Title:', response.data.data.title);
        console.log('📝 Updated Price:', response.data.data.price);
        console.log('📝 Updated Status:', response.data.data.status);
        console.log('📝 Updated Featured:', response.data.data.featured);
        return response.data.data;
      } else {
        console.log('❌ Update course: FAILED - No data returned');
        return null;
      }
    } catch (error) {
      console.log('❌ Update course: ERROR', error.response?.data || error.message);
      return null;
    }
  }

  async testUpdateCourseWithInvalidData() {
    if (!this.createdCourseId) {
      console.log('❌ Update invalid data test: SKIPPED (no course created)');
      return false;
    }

    console.log('🧪 Testing: PUT /api/courses/:id - Invalid Data');
    
    const invalidData = {
      data: {
        price: 'invalid-price', // Invalid price format
        status: 'InvalidStatus', // Invalid status
        type: 'InvalidType' // Invalid type
      }
    };

    try {
      const response = await this.axios.put(`/api/courses/${this.createdCourseId}`, invalidData);
      console.log('❌ Invalid data test: FAILED (should have failed)');
      return false;
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Invalid data test: SUCCESS (correctly failed)');
        console.log('📝 Error message:', error.response.data.message);
        return true;
      } else {
        console.log('❌ Invalid data test: ERROR', error.response?.data || error.message);
        return false;
      }
    }
  }

  async testGetCourse() {
    if (!this.createdCourseId) {
      console.log('❌ Get course: SKIPPED (no course created)');
      return false;
    }

    console.log('🧪 Testing: GET /api/courses/:id - Get Course');
    
    try {
      const response = await this.axios.get(`/api/courses/${this.createdCourseId}`);
      
      if (response.data && response.data.data) {
        console.log('✅ Get course: SUCCESS');
        console.log('📝 Course Title:', response.data.data.title);
        console.log('📝 Course Status:', response.data.data.status);
        return response.data.data;
      } else {
        console.log('❌ Get course: FAILED - No data returned');
        return null;
      }
    } catch (error) {
      console.log('❌ Get course: ERROR', error.response?.data || error.message);
      return null;
    }
  }

  async testDeleteCourse() {
    if (!this.createdCourseId) {
      console.log('❌ Delete course: SKIPPED (no course created)');
      return false;
    }

    console.log('🧪 Testing: DELETE /api/courses/:id - Delete Course');
    
    try {
      const response = await this.axios.delete(`/api/courses/${this.createdCourseId}`);
      
      if (response.data && response.data.data) {
        console.log('✅ Delete course: SUCCESS');
        console.log('📝 Deleted Course ID:', response.data.data.id);
        this.createdCourseId = null; // Reset for cleanup
        return true;
      } else {
        console.log('❌ Delete course: FAILED - No data returned');
        return false;
      }
    } catch (error) {
      console.log('❌ Delete course: ERROR', error.response?.data || error.message);
      return false;
    }
  }

  async testGetNonExistentCourse() {
    console.log('🧪 Testing: GET /api/courses/99999 - Non-existent Course');
    
    try {
      const response = await this.axios.get('/api/courses/99999');
      console.log('❌ Non-existent course test: FAILED (should have failed)');
      return false;
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('✅ Non-existent course test: SUCCESS (correctly failed)');
        return true;
      } else {
        console.log('❌ Non-existent course test: ERROR', error.response?.data || error.message);
        return false;
      }
    }
  }

  async runAllTests() {
    console.log('🚀 Starting Course API Tests\n');
    
    // Test 1: Create a valid course
    const createdCourse = await this.testCreateCourse();
    
    // Test 2: Try to create course with missing fields
    await this.testCreateCourseWithMissingFields();
    
    // Test 3: Try to create course with duplicate SKU
    await this.testCreateCourseWithDuplicateSKU();
    
    // Test 4: Get the created course
    if (createdCourse) {
      await this.testGetCourse();
    }
    
    // Test 5: Update the course
    await this.testUpdateCourse();
    
    // Test 6: Try to update with invalid data
    await this.testUpdateCourseWithInvalidData();
    
    // Test 7: Get non-existent course
    await this.testGetNonExistentCourse();
    
    // Test 8: Delete the course
    await this.testDeleteCourse();
    
    console.log('\n🎉 Course API tests completed!');
    console.log('\n📝 Summary:');
    console.log('- POST /api/courses: Create new courses with validation');
    console.log('- PUT /api/courses/:id: Update existing courses');
    console.log('- GET /api/courses/:id: Retrieve course details');
    console.log('- DELETE /api/courses/:id: Remove courses');
    console.log('- Validation: Required fields, SKU uniqueness, data types');
  }
}

// Run tests
const tester = new CourseTester();
tester.runAllTests().catch(console.error);
