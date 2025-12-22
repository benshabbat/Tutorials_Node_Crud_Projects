// 📘 דוגמאות מעשיות ל-Parameters ב-Express

import express from 'express';
const app = express();
const PORT = 3000;

// Middleware לקריאת JSON
app.use(express.json());

// 📊 מאגר נתונים דמה
let users = [
  { id: 1, name: 'יוסי כהן', email: 'yossi@example.com', age: 28, city: 'תל אביב' },
  { id: 2, name: 'שרה לוי', email: 'sara@example.com', age: 32, city: 'חיפה' },
  { id: 3, name: 'דוד מזרחי', email: 'david@example.com', age: 25, city: 'תל אביב' },
];

let products = [
  { id: 1, name: 'Laptop', category: 'electronics', price: 3500, stock: 10 },
  { id: 2, name: 'Mouse', category: 'electronics', price: 50, stock: 100 },
  { id: 3, name: 'Keyboard', category: 'electronics', price: 200, stock: 50 },
  { id: 4, name: 'Desk', category: 'furniture', price: 800, stock: 5 },
  { id: 5, name: 'Chair', category: 'furniture', price: 600, stock: 8 },
];

// ============================================
// 1️⃣ ROUTE PARAMETERS (req.params)
// ============================================

// דוגמה 1: פרמטר אחד - קבלת משתמש לפי ID
app.get('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find(u => u.id === userId);

  if (!user) {
    return res.status(404).json({ error: 'משתמש לא נמצא' });
  }

  res.json({ success: true, user });
});

// דוגמה 2: מספר פרמטרים - קטגוריה ומוצר
app.get('/categories/:category/products/:productId', (req, res) => {
  const { category, productId } = req.params;
  const id = parseInt(productId);

  const product = products.find(p => p.id === id && p.category === category);

  if (!product) {
    return res.status(404).json({ 
      error: `מוצר ${productId} לא נמצא בקטגוריה ${category}` 
    });
  }

  res.json({ success: true, product });
});

// דוגמה 3: params דינמי - חיפוש לפי כל שדה
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

// דוגמה 1: סינון משתמשים
app.get('/users', (req, res) => {
  const { age, city, minAge, maxAge } = req.query;
  let filteredUsers = [...users];

  // סינון לפי עיר
  if (city) {
    filteredUsers = filteredUsers.filter(u => 
      u.city.toLowerCase() === city.toLowerCase()
    );
  }

  // סינון לפי גיל מדויק
  if (age) {
    filteredUsers = filteredUsers.filter(u => u.age === parseInt(age));
  }

  // סינון לפי טווח גילאים
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

// דוגמה 2: מיון ודפדוף (Pagination)
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

  // סינון לפי קטגוריה
  if (category) {
    filteredProducts = filteredProducts.filter(p => 
      p.category.toLowerCase() === category.toLowerCase()
    );
  }

  // סינון לפי טווח מחירים
  if (minPrice) {
    filteredProducts = filteredProducts.filter(p => p.price >= parseFloat(minPrice));
  }
  if (maxPrice) {
    filteredProducts = filteredProducts.filter(p => p.price <= parseFloat(maxPrice));
  }

  // חיפוש חופשי
  if (search) {
    filteredProducts = filteredProducts.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  // מיון
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

// דוגמה 3: חיפוש מתקדם
app.get('/advanced-search', (req, res) => {
  const { q, type, fields } = req.query;

  if (!q) {
    return res.status(400).json({ error: 'נא לספק מילת חיפוש (q)' });
  }

  const searchTerm = q.toLowerCase();
  let results = [];

  // חיפוש במשתמשים
  if (!type || type === 'users') {
    const userMatches = users.filter(user => 
      user.name.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm) ||
      user.city.toLowerCase().includes(searchTerm)
    );
    results.push({ type: 'users', count: userMatches.length, data: userMatches });
  }

  // חיפוש במוצרים
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

// דוגמה 1: יצירת משתמש חדש
app.post('/users', (req, res) => {
  const { name, email, age, city } = req.body;

  // Validation
  if (!name || !email) {
    return res.status(400).json({ 
      error: 'שם ואימייל הם שדות חובה' 
    });
  }

  // בדיקה אם האימייל כבר קיים
  if (users.find(u => u.email === email)) {
    return res.status(409).json({ 
      error: 'אימייל זה כבר רשום במערכת' 
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
    message: 'משתמש נוצר בהצלחה',
    user: newUser
  });
});

// דוגמה 2: עדכון משתמש (שילוב params + body)
app.put('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const updates = req.body;

  const userIndex = users.findIndex(u => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ error: 'משתמש לא נמצא' });
  }

  // עדכון רק השדות שנשלחו
  users[userIndex] = {
    ...users[userIndex],
    ...updates,
    id: userId, // שומרים על ה-ID המקורי
    updatedAt: new Date().toISOString()
  };

  res.json({
    success: true,
    message: 'משתמש עודכן בהצלחה',
    user: users[userIndex]
  });
});

// דוגמה 3: יצירת מוצר עם validation מלא
app.post('/products', (req, res) => {
  const { name, category, price, stock } = req.body;

  // Validation מפורט
  const errors = [];

  if (!name || name.trim().length < 2) {
    errors.push('שם המוצר חייב להכיל לפחות 2 תווים');
  }
  if (!category) {
    errors.push('קטגוריה היא שדה חובה');
  }
  if (!price || price <= 0) {
    errors.push('מחיר חייב להיות מספר חיובי');
  }
  if (stock !== undefined && stock < 0) {
    errors.push('מלאי לא יכול להיות שלילי');
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
    message: 'מוצר נוצר בהצלחה',
    product: newProduct
  });
});

// ============================================
// 4️⃣ HEADERS (req.headers)
// ============================================

// דוגמה 1: בדיקת headers
app.get('/headers-info', (req, res) => {
  res.json({
    contentType: req.headers['content-type'] || 'לא צוין',
    userAgent: req.headers['user-agent'] || 'לא ידוע',
    authorization: req.headers['authorization'] ? 'קיים' : 'לא קיים',
    allHeaders: req.headers
  });
});

// דוגמה 2: הגנה עם Token (דוגמה פשוטה)
app.post('/protected', (req, res) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ error: 'נדרש אימות - חסר Authorization header' });
  }

  // בדיקה פשוטה (בפרודקשן משתמשים ב-JWT)
  if (token !== 'Bearer my-secret-token') {
    return res.status(403).json({ error: 'Token לא תקין' });
  }

  res.json({ 
    success: true,
    message: 'גישה מאושרת!',
    data: req.body 
  });
});

// ============================================
// 5️⃣ שילוב הכל - דוגמה מורכבת
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

  // בדיקות
  if (!token) {
    return res.status(401).json({ error: 'נדרש אימות' });
  }

  if (!reason) {
    return res.status(400).json({ error: 'חובה לציין סיבת מחיקה ב-query' });
  }

  // תשובה מפורטת
  res.json({
    success: true,
    message: 'תגובה נמחקה בהצלחה',
    details: {
      userId: parseInt(userId),
      commentId: parseInt(commentId),
      deletion: {
        reason,
        willNotify: notify === 'true',
        feedback: feedback || 'אין משוב',
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
// דף הבית - רשימת כל ה-endpoints
// ============================================

app.get('/', (req, res) => {
  res.json({
    message: '📘 דוגמאות ל-Parameters ב-Express',
    endpoints: {
      'Route Parameters': [
        'GET /users/:id - קבל משתמש לפי ID',
        'GET /categories/:category/products/:productId - מוצר בקטגוריה',
        'GET /search/:field/:value - חיפוש דינמי'
      ],
      'Query Parameters': [
        'GET /users?age=25&city=TelAviv - סינון משתמשים',
        'GET /products?category=electronics&minPrice=100&sortBy=price&page=1 - סינון ומיון מוצרים',
        'GET /advanced-search?q=laptop&type=products - חיפוש מתקדם'
      ],
      'Body Parameters': [
        'POST /users - צור משתמש (body: name, email, age, city)',
        'PUT /users/:id - עדכן משתמש (body: כל שדה)',
        'POST /products - צור מוצר (body: name, category, price, stock)'
      ],
      'Headers': [
        'GET /headers-info - מידע על headers',
        'POST /protected - נתיב מוגן (header: Authorization)'
      ],
      'Combined': [
        'DELETE /users/:userId/comments/:commentId?reason=spam - שילוב הכל'
      ]
    }
  });
});

// ============================================
// הפעלת השרת
// ============================================

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║  🚀 Server is running!                ║
║  📍 URL: http://localhost:${PORT}       ║
║  📘 בדוק GET / לרשימת כל ה-endpoints  ║
╚════════════════════════════════════════╝
  `);
});
