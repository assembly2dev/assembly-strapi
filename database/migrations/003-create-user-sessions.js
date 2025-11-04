module.exports = {
  async up(knex) {
    try {
      // Check if the user_sessions table already exists
      const tableExists = await knex.schema.hasTable('user_sessions');
      
      if (tableExists) {
        console.log('user_sessions table already exists. Skipping migration.');
        return;
      }

      // Check if the users-permissions_user table exists
      const usersTableExists = await knex.schema.hasTable('users-permissions_user');
      
      if (!usersTableExists) {
        console.log('users-permissions_user table does not exist yet. Skipping user_sessions migration.');
        return;
      }

      await knex.schema.createTable('user_sessions', (table) => {
        table.increments('id').primary();
        table.bigInteger('userId').unsigned().references('id').inTable('users-permissions_user').onDelete('CASCADE');
        table.string('sessionToken', 255).unique().notNullable();
        table.string('refreshToken', 255).unique();
        table.timestamp('expiresAt').notNullable();
        table.string('ipAddress', 45);
        table.text('userAgent');
        table.boolean('isActive').defaultTo(true).notNullable();
        table.timestamp('lastActivity');
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.timestamp('updatedAt').defaultTo(knex.fn.now());
        
        // Indexes
        table.index(['userId']);
        table.index(['sessionToken']);
        table.index(['refreshToken']);
        table.index(['expiresAt']);
        table.index(['isActive']);
        table.index(['userId', 'isActive']);
      });

      console.log('Created user_sessions table successfully.');
    } catch (error) {
      // If table already exists, that's fine - just log and continue
      if (error.code === '42P07' || error.message.includes('already exists')) {
        console.log('user_sessions table already exists, skipping migration.');
        return;
      }
      // Re-throw other errors
      console.log('Migration error:', error.message);
      throw error;
    }
  },

  async down(knex) {
    await knex.schema.dropTableIfExists('user_sessions');
    console.log('Dropped user_sessions table.');
  },
};
