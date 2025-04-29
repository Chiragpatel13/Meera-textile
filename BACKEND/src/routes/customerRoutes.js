const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const { auth, authorize } = require('../middleware/auth');

// All routes require authentication
router.get('/search', auth, authorize('ADMIN', 'STORE_MANAGER', 'SALES_STAFF'), customerController.searchCustomers);
router.get('/', auth, authorize('ADMIN', 'STORE_MANAGER', 'SALES_STAFF'), customerController.getAllCustomers);
router.get('/:id', auth, authorize('ADMIN', 'STORE_MANAGER', 'SALES_STAFF'), customerController.getCustomerById);
// Only SALES_STAFF and ADMIN can create new customers
router.post('/', auth, authorize('ADMIN', 'SALES_STAFF'), customerController.createCustomer);
// Only ADMIN can update customers
router.put('/:id', auth, authorize('ADMIN'), customerController.updateCustomer);

module.exports = router;
