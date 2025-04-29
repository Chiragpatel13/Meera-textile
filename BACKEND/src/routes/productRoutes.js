const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { auth, authorize } = require('../middleware/auth');

// Product routes with role-based access
router.get('/', auth, authorize('ADMIN', 'STORE_MANAGER', 'SALES_STAFF', 'INVENTORY_STAFF'), productController.getAllProducts);
router.get('/low-stock', auth, authorize('ADMIN', 'STORE_MANAGER', 'INVENTORY_STAFF'), productController.getLowStockProducts);
router.get('/:id', auth, authorize('ADMIN', 'STORE_MANAGER', 'SALES_STAFF', 'INVENTORY_STAFF'), productController.getProductById);
router.post('/', auth, authorize('ADMIN', 'STORE_MANAGER'), productController.createProduct);
router.put('/:id', auth, authorize('ADMIN', 'STORE_MANAGER'), productController.updateProduct);
router.put('/:id/inventory', auth, authorize('ADMIN', 'STORE_MANAGER', 'INVENTORY_STAFF'), productController.updateInventory);
router.delete('/:id', auth, authorize('ADMIN', 'STORE_MANAGER'), productController.deleteProduct);

module.exports = router;