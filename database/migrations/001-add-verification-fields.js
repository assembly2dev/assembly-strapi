module.exports = {
  async up(knex) {
    // Check if the users-permissions_user table exists
    const tableExists = await knex.schema.hasTable('users-permissions_user');
    
    if (!tableExists) {
      console.log('users-permissions_user table does not exist yet. Skipping migration.');
      return;
    }

    // Check which columns already exist to avoid conflicts
    const existingColumns = await knex.raw(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users-permissions_user' 
      AND table_schema = 'public'
    `);
    
    const columnNames = existingColumns.rows.map(row => row.column_name);
    
    // Define the columns we want to add
    const columnsToAdd = [
      { name: 'emailVerified', type: 'boolean', default: false, nullable: false },
      { name: 'verificationCode', type: 'string', length: 6, nullable: true },
      { name: 'verificationCodeExpires', type: 'timestamp', nullable: true },
      { name: 'lastLoginAttempt', type: 'timestamp', nullable: true },
      { name: 'loginAttempts', type: 'integer', default: 0, nullable: false },
      { name: 'accountLocked', type: 'boolean', default: false, nullable: false },
      { name: 'accountLockedUntil', type: 'timestamp', nullable: true },
      { name: 'firstName', type: 'string', nullable: true },
      { name: 'lastName', type: 'string', nullable: true },
      { name: 'phoneNumber', type: 'string', nullable: true },
      { name: 'lastActive', type: 'timestamp', nullable: true },
      { name: 'isActive', type: 'boolean', default: true, nullable: false }
    ];

    // Add only columns that don't already exist
    for (const column of columnsToAdd) {
      if (!columnNames.includes(column.name)) {
        await knex.schema.alterTable('users-permissions_user', (table) => {
          if (column.type === 'boolean') {
            table.boolean(column.name).defaultTo(column.default).notNullable();
          } else if (column.type === 'integer') {
            table.integer(column.name).defaultTo(column.default).notNullable();
          } else if (column.type === 'string') {
            if (column.length) {
              table.string(column.name, column.length);
            } else {
              table.string(column.name);
            }
          } else if (column.type === 'timestamp') {
            table.timestamp(column.name);
          }
        });
        console.log(`Added column: ${column.name}`);
      } else {
        console.log(`Column ${column.name} already exists, skipping.`);
      }
    }

    // Create indexes for performance (only if they don't exist)
    const indexesToCreate = [
      'idx_users_email',
      'idx_users_verification_code',
      'idx_users_verification_expires',
      'idx_users_account_locked',
      'idx_users_login_attempts',
      'idx_users_email_verified'
    ];

    for (const indexName of indexesToCreate) {
      try {
        await knex.schema.raw(`CREATE INDEX IF NOT EXISTS ${indexName} ON users-permissions_user(${indexName.replace('idx_users_', '')})`);
        console.log(`Created index: ${indexName}`);
      } catch (error) {
        console.log(`Index ${indexName} already exists or failed to create:`, error.message);
      }
    }
  },

  async down(knex) {
    const tableExists = await knex.schema.hasTable('users-permissions_user');
    
    if (!tableExists) {
      console.log('users-permissions_user table does not exist. Skipping rollback.');
      return;
    }

    // Drop indexes
    const indexesToDrop = [
      'idx_users_email',
      'idx_users_verification_code',
      'idx_users_verification_expires',
      'idx_users_account_locked',
      'idx_users_login_attempts',
      'idx_users_email_verified'
    ];

    for (const indexName of indexesToDrop) {
      try {
        await knex.schema.raw(`DROP INDEX IF EXISTS ${indexName}`);
      } catch (error) {
        console.log(`Failed to drop index ${indexName}:`, error.message);
      }
    }

    // Drop columns
    const columnsToDrop = [
      'emailVerified',
      'verificationCode',
      'verificationCodeExpires',
      'lastLoginAttempt',
      'loginAttempts',
      'accountLocked',
      'accountLockedUntil',
      'firstName',
      'lastName',
      'phoneNumber',
      'lastActive',
      'isActive'
    ];

    for (const columnName of columnsToDrop) {
      try {
        await knex.schema.alterTable('users-permissions_user', (table) => {
          table.dropColumn(columnName);
        });
      } catch (error) {
        console.log(`Failed to drop column ${columnName}:`, error.message);
      }
    }
  },
};
