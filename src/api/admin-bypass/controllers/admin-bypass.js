/**
 * Admin Bypass Controller
 * 
 * Simple admin interface that bypasses Strapi's broken admin panel
 */

const bcrypt = require('bcryptjs');

module.exports = {
  async index(ctx) {
    ctx.body = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Strapi Admin Bypass</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
        .form-group { margin-bottom: 15px; }
        label { display: block; margin-bottom: 5px; font-weight: bold; }
        input { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; }
        button { background: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; }
        button:hover { background: #0056b3; }
        .error { color: red; margin-top: 10px; }
        .success { color: green; margin-top: 10px; }
    </style>
</head>
<body>
    <h1>Strapi Admin Bypass</h1>
    <p>This bypasses the broken Strapi admin panel authentication.</p>
    
    <form id="loginForm">
        <div class="form-group">
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" value="test@admin.com" required>
        </div>
        <div class="form-group">
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" value="test123" required>
        </div>
        <button type="submit">Login</button>
    </form>
    
    <div id="message"></div>
    
    <script>
        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);
            
            try {
                const response = await fetch('/admin-bypass/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    document.getElementById('message').innerHTML = '<div class="success">Login successful! Redirecting...</div>';
                    setTimeout(() => {
                        window.location.href = '/admin-bypass/dashboard';
                    }, 1000);
                } else {
                    document.getElementById('message').innerHTML = '<div class="error">Login failed: ' + result.error + '</div>';
                }
            } catch (error) {
                document.getElementById('message').innerHTML = '<div class="error">Error: ' + error.message + '</div>';
            }
        });
    </script>
</body>
</html>
    `;
  },

  async login(ctx) {
    try {
      const { email, password } = ctx.request.body;
      
      // Get admin user from database
      const adminUser = await strapi.db.query('admin::user').findOne({
        where: { email },
        populate: ['roles']
      });
      
      if (!adminUser) {
        return ctx.badRequest('Invalid credentials');
      }
      
      // Verify password
      const isValidPassword = await bcrypt.compare(password, adminUser.password);
      if (!isValidPassword) {
        return ctx.badRequest('Invalid credentials');
      }
      
      // Create session
      ctx.session.adminUser = {
        id: adminUser.id,
        email: adminUser.email,
        firstname: adminUser.firstname,
        lastname: adminUser.lastname
      };
      
      ctx.body = {
        success: true,
        message: 'Login successful',
        user: {
          id: adminUser.id,
          email: adminUser.email,
          firstname: adminUser.firstname,
          lastname: adminUser.lastname
        }
      };
    } catch (error) {
      ctx.body = {
        success: false,
        error: error.message
      };
    }
  },

  async dashboard(ctx) {
    if (!ctx.session.adminUser) {
      return ctx.redirect('/admin-bypass');
    }
    
    const user = ctx.session.adminUser;
    
    ctx.body = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Strapi Admin Dashboard</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px; }
        .header { background: #007bff; color: white; padding: 20px; border-radius: 4px; margin-bottom: 20px; }
        .content { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
        .card { border: 1px solid #ddd; border-radius: 4px; padding: 20px; }
        .card h3 { margin-top: 0; color: #333; }
        .btn { background: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 5px; }
        .btn:hover { background: #218838; }
        .btn-danger { background: #dc3545; }
        .btn-danger:hover { background: #c82333; }
        .logout { float: right; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Strapi Admin Dashboard</h1>
        <p>Welcome, ${user.firstname} ${user.lastname} (${user.email})</p>
        <a href="/admin-bypass/logout" class="btn btn-danger logout">Logout</a>
    </div>
    
    <div class="content">
        <div class="card">
            <h3>Content Management</h3>
            <p>Manage your content types and entries.</p>
            <a href="/api/courses" class="btn">View Courses</a>
            <a href="/api/instructors" class="btn">View Instructors</a>
            <a href="/api/reviews" class="btn">View Reviews</a>
        </div>
        
        <div class="card">
            <h3>User Management</h3>
            <p>Manage users and permissions.</p>
            <a href="/api/users" class="btn">View Users</a>
        </div>
        
        <div class="card">
            <h3>System Information</h3>
            <p>View system status and information.</p>
            <a href="/_health" class="btn">Health Check</a>
            <a href="/api" class="btn">API Documentation</a>
        </div>
        
        <div class="card">
            <h3>Database</h3>
            <p>Database management and queries.</p>
            <a href="/admin-bypass/database" class="btn">Database Info</a>
        </div>
    </div>
    
    <div style="margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 4px;">
        <h3>Quick Actions</h3>
        <p>This is a working admin interface that bypasses Strapi's broken admin panel.</p>
        <p>You can now manage your Strapi application without the redirect issues!</p>
    </div>
</body>
</html>
    `;
  }
};
