module.exports = {
  async up(knex) {
    // Check if the auth_logs table already exists
    const tableExists = await knex.schema.hasTable('auth_logs');
    
    if (tableExists) {
      console.log('auth_logs table already exists. Skipping migration.');
      return;
    }

    // Check if the users-permissions_user table exists
    const usersTableExists = await knex.schema.hasTable('users-permissions_user');
    
    if (!usersTableExists) {
      console.log('users-permissions_user table does not exist yet. Skipping auth_logs migration.');
      return;
    }

    await knex.schema.createTable('auth_logs', (table) => {
      table.increments('id').primary();
      table.bigInteger('userId').unsigned().references('id').inTable('users-permissions_user').onDelete('CASCADE');
      table.enum('action', [
        'login_attempt',
        'login_success',
        'logout',
        'verification_sent',
        'verification_resent',
        'account_locked',
        'password_reset',
        'profile_update'
      ]).notNullable();
      table.string('email');
      table.string('ipAddress', 45); // IPv6 compatible
      table.text('userAgent');
      table.boolean('success').defaultTo(false).notNullable();
      table.text('errorMessage');
      table.jsonb('metadata'); // Additional data like device info, location, etc.
      table.timestamp('createdAt').defaultTo(knex.fn.now());
      
      // Indexes
      table.index(['userId']);
      table.index(['action']);
      table.index(['email']);
      table.index(['success']);
      table.index(['createdAt']);
      table.index(['userId', 'action', 'createdAt']);
    });

    console.log('Created auth_logs table successfully.');
  },

  async down(knex) {
    await knex.schema.dropTableIfExists('auth_logs');
    console.log('Dropped auth_logs table.');
  },
};
