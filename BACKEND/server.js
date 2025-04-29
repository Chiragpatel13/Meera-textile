const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { pool } = require('./src/config/db');

// Import routes
const authRoutes = require('./src/routes/authRoutes');
const productRoutes = require('./src/routes/productRoutes');
const userRoutes = require('./src/routes/userRoutes');
const customerRoutes = require('./src/routes/customerRoutes');
const orderRoutes = require('./src/routes/orderRoutes');

const app = express();

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Test route to verify database connection
app.get('/api/test', async (req, res) => {
  console.log('Testing database connection...');
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('Database query successful:', result.rows[0]);
    res.json({ 
      success: true, 
      message: 'Database connection successful',
      timestamp: result.rows[0].now
    });
  } catch (err) {
    console.error('Database test failed:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Database connection failed',
      error: err.message
    });
  }
});

// Basic route
app.get('/', (req, res) => {
  console.log('Base route accessed');
  res.json({ message: 'Welcome to Clothing Management System API' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api', userRoutes);
app.use('/api/orders', orderRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Handle server errors
server.on('error', (error) => {
  console.error('Server error:', error);
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`);
    process.exit(1);
  }
});