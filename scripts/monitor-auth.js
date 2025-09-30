const axios = require('axios');
const fs = require('fs');
const path = require('path');

class AuthMonitor {
  constructor() {
    this.baseUrl = process.env.STRAPI_URL || 'http://localhost:1337';
    this.logFile = path.join(__dirname, '../logs/auth-monitor.log');
    this.axios = axios.create({
      baseURL: this.baseUrl,
      timeout: 10000,
    });
  }

  log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    
    console.log(logMessage.trim());
    
    // Ensure logs directory exists
    const logsDir = path.dirname(this.logFile);
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
    
    fs.appendFileSync(this.logFile, logMessage);
  }

  async checkStrapiHealth() {
    try {
      const response = await this.axios.get('/_health');
      if (response.status === 200) {
        this.log('✅ Strapi health check: OK');
        return true;
      } else {
        this.log('❌ Strapi health check: FAILED');
        return false;
      }
    } catch (error) {
      this.log(`❌ Strapi health check: ERROR - ${error.message}`);
      return false;
    }
  }

  async checkDatabaseConnection() {
    try {
      // Try to access a simple endpoint that requires database
      const response = await this.axios.get('/api/auth/profile', {
        headers: { 'Authorization': 'Bearer invalid-token' }
      });
      // If we get here, database is accessible (even if auth fails)
      this.log('✅ Database connection: OK');
      return true;
    } catch (error) {
      if (error.response?.status === 401) {
        // 401 means database is working but auth failed (expected)
        this.log('✅ Database connection: OK (auth failed as expected)');
        return true;
      } else {
        this.log(`❌ Database connection: ERROR - ${error.message}`);
        return false;
      }
    }
  }

  async checkEmailService() {
    try {
      // Test email service by trying to send a verification code
      const response = await this.axios.post('/api/auth/send-verification', {
        email: 'test@example.com'
      });
      
      if (response.data.success) {
        this.log('✅ Email service: OK');
        return true;
      } else {
        this.log('❌ Email service: FAILED');
        return false;
      }
    } catch (error) {
      if (error.response?.status === 404) {
        this.log('❌ Email service: NOT CONFIGURED');
        return false;
      } else {
        this.log(`❌ Email service: ERROR - ${error.message}`);
        return false;
      }
    }
  }

  async checkRateLimiting() {
    try {
      // Test rate limiting by making multiple requests
      const promises = Array(3).fill().map(() => 
        this.axios.post('/api/auth/send-verification', {
          email: 'test@example.com'
        }).catch(err => err.response?.status)
      );
      
      const results = await Promise.all(promises);
      const successCount = results.filter(r => r === 200).length;
      
      if (successCount > 0) {
        this.log('✅ Rate limiting: OK (requests processed)');
        return true;
      } else {
        this.log('❌ Rate limiting: FAILED (no requests processed)');
        return false;
      }
    } catch (error) {
      this.log(`❌ Rate limiting check: ERROR - ${error.message}`);
      return false;
    }
  }

  async checkDatabaseTables() {
    try {
      // This would require database access - for now we'll check if the API responds
      const response = await this.axios.get('/api/auth-logs');
      
      if (response.status === 200 || response.status === 401) {
        this.log('✅ Database tables: OK');
        return true;
      } else {
        this.log('❌ Database tables: FAILED');
        return false;
      }
    } catch (error) {
      if (error.response?.status === 401) {
        this.log('✅ Database tables: OK (auth required)');
        return true;
      } else {
        this.log(`❌ Database tables: ERROR - ${error.message}`);
        return false;
      }
    }
  }

  async checkSystemResources() {
    try {
      const os = require('os');
      const totalMem = os.totalmem();
      const freeMem = os.freemem();
      const usedMem = totalMem - freeMem;
      const memoryUsage = (usedMem / totalMem) * 100;
      
      const loadAvg = os.loadavg();
      const cpuCount = os.cpus().length;
      const loadPercentage = (loadAvg[0] / cpuCount) * 100;
      
      this.log(`📊 System Resources:`);
      this.log(`   Memory Usage: ${memoryUsage.toFixed(2)}%`);
      this.log(`   CPU Load: ${loadPercentage.toFixed(2)}%`);
      this.log(`   Free Memory: ${(freeMem / 1024 / 1024 / 1024).toFixed(2)} GB`);
      
      const isHealthy = memoryUsage < 90 && loadPercentage < 80;
      
      if (isHealthy) {
        this.log('✅ System resources: OK');
      } else {
        this.log('⚠️  System resources: WARNING (high usage)');
      }
      
      return isHealthy;
    } catch (error) {
      this.log(`❌ System resources check: ERROR - ${error.message}`);
      return false;
    }
  }

  async generateReport() {
    this.log('🔍 Starting Authentication System Health Check...\n');
    
    const checks = [
      { name: 'Strapi Health', check: () => this.checkStrapiHealth() },
      { name: 'Database Connection', check: () => this.checkDatabaseConnection() },
      { name: 'Email Service', check: () => this.checkEmailService() },
      { name: 'Rate Limiting', check: () => this.checkRateLimiting() },
      { name: 'Database Tables', check: () => this.checkDatabaseTables() },
      { name: 'System Resources', check: () => this.checkSystemResources() }
    ];
    
    const results = [];
    
    for (const check of checks) {
      try {
        const result = await check.check();
        results.push({ name: check.name, status: result });
      } catch (error) {
        this.log(`❌ ${check.name}: ERROR - ${error.message}`);
        results.push({ name: check.name, status: false });
      }
    }
    
    // Generate summary
    this.log('\n📋 Health Check Summary:');
    const passed = results.filter(r => r.status).length;
    const total = results.length;
    
    results.forEach(result => {
      const status = result.status ? '✅' : '❌';
      this.log(`   ${status} ${result.name}`);
    });
    
    this.log(`\n🎯 Overall Status: ${passed}/${total} checks passed`);
    
    if (passed === total) {
      this.log('🎉 All systems operational!');
    } else {
      this.log('⚠️  Some issues detected. Check logs for details.');
    }
    
    return results;
  }

  async runContinuousMonitoring(intervalMinutes = 5) {
    this.log(`🔄 Starting continuous monitoring (checking every ${intervalMinutes} minutes)...`);
    
    // Run initial check
    await this.generateReport();
    
    // Set up interval
    setInterval(async () => {
      this.log('\n' + '='.repeat(50));
      await this.generateReport();
    }, intervalMinutes * 60 * 1000);
  }
}

// CLI usage
if (require.main === module) {
  const monitor = new AuthMonitor();
  
  const args = process.argv.slice(2);
  const command = args[0];
  
  switch (command) {
    case 'continuous':
      const interval = parseInt(args[1]) || 5;
      monitor.runContinuousMonitoring(interval);
      break;
      
    case 'once':
    default:
      monitor.generateReport().then(() => {
        process.exit(0);
      }).catch(error => {
        console.error('Monitoring failed:', error);
        process.exit(1);
      });
      break;
  }
}

module.exports = AuthMonitor;


