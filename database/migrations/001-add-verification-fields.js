module.exports = {
  async up(knex) {
    try {
      // Check if the users-permissions_user table exists
      const tableExists = await knex.schema.hasTable('users-permissions_user');
      
      if (!tableExists) {
        console.log('users-permissions_user table does not exist yet. Skipping migration.');
        return;
      }

      // Check which columns already exist to avoid conflicts
      // Wrap in try-catch to prevent transaction abort
      let columnNames = [];
      try {
        // Use 'public' schema as default (most common case)
        // If query fails, we'll proceed with empty array and handle errors per column
        const existingColumns = await knex.raw(`
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_name = 'users-permissions_user' 
          AND table_schema = current_schema()
        `);
        
        if (existingColumns && existingColumns.rows) {
          columnNames = existingColumns.rows.map(row => row.column_name);
        }
      } catch (error) {
        console.log('Warning: Could not fetch existing columns, proceeding with column additions:', error.message);
        // Continue with empty columnNames array - columns will be checked individually
        // This prevents transaction abort
      }
      
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
          try {
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
          } catch (error) {
            // Check if column already exists (error code 42701 in PostgreSQL)
            if (error.code === '42701' || error.message.includes('already exists') || error.message.includes('duplicate')) {
              console.log(`Column ${column.name} already exists, skipping.`);
            } else {
              console.log(`Warning: Failed to add column ${column.name}:`, error.message);
              // Continue with next column instead of aborting
            }
          }
        } else {
          console.log(`Column ${column.name} already exists, skipping.`);
        }
      }

      // Create indexes for performance (only if they don't exist)
      const indexesToCreate = [
        { name: 'idx_users_email', column: 'email' },
        { name: 'idx_users_verification_code', column: 'verificationCode' },
        { name: 'idx_users_verification_expires', column: 'verificationCodeExpires' },
        { name: 'idx_users_account_locked', column: 'accountLocked' },
        { name: 'idx_users_login_attempts', column: 'loginAttempts' },
        { name: 'idx_users_email_verified', column: 'emailVerified' }
      ];

      for (const index of indexesToCreate) {
        try {
          await knex.schema.raw(`CREATE INDEX IF NOT EXISTS ${index.name} ON "users-permissions_user"(${index.column})`);
          console.log(`Created index: ${index.name}`);
        } catch (error) {
          // Ignore errors for indexes that already exist
          if (error.code === '42P07' || error.message.includes('already exists')) {
            console.log(`Index ${index.name} already exists, skipping.`);
          } else {
            console.log(`Warning: Index ${index.name} failed to create:`, error.message);
            // Continue with next index instead of aborting
          }
        }
      }
    } catch (error) {
      console.log('Migration error (non-fatal):', error.message);
      // Re-throw only if it's a critical error that should stop the migration
      // Otherwise, log and continue
      if (error.message.includes('relation') && error.message.includes('does not exist')) {
        console.log('Table does not exist, skipping migration.');
        return;
      }
      throw error;
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
