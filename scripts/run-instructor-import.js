/**
 * Script to run instructor dummy data import
 * Usage: node scripts/run-instructor-import.js
 */

const { execSync } = require('child_process');
const path = require('path');

async function runInstructorImport() {
  try {
    console.log('Starting instructor dummy data import...');
    
    // Run the TypeScript import script
    const scriptPath = path.join(__dirname, 'import-instructor-dummy-data.ts');
    
    // Use ts-node to run the TypeScript file
    execSync(`npx ts-node ${scriptPath}`, { 
      stdio: 'inherit',
      cwd: process.cwd()
    });
    
    console.log('Instructor dummy data import completed successfully!');
  } catch (error) {
    console.error('Error running instructor import:', error.message);
    process.exit(1);
  }
}

// Run the import
runInstructorImport();
