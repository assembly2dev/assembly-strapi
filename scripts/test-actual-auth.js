const axios = require('axios');

const BASE_URL = 'http://localhost:1337';
const TEST_EMAIL = 'test@example.com';
const TEST_PASSWORD = 'TestPassword123!';

class AuthTester {
  constructor() {
    this.axios = axios.create({
      baseURL: BASE_URL,
      timeout: 10000,
    });
  }

  async testSignUp() {
    console.log('🧪 Testing: User Sign Up');
    try {
      const response = await this.axios.post('/api/auth/sign-up', {
        email: TEST_EMAIL,
        username: 'testuser',
        password: TEST_PASSWORD,
        acceptTerms: true
      });
      
      if (response.data.jwt) {
        console.log('✅ Sign up: SUCCESS');
        console.log('🔑 JWT Token:', response.data.jwt.substring(0, 50) + '...');
        return response.data.jwt;
      } else {
        console.log('❌ Sign up: FAILED');
        return null;
      }
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.message?.includes('already')) {
        console.log('✅ Sign up: USER ALREADY EXISTS (expected)');
        return 'user_exists';
      }
      console.log('❌ Sign up: ERROR', error.response?.data || error.message);
      return null;
    }
  }

  async testLogin() {
    console.log('🧪 Testing: User Login');
    try {
      const response = await this.axios.post('/api/auth/login', {
        identifier: TEST_EMAIL,
        password: TEST_PASSWORD
      });
      
      if (response.data.jwt) {
        console.log('✅ Login: SUCCESS');
        console.log('🔑 JWT Token:', response.data.jwt.substring(0, 50) + '...');
        return response.data.jwt;
      } else {
        console.log('❌ Login: FAILED');
        return null;
      }
    } catch (error) {
      console.log('❌ Login: ERROR', error.response?.data || error.message);
      return null;
    }
  }

  async testGetProfile(jwt) {
    console.log('🧪 Testing: Get User Profile');
    try {
      const response = await this.axios.get('/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${jwt}`
        }
      });
      
      if (response.data) {
        console.log('✅ Get profile: SUCCESS');
        console.log('👤 User:', response.data.email || response.data.username);
        return true;
      } else {
        console.log('❌ Get profile: FAILED');
        return false;
      }
    } catch (error) {
      console.log('❌ Get profile: ERROR', error.response?.data || error.message);
      return false;
    }
  }

  async testProtectedEndpoint(jwt) {
    console.log('🧪 Testing: Protected Endpoint Access');
    try {
      const response = await this.axios.get('/api/courses', {
        headers: {
          'Authorization': `Bearer ${jwt}`
        }
      });
      
      console.log('✅ Protected endpoint: SUCCESS');
      return true;
    } catch (error) {
      console.log('❌ Protected endpoint: ERROR', error.response?.data || error.message);
      return false;
    }
  }

  async testPublicEndpoint() {
    console.log('🧪 Testing: Public Endpoint Access');
    try {
      const response = await this.axios.get('/api/courses');
      
      console.log('✅ Public endpoint: SUCCESS');
      return true;
    } catch (error) {
      console.log('❌ Public endpoint: ERROR', error.response?.data || error.message);
      return false;
    }
  }

  async testInvalidCredentials() {
    console.log('🧪 Testing: Invalid Credentials');
    try {
      const response = await this.axios.post('/api/auth/login', {
        identifier: TEST_EMAIL,
        password: 'wrongpassword'
      });
      
      console.log('❌ Invalid credentials test: FAILED (should have failed)');
      return false;
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Invalid credentials test: SUCCESS (correctly failed)');
        return true;
      } else {
        console.log('❌ Invalid credentials test: ERROR', error.response?.data || error.message);
        return false;
      }
    }
  }

  async testUnauthorizedAccess() {
    console.log('🧪 Testing: Unauthorized Access');
    try {
      const response = await this.axios.get('/api/auth/profile');
      
      console.log('❌ Unauthorized access test: FAILED (should have failed)');
      return false;
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Unauthorized access test: SUCCESS (correctly failed)');
        return true;
      } else {
        console.log('❌ Unauthorized access test: ERROR', error.response?.data || error.message);
        return false;
      }
    }
  }

  async runAllTests() {
    console.log('🚀 Starting Authentication System Tests\n');
    
    // Test 1: Public endpoint (should work without auth)
    await this.testPublicEndpoint();
    
    // Test 2: Unauthorized access (should fail)
    await this.testUnauthorizedAccess();
    
    // Test 3: Invalid credentials (should fail)
    await this.testInvalidCredentials();
    
    // Test 4: Sign up (may fail if user exists)
    const signUpResult = await this.testSignUp();
    
    // Test 5: Login
    const jwt = await this.testLogin();
    
    if (jwt) {
      // Test 6: Get profile
      await this.testGetProfile(jwt);
      
      // Test 7: Protected endpoint
      await this.testProtectedEndpoint(jwt);
    }
    
    console.log('\n🎉 Authentication system tests completed!');
    console.log('\n📝 Summary:');
    console.log('- Public endpoints should work without authentication');
    console.log('- Protected endpoints require valid JWT token');
    console.log('- Invalid credentials should be rejected');
    console.log('- Unauthorized access should return 401');
  }
}

// Run tests
const tester = new AuthTester();
tester.runAllTests().catch(console.error);
