// Product Routes - Routing Layer
// Defines all API endpoints and maps them to controllers

import express from 'express';
import * as productController from '../controllers/productController.js';

const router = express.Router();

// GET /api/products - Get all products (with optional filters)
// Query params: ?category=Electronics&inStock=true&search=laptop&sortBy=price-asc
router.get('/', productController.getProducts);

// GET /api/products/stats - Get inventory statistics
router.get('/stats', productController.getStats);

// GET /api/products/search - Search products
// Query param: ?q=laptop
router.get('/search', productController.searchProducts);

// GET /api/products/category/:category - Get products by category
router.get('/category/:category', productController.getByCategory);

// GET /api/products/:id - Get single product
router.get('/:id', productController.getProduct);

// POST /api/products - Create new product
router.post('/', productController.createProduct);

// PUT /api/products/:id - Update product
router.put('/:id', productController.updateProduct);

// DELETE /api/products/:id - Delete product
router.delete('/:id', productController.deleteProduct);

// POST /api/products/:id/purchase - Purchase product (reduce stock)
router.post('/:id/purchase', productController.purchaseProduct);

// POST /api/products/:id/restock - Restock product (add stock)
router.post('/:id/restock', productController.restockProduct);

export default router;
