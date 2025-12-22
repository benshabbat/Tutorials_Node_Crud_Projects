// Product Service - Business Logic Layer (BLL)
// Contains ALL business rules, validations, and complex operations
// Controllers call services, services call models

import * as ProductModel from '../models/productModel.js';

// Custom error class for better error handling
export class BusinessError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'BusinessError';
  }
}

// Get all products with optional filtering
export const getAllProducts = (filters = {}) => {
  let products = ProductModel.findAll();
  
  // Filter by category if provided
  if (filters.category) {
    products = products.filter(p => 
      p.category.toLowerCase() === filters.category.toLowerCase()
    );
  }
  
  // Filter by stock status if provided
  if (filters.inStock === 'true') {
    products = products.filter(p => p.stock > 0);
  } else if (filters.inStock === 'false') {
    products = products.filter(p => p.stock === 0);
  }
  
  // Search by name if provided
  if (filters.search) {
    products = products.filter(p => 
      p.name.toLowerCase().includes(filters.search.toLowerCase())
    );
  }
  
  // Sort by price if provided
  if (filters.sortBy === 'price-asc') {
    products.sort((a, b) => a.price - b.price);
  } else if (filters.sortBy === 'price-desc') {
    products.sort((a, b) => b.price - a.price);
  } else if (filters.sortBy === 'name') {
    products.sort((a, b) => a.name.localeCompare(b.name));
  }
  
  return products;
};

// Get single product by ID
export const getProductById = (id) => {
  const product = ProductModel.findById(id);
  
  if (!product) {
    throw new BusinessError('Product not found', 404);
  }
  
  return product;
};

// Create new product with business rules
export const createProduct = (productData) => {
  const { name, price, stock, category } = productData;
  
  // Validation: Required fields
  if (!name || price === undefined || stock === undefined || !category) {
    throw new BusinessError('Name, price, stock, and category are required');
  }
  
  // Validation: Name length
  if (name.length < 3 || name.length > 100) {
    throw new BusinessError('Product name must be between 3 and 100 characters');
  }
  
  // Validation: Check duplicate name
  if (ProductModel.nameExists(name)) {
    throw new BusinessError('Product with this name already exists');
  }
  
  // Validation: Price must be positive
  if (price <= 0) {
    throw new BusinessError('Price must be greater than 0');
  }
  
  // Validation: Price maximum (business rule)
  if (price > 99999.99) {
    throw new BusinessError('Price cannot exceed $99,999.99');
  }
  
  // Validation: Stock must be non-negative
  if (stock < 0) {
    throw new BusinessError('Stock cannot be negative');
  }
  
  // Business rule: Warn if creating out-of-stock product
  const warnings = [];
  if (stock === 0) {
    warnings.push('Product created with zero stock');
  }
  
  // Create product
  const newProduct = ProductModel.create({
    name: name.trim(),
    price: parseFloat(price),
    stock: parseInt(stock),
    category: category.trim()
  });
  
  return {
    product: newProduct,
    warnings
  };
};

// Update product with business rules
export const updateProduct = (id, productData) => {
  // Check if product exists
  const existingProduct = ProductModel.findById(id);
  if (!existingProduct) {
    throw new BusinessError('Product not found', 404);
  }
  
  const { name, price, stock, category } = productData;
  
  // Validation: Name if provided
  if (name !== undefined) {
    if (name.length < 3 || name.length > 100) {
      throw new BusinessError('Product name must be between 3 and 100 characters');
    }
    
    // Check duplicate name (exclude current product)
    if (ProductModel.nameExists(name, id)) {
      throw new BusinessError('Product with this name already exists');
    }
  }
  
  // Validation: Price if provided
  if (price !== undefined) {
    if (price <= 0) {
      throw new BusinessError('Price must be greater than 0');
    }
    if (price > 99999.99) {
      throw new BusinessError('Price cannot exceed $99,999.99');
    }
  }
  
  // Validation: Stock if provided
  if (stock !== undefined && stock < 0) {
    throw new BusinessError('Stock cannot be negative');
  }
  
  // Prepare update data (only fields that were provided)
  const updateData = {};
  if (name !== undefined) updateData.name = name.trim();
  if (price !== undefined) updateData.price = parseFloat(price);
  if (stock !== undefined) updateData.stock = parseInt(stock);
  if (category !== undefined) updateData.category = category.trim();
  
  // Update product
  const updatedProduct = ProductModel.update(id, updateData);
  
  return updatedProduct;
};

// Delete product with business rules
export const deleteProduct = (id) => {
  // Check if product exists
  const product = ProductModel.findById(id);
  if (!product) {
    throw new BusinessError('Product not found', 404);
  }
  
  // Business rule: Warn if deleting product with stock
  const warnings = [];
  if (product.stock > 0) {
    warnings.push(`Deleting product with ${product.stock} items in stock`);
  }
  
  // Delete product
  const deletedProduct = ProductModel.remove(id);
  
  return {
    product: deletedProduct,
    warnings
  };
};

// Purchase product (reduce stock)
export const purchaseProduct = (id, quantity) => {
  // Validation: Quantity must be positive
  if (quantity <= 0) {
    throw new BusinessError('Quantity must be greater than 0');
  }
  
  // Get product
  const product = ProductModel.findById(id);
  if (!product) {
    throw new BusinessError('Product not found', 404);
  }
  
  // Business rule: Check stock availability
  if (product.stock < quantity) {
    throw new BusinessError(
      `Insufficient stock. Available: ${product.stock}, Requested: ${quantity}`
    );
  }
  
  // Business rule: Calculate total price
  const totalPrice = product.price * quantity;
  
  // Update stock
  const newStock = product.stock - quantity;
  const updatedProduct = ProductModel.updateStock(id, newStock);
  
  // Business rule: Low stock warning
  const warnings = [];
  if (newStock > 0 && newStock <= 5) {
    warnings.push(`Low stock warning: Only ${newStock} items remaining`);
  } else if (newStock === 0) {
    warnings.push('Product is now out of stock');
  }
  
  return {
    product: updatedProduct,
    quantity,
    totalPrice: parseFloat(totalPrice.toFixed(2)),
    warnings
  };
};

// Restock product (add stock)
export const restockProduct = (id, quantity) => {
  // Validation: Quantity must be positive
  if (quantity <= 0) {
    throw new BusinessError('Quantity must be greater than 0');
  }
  
  // Get product
  const product = ProductModel.findById(id);
  if (!product) {
    throw new BusinessError('Product not found', 404);
  }
  
  // Update stock
  const newStock = product.stock + quantity;
  
  // Business rule: Maximum stock limit
  if (newStock > 10000) {
    throw new BusinessError('Stock cannot exceed 10,000 units');
  }
  
  const updatedProduct = ProductModel.updateStock(id, newStock);
  
  return {
    product: updatedProduct,
    added: quantity,
    newTotal: newStock
  };
};

// Get inventory statistics
export const getInventoryStats = () => {
  const products = ProductModel.findAll();
  
  // Calculate statistics
  const totalProducts = products.length;
  const inStockProducts = products.filter(p => p.stock > 0).length;
  const outOfStockProducts = products.filter(p => p.stock === 0).length;
  const lowStockProducts = products.filter(p => p.stock > 0 && p.stock <= 5).length;
  
  const totalInventoryValue = products.reduce(
    (sum, p) => sum + (p.price * p.stock), 
    0
  );
  
  const totalStockUnits = products.reduce((sum, p) => sum + p.stock, 0);
  
  const avgPrice = totalProducts > 0 
    ? products.reduce((sum, p) => sum + p.price, 0) / totalProducts
    : 0;
  
  const categories = ProductModel.getCategories();
  const categoryStats = categories.map(cat => ({
    category: cat,
    count: products.filter(p => p.category === cat).length
  }));
  
  return {
    totalProducts,
    inStockProducts,
    outOfStockProducts,
    lowStockProducts,
    totalInventoryValue: parseFloat(totalInventoryValue.toFixed(2)),
    totalStockUnits,
    averagePrice: parseFloat(avgPrice.toFixed(2)),
    categories: categoryStats
  };
};

// Get products by category
export const getProductsByCategory = (category) => {
  if (!category) {
    throw new BusinessError('Category is required');
  }
  
  const products = ProductModel.findByCategory(category);
  
  if (products.length === 0) {
    throw new BusinessError(`No products found in category: ${category}`, 404);
  }
  
  return products;
};

// Search products
export const searchProducts = (searchTerm) => {
  if (!searchTerm || searchTerm.trim().length < 2) {
    throw new BusinessError('Search term must be at least 2 characters');
  }
  
  const products = ProductModel.findByName(searchTerm);
  
  return products;
};
