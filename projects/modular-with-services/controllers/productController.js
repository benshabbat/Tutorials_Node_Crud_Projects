// Product Controller - Request/Response Layer
// THIN layer - just handles HTTP requests/responses
// ALL business logic is in the service layer!

import * as ProductService from '../services/productService.js';

// Get all products
export const getProducts = async (req, res, next) => {
  try {
    // Extract query parameters for filtering
    const filters = {
      category: req.query.category,
      inStock: req.query.inStock,
      search: req.query.search,
      sortBy: req.query.sortBy
    };
    
    // Call service (service handles all logic)
    const products = ProductService.getAllProducts(filters);
    
    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// Get single product
export const getProduct = async (req, res, next) => {
  try {
    const product = ProductService.getProductById(req.params.id);
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// Create product
export const createProduct = async (req, res, next) => {
  try {
    const result = ProductService.createProduct(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: result.product,
      warnings: result.warnings
    });
  } catch (error) {
    next(error);
  }
};

// Update product
export const updateProduct = async (req, res, next) => {
  try {
    const product = ProductService.updateProduct(req.params.id, req.body);
    
    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// Delete product
export const deleteProduct = async (req, res, next) => {
  try {
    const result = ProductService.deleteProduct(req.params.id);
    
    res.json({
      success: true,
      message: 'Product deleted successfully',
      data: result.product,
      warnings: result.warnings
    });
  } catch (error) {
    next(error);
  }
};

// Purchase product (reduce stock)
export const purchaseProduct = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const result = ProductService.purchaseProduct(req.params.id, quantity);
    
    res.json({
      success: true,
      message: 'Purchase completed successfully',
      data: result,
      warnings: result.warnings
    });
  } catch (error) {
    next(error);
  }
};

// Restock product (add stock)
export const restockProduct = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const result = ProductService.restockProduct(req.params.id, quantity);
    
    res.json({
      success: true,
      message: 'Product restocked successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// Get inventory statistics
export const getStats = async (req, res, next) => {
  try {
    const stats = ProductService.getInventoryStats();
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

// Get products by category
export const getByCategory = async (req, res, next) => {
  try {
    const products = ProductService.getProductsByCategory(req.params.category);
    
    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// Search products
export const searchProducts = async (req, res, next) => {
  try {
    const { q } = req.query;
    const products = ProductService.searchProducts(q);
    
    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
};
