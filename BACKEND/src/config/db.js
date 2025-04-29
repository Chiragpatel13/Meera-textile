const { Pool } = require('pg');
require('dotenv').config();

const connectionString = `postgres://postgres.nwzlehhaxdwbjkewiuvp:bhavya_sonigra@aws-0-ap-south-1.pooler.supabase.com:5432/postgres`;

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

// Test the connection
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client:', err.stack);
  }
  console.log('Connected to Supabase PostgreSQL database');
  release();
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};