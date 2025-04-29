const { pool } = require('../config/db');

const clearDatabase = async () => {
  try {
    // Clear tables in reverse order of dependencies
    await pool.query('DELETE FROM credit_transactions');
    await pool.query('DELETE FROM payments');
    await pool.query('DELETE FROM order_items');
    await pool.query('DELETE FROM orders');
    await pool.query('DELETE FROM inventory');
    await pool.query('DELETE FROM skus');
    await pool.query('DELETE FROM customers');
    await pool.query('DELETE FROM users');

    console.log('Database cleared successfully!');
  } catch (error) {
    console.error('Error clearing database:', error);
    throw error;
  }
};

// Run the clear function
clearDatabase()
  .then(() => {
    console.log('Clearing completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Clearing failed:', error);
    process.exit(1);
  });
