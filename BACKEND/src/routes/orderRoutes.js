const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { auth, authorize } = require('../middleware/auth');

// Only allow sales staff, store managers, and admins to create orders
router.post('/', auth, authorize('ADMIN', 'STORE_MANAGER', 'SALES_STAFF'), orderController.createOrder);

module.exports = router;
