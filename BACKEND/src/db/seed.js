const bcrypt = require('bcryptjs');
const { pool } = require('../config/db');

const seedDatabase = async () => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Create admin user if it doesn't exist
    const adminPassword = 'Admin@123';
    const salt = await bcrypt.genSalt(10);
    const adminPasswordHash = await bcrypt.hash(adminPassword, salt);
    
    await client.query(`
      INSERT INTO users (
        username, 
        full_name,
        email,
        password_hash,
        role,
        is_active,
        created_at
      )
      VALUES (
        'admin',
        'System Administrator',
        'admin@miratextile.com',
        $1,
        'ADMIN',
        true,
        NOW()
      )
      ON CONFLICT (username) DO NOTHING
    `, [adminPasswordHash]);

    // Create test users for each role
    const testUsers = [
      {
        username: 'store_manager1',
        password: 'Manager@123',
        full_name: 'Store Manager 1',
        email: 'store1@miratextile.com',
        role: 'STORE_MANAGER'
      },
      {
        username: 'store_manager2',
        password: 'Manager@123',
        full_name: 'Store Manager 2',
        email: 'store2@miratextile.com',
        role: 'STORE_MANAGER'
      },
      {
        username: 'sales1',
        password: 'Sales@123',
        full_name: 'Sales Staff 1',
        email: 'sales1@miratextile.com',
        role: 'SALES_STAFF'
      },
      {
        username: 'sales2',
        password: 'Sales@123',
        full_name: 'Sales Staff 2',
        email: 'sales2@miratextile.com',
        role: 'SALES_STAFF'
      },
      {
        username: 'inventory1',
        password: 'Inventory@123',
        full_name: 'Inventory Staff 1',
        email: 'inventory1@miratextile.com',
        role: 'INVENTORY_STAFF'
      },
      {
        username: 'inventory2',
        password: 'Inventory@123',
        full_name: 'Inventory Staff 2',
        email: 'inventory2@miratextile.com',
        role: 'INVENTORY_STAFF'
      }
    ];

    // Insert test users
    for (const user of testUsers) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(user.password, salt);
      
      await client.query(`
        INSERT INTO users (
          username,
          full_name,
          email,
          password_hash,
          role,
          is_active,
          created_at
        )
        VALUES ($1, $2, $3, $4, $5, true, NOW())
        ON CONFLICT (username) DO NOTHING
      `, [user.username, user.full_name, user.email, passwordHash, user.role]);
    }

    // Get admin user ID
    const adminResult = await client.query(
      'SELECT user_id FROM users WHERE username = $1',
      ['admin']
    );
    const adminId = adminResult.rows[0].user_id;

    // Create test customers
    const testCustomers = [
      {
        name: 'Rahul Textiles',
        contact_info: '+91 98765 43210',
        credit_limit: 10000
      },
      {
        name: 'Priya Fashions',
        contact_info: '+91 87654 32109',
        credit_limit: 15000
      },
      {
        name: 'Kumar Garments',
        contact_info: '+91 76543 21098',
        credit_limit: 20000
      },
      {
        name: 'Sharma Clothing',
        contact_info: '+91 65432 10987',
        credit_limit: 25000
      },
      {
        name: 'Patel Fabrics',
        contact_info: '+91 54321 09876',
        credit_limit: 30000
      }
    ];

    // Insert test customers
    for (const customer of testCustomers) {
      await client.query(`
        INSERT INTO customers (
          name,
          contact_info,
          credit_limit,
          created_by,
          created_at
        )
        VALUES ($1, $2, $3, $4, NOW())
        ON CONFLICT (contact_info) DO NOTHING
      `, [customer.name, customer.contact_info, customer.credit_limit, adminId]);
    }

    await client.query('COMMIT');
    
    console.log('\nTest Accounts Created:');
    console.log('----------------------\n');
    console.log('Role: ADMIN');
    console.log('Username: admin');
    console.log('Password: Admin@123');
    console.log('Email: admin@miratextile.com');
    console.log('    \n');
    
    for (const user of testUsers) {
      console.log(`Role: ${user.role}`);
      console.log(`Username: ${user.username}`);
      console.log(`Password: ${user.password}`);
      console.log(`Email: ${user.email}`);
      console.log('      \n');
    }
    
    console.log('Seeding complete. You can now use these accounts to test the system.');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    client.release();
  }
};

module.exports = { seedDatabase };
