const fs = require('fs').promises;
const path = require('path');
const { pool } = require('../config/db');
const { seedDatabase } = require('./seed');

async function setupAuth() {
  const client = await pool.connect();
  
  try {
    console.log('Connected to Supabase PostgreSQL database');

    // Read and execute auth schema
    const authSchemaPath = path.join(__dirname, 'auth_schema.sql');
    const authSchema = await fs.readFile(authSchemaPath, 'utf8');
    await client.query(authSchema);
    console.log('Auth schema setup completed successfully');

    // Read and execute customer schema
    const customerSchemaPath = path.join(__dirname, 'customer_schema.sql');
    const customerSchema = await fs.readFile(customerSchemaPath, 'utf8');
    await client.query(customerSchema);
    console.log('Customer schema setup completed successfully');

    // Seed the database
    await seedDatabase();
    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Fatal error:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run setup
setupAuth().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
