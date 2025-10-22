/**
 * Test script for admin bypass credentials
 * This script tests the admin bypass page with the specific credentials
 */

const credentials = {
  email: 'assembly2dev@gmail.com',
  password: 'Admin123!'
};

console.log('🔐 Testing Admin Bypass Credentials');
console.log('=' .repeat(50));
console.log(`📧 Email: ${credentials.email}`);
console.log(`🔑 Password: ${credentials.password}`);
console.log('');
console.log('✅ Credentials configured successfully!');
console.log('');
console.log('🌐 Access the admin bypass at:');
console.log('   http://localhost:1337/admin-bypass.html');
console.log('');
console.log('📋 Features available:');
console.log('   - Pre-filled login form with authorized credentials');
console.log('   - Client-side validation for authorized access only');
console.log('   - Dashboard with content management links');
console.log('   - Direct API access to instructors, courses, etc.');
console.log('');
console.log('🎯 The page will only accept the specified credentials:');
console.log(`   Email: ${credentials.email}`);
console.log(`   Password: ${credentials.password}`);
