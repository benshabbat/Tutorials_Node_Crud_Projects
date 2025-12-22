// 📘 Practical Examples for Parameters in Express

import express from 'express';
const app = express();
const PORT = 3000;

// Middleware to read JSON
app.use(express.json());

// 📊 Mock database
let users = [
  { id: 1, name: 'John Doe', email: 'john@example.com', age: 28, city: 'New York' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 32, city: 'Los Angeles' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', age: 25, city: 'New York' },
];

let products = [
  { id: 1, name: 'Laptop', category: 'electronics', price: 1200, stock: 10 },
  { id: 2, name: 'Mouse', category: 'electronics', price: 25, stock: 100 },
  { id: 3, name: 'Keyboard', category: 'electronics', price: 75, stock: 50 },
  { id: 4, name: 'Desk', category: 'furniture', price: 300, stock: 5 },
  { id: 5, name: 'Chair', category: 'furniture', price: 150, stock: 8 },
];

// ============================================
// 1️⃣ ROUTE PARAMETERS (req.params)
// ============================================

// Example 1: Single parameter - Get user by ID
app.get('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find(u => u.id === userId);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({ success: true, user });
});

// Example 2: Multiple parameters - Category and product
app.get('/categories/:category/products/:productId', (req, res) => {
  const { category, productId } = req.params;
  const id = parseInt(productId);

  const product = products.find(p => p.id === id && p.category === category);

  if (!product) {
    return res.status(404).json({ 
      error: `Product ${productId} not found in category ${category}` 
    });
  }

  res.json({ success: true, product });
});

// Example 3: Dynamic params - Search by any field
app.get('/search/:field/:value', (req, res) => {
  const { field, value } = req.params;

  const results = users.filter(user => {
    return user[field] && user[field].toString().toLowerCase().includes(value.toLowerCase());
  });

  res.json({
    searchField: field,
    searchValue: value,
    resultsCount: results.length,
    results
  });
});

// ============================================
// 2️⃣ QUERY PARAMETERS (req.query)
// ============================================

// Example 1: Filter users
app.get('/users', (req, res) => {
  const { age, city, minAge, maxAge } = req.query;
  let filteredUsers = [...users];

  // Filter by city
  if (city) {
    filteredUsers = filteredUsers.filter(u => 
      u.city.toLowerCase() === city.toLowerCase()
    );
  }

  // Filter by exact age
  if (age) {
    filteredUsers = filteredUsers.filter(u => u.age === parseInt(age));
  }

  // Filter by age range
  if (minAge) {
    filteredUsers = filteredUsers.filter(u => u.age >= parseInt(minAge));
  }
  if (maxAge) {
    filteredUsers = filteredUsers.filter(u => u.age <= parseInt(maxAge));
  }

  res.json({
    filters: { age, city, minAge, maxAge },
    count: filteredUsers.length,
    users: filteredUsers
  });
});

// Example 2: Sorting and Pagination
app.get('/products', (req, res) => {
  const { 
    category,
    minPrice,
    maxPrice,
    sortBy = 'name',
    order = 'asc',
    page = 1,
    limit = 10,
    search
  } = req.query;

  let filteredProducts = [...products];

  // Filter by category
  if (category) {
    filteredProducts = filteredProducts.filter(p => 
      p.category.toLowerCase() === category.toLowerCase()
    );
  }

  // Filter by price range
  if (minPrice) {
    filteredProducts = filteredProducts.filter(p => p.price >= parseFloat(minPrice));
  }
  if (maxPrice) {
    filteredProducts = filteredProducts.filter(p => p.price <= parseFloat(maxPrice));
  }

  // Free text search
  if (search) {
    filteredProducts = filteredProducts.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Sorting
  filteredProducts.sort((a, b) => {
    const aVal = a[sortBy];
    const bVal = b[sortBy];
    
    if (order === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  // Pagination
  const currentPage = parseInt(page);
  const itemsPerPage = parseInt(limit);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  res.json({
    filters: { category, minPrice, maxPrice, search },
    sorting: { sortBy, order },
    pagination: {
      page: currentPage,
      limit: itemsPerPage,
      totalItems: filteredProducts.length,
      totalPages: Math.ceil(filteredProducts.length / itemsPerPage)
    },
    products: paginatedProducts
  });
});

// Example 3: Advanced search
app.get('/advanced-search', (req, res) => {
  const { q, type, fields } = req.query;

  if (!q) {
    return res.status(400).json({ error: 'Please provide a search term (q)' });
  }

  const searchTerm = q.toLowerCase();
  let results = [];

  // Search in users
  if (!type || type === 'users') {
    const userMatches = users.filter(user => 
      user.name.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm) ||
      user.city.toLowerCase().includes(searchTerm)
    );
    results.push({ type: 'users', count: userMatches.length, data: userMatches });
  }

  // Search in products
  if (!type || type === 'products') {
    const productMatches = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm)
    );
    results.push({ type: 'products', count: productMatches.length, data: productMatches });
  }

  res.json({
    searchQuery: q,
    searchType: type || 'all',
    results
  });
});

// ============================================
// 3️⃣ BODY PARAMETERS (req.body)
// ============================================

// Example 1: Create new user
app.post('/users', (req, res) => {
  const { name, email, age, city } = req.body;

  // Validation
  if (!name || !email) {
    return res.status(400).json({ 
      error: 'Name and email are required fields' 
    });
  }

  // Check if email already exists
  if (users.find(u => u.email === email)) {
    return res.status(409).json({ 
      error: 'This email is already registered' 
    });
  }

  const newUser = {
    id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
    name,
    email,
    age: age || null,
    city: city || null,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);

  res.status(201).json({
    success: true,
    message: 'User created successfully',
    user: newUser
  });
});

// Example 2: Update user (combination of params + body)
app.put('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const updates = req.body;

  const userIndex = users.findIndex(u => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Update only the fields that were sent
  users[userIndex] = {
    ...users[userIndex],
    ...updates,
    id: userId, // Keep original ID
    updatedAt: new Date().toISOString()
  };

  res.json({
    success: true,
    message: 'User updated successfully',
    user: users[userIndex]
  });
});

// Example 3: Create product with full validation
app.post('/products', (req, res) => {
  const { name, category, price, stock } = req.body;

  // Detailed validation
  const errors = [];

  if (!name || name.trim().length < 2) {
    errors.push('Product name must be at least 2 characters');
  }
  if (!category) {
    errors.push('Category is required');
  }
  if (!price || price <= 0) {
    errors.push('Price must be a positive number');
  }
  if (stock !== undefined && stock < 0) {
    errors.push('Stock cannot be negative');
  }

  if (errors.length > 0) {
    return res.status(400).json({ 
      success: false,
      errors 
    });
  }

  const newProduct = {
    id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
    name: name.trim(),
    category: category.toLowerCase(),
    price: parseFloat(price),
    stock: stock !== undefined ? parseInt(stock) : 0,
    createdAt: new Date().toISOString()
  };

  products.push(newProduct);

  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    product: newProduct
  });
});

// ============================================
// 4️⃣ HEADERS (req.headers)
// ============================================

// Example 1: Check headers
app.get('/headers-info', (req, res) => {
  res.json({
    contentType: req.headers['content-type'] || 'not specified',
    userAgent: req.headers['user-agent'] || 'unknown',
    authorization: req.headers['authorization'] ? 'exists' : 'not present',
    allHeaders: req.headers
  });
});

// Example 2: Protection with Token (simple example)
app.post('/protected', (req, res) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ error: 'Authentication required - missing Authorization header' });
  }

  // Simple check (in production use JWT)
  if (token !== 'Bearer my-secret-token') {
    return res.status(403).json({ error: 'Invalid token' });
  }

  res.json({ 
    success: true,
    message: 'Access granted!',
    data: req.body 
  });
});

// ============================================
// 5️⃣ COMBINE EVERYTHING - Complex example
// ============================================

app.delete('/users/:userId/comments/:commentId', (req, res) => {
  // 1. Route Parameters
  const { userId, commentId } = req.params;

  // 2. Query Parameters
  const { reason, notify = 'false' } = req.query;

  // 3. Body
  const { feedback, replacement } = req.body;

  // 4. Headers
  const token = req.headers['authorization'];
  const userAgent = req.headers['user-agent'];

  // Checks
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  if (!reason) {
    return res.status(400).json({ error: 'Must specify deletion reason in query' });
  }

  // Detailed response
  res.json({
    success: true,
    message: 'Comment deleted successfully',
    details: {
      userId: parseInt(userId),
      commentId: parseInt(commentId),
      deletion: {
        reason,
        willNotify: notify === 'true',
        feedback: feedback || 'no feedback',
        replacement: replacement || null
      },
      metadata: {
        authenticated: true,
        userAgent,
        timestamp: new Date().toISOString()
      }
    }
  });
});

// ============================================
// Home page - List all endpoints
// ============================================

app.get('/', (req, res) => {
  res.json({
    message: '📘 Parameters Examples in Express',
    endpoints: {
      'Route Parameters': [
        'GET /users/:id - Get user by ID',
        'GET /categories/:category/products/:productId - Product in category',
        'GET /search/:field/:value - Dynamic search'
      ],
      'Query Parameters': [
        'GET /users?age=25&city=NewYork - Filter users',
        'GET /products?category=electronics&minPrice=100&sortBy=price&page=1 - Filter and sort products',
        'GET /advanced-search?q=laptop&type=products - Advanced search'
      ],
      'Body Parameters': [
        'POST /users - Create user (body: name, email, age, city)',
        'PUT /users/:id - Update user (body: any field)',
        'POST /products - Create product (body: name, category, price, stock)'
      ],
      'Headers': [
        'GET /headers-info - Headers information',
        'POST /protected - Protected route (header: Authorization)'
      ],
      'Combined': [
        'DELETE /users/:userId/comments/:commentId?reason=spam - Combine everything'
      ]
    }
  });
});

// ============================================
// Start server
// ============================================

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║  🚀 Server is running!                ║
║  📍 URL: http://localhost:${PORT}       ║
║  📘 Check GET / for all endpoints     ║
╚════════════════════════════════════════╝
  `);
});
