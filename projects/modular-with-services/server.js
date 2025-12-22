// Main Server File - Entry Point
// Imports and connects all layers

import express from 'express';
import productRoutes from './routes/productRoutes.js';
import { 
  errorHandler, 
  notFound, 
  requestLogger, 
  requestTimer,
  corsMiddleware,
  rateLimiter,
  sanitizeInput
} from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware Pipeline
app.use(express.json());           // Parse JSON bodies
app.use(corsMiddleware);           // Enable CORS
app.use(requestLogger);            // Log all requests
app.use(requestTimer);             // Measure response time
app.use(rateLimiter);              // Rate limiting
app.use(sanitizeInput);            // Sanitize input

// Welcome route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Modular CRUD with Service Layer',
    version: '1.0.0',
    architecture: {
      model: 'Data Access Layer - Database operations',
      service: 'Business Logic Layer - Validation & rules',
      controller: 'Request/Response Layer - HTTP handling',
      routes: 'API endpoints definitions'
    },
    endpoints: {
      products: '/api/products',
      stats: '/api/products/stats',
      search: '/api/products/search?q=laptop',
      category: '/api/products/category/Electronics',
      purchase: '/api/products/:id/purchase',
      restock: '/api/products/:id/restock'
    },
    documentation: {
      'GET /api/products': 'Get all products (filters: ?category=X&inStock=true&search=X&sortBy=price-asc)',
      'GET /api/products/:id': 'Get product by ID',
      'GET /api/products/stats': 'Get inventory statistics',
      'GET /api/products/search?q=term': 'Search products by name',
      'GET /api/products/category/:category': 'Get products by category',
      'POST /api/products': 'Create new product (body: name, price, stock, category)',
      'PUT /api/products/:id': 'Update product',
      'DELETE /api/products/:id': 'Delete product',
      'POST /api/products/:id/purchase': 'Purchase product (body: quantity)',
      'POST /api/products/:id/restock': 'Restock product (body: quantity)'
    }
  });
});

// API Routes
app.use('/api/products', productRoutes);

// Error Handling (must be last)
app.use(notFound);
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log('='.repeat(70));
  console.log('🚀 SERVER STARTED - Modular Architecture with Service Layer');
  console.log('='.repeat(70));
  console.log(`📡 Port:        ${PORT}`);
  console.log(`🌐 URL:         http://localhost:${PORT}`);
  console.log(`📦 Products:    http://localhost:${PORT}/api/products`);
  console.log(`📊 Stats:       http://localhost:${PORT}/api/products/stats`);
  console.log(`🔍 Search:      http://localhost:${PORT}/api/products/search?q=laptop`);
  console.log('='.repeat(70));
  console.log('🏗️  Architecture Layers:');
  console.log('   1️⃣  Routes      → Define endpoints');
  console.log('   2️⃣  Controllers → Handle HTTP requests/responses');
  console.log('   3️⃣  Services    → Business logic & validation');
  console.log('   4️⃣  Models      → Data access');
  console.log('='.repeat(70));
});
