const bcrypt = require('bcryptjs');

async function createProperHash() {
  const password = 'Admin123!';
  const saltRounds = 10;
  
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    console.log('🔐 Proper password hash for Admin123!:');
    console.log(hash);
    
    // Also create a simple hash for direct database update
    const simpleHash = '$2a$10$' + Buffer.from(password).toString('base64');
    console.log('\n🔧 Alternative hash:');
    console.log(simpleHash);
    
  } catch (error) {
    console.error('❌ Error creating hash:', error.message);
  }
}

createProperHash();
