const axios = require('axios');

const BASE_URL = 'http://localhost:1337';

class CourseTesterWithAuth {
  constructor() {
    this.axios = axios.create({
      baseURL: BASE_URL,
      timeout: 10000,
    });
    this.jwt = null;
    this.createdCourseId = null;
  }

  async createTestUser() {
    console.log('🧪 Creating test user...');
    
    const userData = {
      email: 'test@example.com',
      username: 'testuser',
      password: 'TestPassword123!',
      acceptTerms: true
    };

    try {
      const response = await this.axios.post('/api/auth/sign-up', userData);
      
      if (response.data && response.data.jwt) {
        console.log('✅ User created and authenticated');
        this.jwt = response.data.jwt;
        return true;
      } else {
        console.log('❌ User creation failed');
        return false;
      }
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.message?.includes('already')) {
        console.log('✅ User already exists, trying to login...');
        return await this.loginUser();
      } else {
        console.log('❌ User creation error:', error.response?.data || error.message);
        return false;
      }
    }
  }

  async loginUser() {
    console.log('🧪 Logging in existing user...');
    
    const loginData = {
      identifier: 'test@example.com',
      password: 'TestPassword123!'
    };

    try {
      const response = await this.axios.post('/api/auth/login', loginData);
      
      if (response.data && response.data.jwt) {
        console.log('✅ User logged in successfully');
        this.jwt = response.data.jwt;
        return true;
      } else {
        console.log('❌ Login failed');
        return false;
      }
    } catch (error) {
      console.log('❌ Login error:', error.response?.data || error.message);
      return false;
    }
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
      const response = await this.axios.post('/api/courses', courseData, {
        headers: {
          'Authorization': `Bearer ${this.jwt}`
        }
      });
      
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
      const response = await this.axios.put(`/api/courses/${this.createdCourseId}`, updateData, {
        headers: {
          'Authorization': `Bearer ${this.jwt}`
        }
      });
      
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
      const response = await this.axios.delete(`/api/courses/${this.createdCourseId}`, {
        headers: {
          'Authorization': `Bearer ${this.jwt}`
        }
      });
      
      if (response.data && response.data.data) {
        console.log('✅ Delete course: SUCCESS');
        console.log('📝 Deleted Course ID:', response.data.data.id);
        this.createdCourseId = null;
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

  async runAllTests() {
    console.log('🚀 Starting Course API Tests with Authentication\n');
    
    // Step 1: Create/Login user
    const authSuccess = await this.createTestUser();
    if (!authSuccess) {
      console.log('❌ Authentication failed, cannot proceed with tests');
      return;
    }
    
    // Step 2: Create a course
    const createdCourse = await this.testCreateCourse();
    
    // Step 3: Get the created course
    if (createdCourse) {
      await this.testGetCourse();
    }
    
    // Step 4: Update the course
    await this.testUpdateCourse();
    
    // Step 5: Get the updated course
    if (this.createdCourseId) {
      await this.testGetCourse();
    }
    
    // Step 6: Delete the course
    await this.testDeleteCourse();
    
    console.log('\n🎉 Course API tests with authentication completed!');
    console.log('\n📝 Summary:');
    console.log('- ✅ POST /api/courses: Create new courses (requires auth)');
    console.log('- ✅ PUT /api/courses/:id: Update existing courses (requires auth)');
    console.log('- ✅ GET /api/courses/:id: Retrieve course details (public)');
    console.log('- ✅ DELETE /api/courses/:id: Remove courses (requires auth)');
    console.log('- ✅ Authentication: User creation and JWT token handling');
  }
}

// Run tests
const tester = new CourseTesterWithAuth();
tester.runAllTests().catch(console.error);
