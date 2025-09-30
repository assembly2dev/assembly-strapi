const axios = require('axios');

const BASE_URL = 'http://localhost:1337';
const TEST_EMAIL = 'test@example.com';

class AuthTester {
  constructor() {
    this.axios = axios.create({
      baseURL: BASE_URL,
      timeout: 10000,
    });
  }

  async testSendVerification() {
    console.log('🧪 Testing: Send Verification Code');
    try {
      const response = await this.axios.post('/api/auth/send-verification', {
        email: TEST_EMAIL
      });
      
      if (response.data.success) {
        console.log('✅ Send verification code: SUCCESS');
        return true;
      } else {
        console.log('❌ Send verification code: FAILED');
        return false;
      }
    } catch (error) {
      console.log('❌ Send verification code: ERROR', error.response?.data || error.message);
      return false;
    }
  }

  async testVerifyCode(code) {
    console.log('🧪 Testing: Verify Code');
    try {
      const response = await this.axios.post('/api/auth/verify-code', {
        email: TEST_EMAIL,
        code: code
      });
      
      if (response.data.success) {
        console.log('✅ Verify code: SUCCESS');
        console.log('🔑 JWT Token:', response.data.jwt.substring(0, 50) + '...');
        return response.data.jwt;
      } else {
        console.log('❌ Verify code: FAILED');
        return null;
      }
    } catch (error) {
      console.log('❌ Verify code: ERROR', error.response?.data || error.message);
      return null;
    }
  }

  async testResendVerification() {
    console.log('🧪 Testing: Resend Verification Code');
    try {
      const response = await this.axios.post('/api/auth/resend-verification', {
        email: TEST_EMAIL
      });
      
      if (response.data.success) {
        console.log('✅ Resend verification code: SUCCESS');
        return true;
      } else {
        console.log('❌ Resend verification code: FAILED');
        return false;
      }
    } catch (error) {
      console.log('❌ Resend verification code: ERROR', error.response?.data || error.message);
      return false;
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
      
      if (response.data.success) {
        console.log('✅ Get profile: SUCCESS');
        console.log('👤 User:', response.data.user.email);
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

  async testLogout(jwt, sessionToken) {
    console.log('🧪 Testing: Logout');
    try {
      const response = await this.axios.post('/api/auth/logout', {
        sessionToken: sessionToken
      }, {
        headers: {
          'Authorization': `Bearer ${jwt}`
        }
      });
      
      if (response.data.success) {
        console.log('✅ Logout: SUCCESS');
        return true;
      } else {
        console.log('❌ Logout: FAILED');
        return false;
      }
    } catch (error) {
      console.log('❌ Logout: ERROR', error.response?.data || error.message);
      return false;
    }
  }

  async testInvalidCode() {
    console.log('🧪 Testing: Invalid Code');
    try {
      const response = await this.axios.post('/api/auth/verify-code', {
        email: TEST_EMAIL,
        code: '000000'
      });
      
      if (response.data.success) {
        console.log('❌ Invalid code test: FAILED (should have failed)');
        return false;
      } else {
        console.log('✅ Invalid code test: SUCCESS (correctly failed)');
        return true;
      }
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Invalid code test: SUCCESS (correctly failed)');
        return true;
      } else {
        console.log('❌ Invalid code test: ERROR', error.response?.data || error.message);
        return false;
      }
    }
  }

  async testRateLimiting() {
    console.log('🧪 Testing: Rate Limiting');
    const attempts = [];
    
    for (let i = 0; i < 6; i++) {
      try {
        const response = await this.axios.post('/api/auth/send-verification', {
          email: TEST_EMAIL
        });
        attempts.push({ success: true, attempt: i + 1 });
      } catch (error) {
        if (error.response?.status === 429) {
          console.log(`✅ Rate limiting triggered after ${i + 1} attempts`);
          return true;
        }
        attempts.push({ success: false, attempt: i + 1, error: error.response?.data });
      }
    }
    
    console.log('❌ Rate limiting test: FAILED (should have been rate limited)');
    return false;
  }

  async runAllTests() {
    console.log('🚀 Starting Authentication System Tests\n');
    
    // Test 1: Send verification code
    const sendSuccess = await this.testSendVerification();
    if (!sendSuccess) {
      console.log('\n❌ Test failed at send verification step');
      return;
    }
    
    // Test 2: Test invalid code
    await this.testInvalidCode();
    
    // Test 3: Resend verification code
    await this.testResendVerification();
    
    // Note: For actual verification, you would need to check the email
    // and use the real code. For this test, we'll simulate with a fake code
    console.log('\n📧 Note: Check your email for the verification code and update the test');
    console.log('To test with real code, update the code in testVerifyCode() call below\n');
    
    // Test 4: Verify code (with fake code for demo)
    const jwt = await this.testVerifyCode('123456'); // Replace with real code
    
    if (jwt) {
      // Test 5: Get profile
      await this.testGetProfile(jwt);
      
      // Test 6: Logout
      await this.testLogout(jwt, 'fake-session-token');
    }
    
    // Test 7: Rate limiting (commented out to avoid actual rate limiting)
    // await this.testRateLimiting();
    
    console.log('\n🎉 Authentication system tests completed!');
    console.log('\n📝 Next steps:');
    console.log('1. Check your email for verification codes');
    console.log('2. Update the test with real verification codes');
    console.log('3. Test rate limiting functionality');
    console.log('4. Verify database tables were created correctly');
  }
}

// Run tests
const tester = new AuthTester();
tester.runAllTests().catch(console.error);


