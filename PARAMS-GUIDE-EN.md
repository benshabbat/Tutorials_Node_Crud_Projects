# 📘 Parameters Guide in Node.js + Express

## 🎯 What will we learn?

1. **Route Parameters (params)** - Parameters in the URL path
2. **Query Parameters (query)** - Parameters after the question mark
3. **Body Parameters** - Data in the request body
4. **Headers** - Additional information in request headers

---

## 1️⃣ Route Parameters (req.params)

### 🤔 What is it?

Parameters that are **inside** the URL path. They are part of the address itself.

### Basic Example:

```javascript
import express from 'express';
const app = express();

// Single parameter - user id
app.get('/users/:id', (req, res) => {
  const userId = req.params.id;
  res.json({ message: `You are looking for user number ${userId}` });
});

app.listen(3000);
```

**Request:**
```
GET http://localhost:3000/users/123
```

**Response:**
```json
{
  "message": "You are looking for user number 123"
}
```

---

### 🎨 Example with Multiple Parameters:

```javascript
// Multiple parameters - category and product id
app.get('/categories/:category/products/:productId', (req, res) => {
  const { category, productId } = req.params;
  
  res.json({
    message: `Looking for product ${productId} in category ${category}`,
    category: category,
    productId: productId
  });
});
```

**Request:**
```
GET http://localhost:3000/categories/electronics/products/456
```

**Response:**
```json
{
  "message": "Looking for product 456 in category electronics",
  "category": "electronics",
  "productId": "456"
}
```

---

### ✅ When to use Route Parameters?

- **Identifiers** - `/users/123`, `/products/456`
- **Resource names** - `/categories/electronics`, `/tags/nodejs`
- **Essential path information** - Part of the resource hierarchy

---

## 2️⃣ Query Parameters (req.query)

### 🤔 What is it?

Parameters that appear **after the question mark** in the URL. Used for filtering, sorting, and searching.

### Basic Example:

```javascript
// Search users with filters
app.get('/users', (req, res) => {
  const { age, city, name } = req.query;
  
  res.json({
    message: 'Searching users',
    filters: {
      age: age || 'not specified',
      city: city || 'not specified',
      name: name || 'not specified'
    }
  });
});
```

**Request:**
```
GET http://localhost:3000/users?age=25&city=NewYork&name=John
```

**Response:**
```json
{
  "message": "Searching users",
  "filters": {
    "age": "25",
    "city": "NewYork",
    "name": "John"
  }
}
```

---

### 🎨 Advanced Example - Filtering and Sorting:

```javascript
app.get('/products', (req, res) => {
  // Filter and sort parameters
  const { 
    category,      // Category
    minPrice,      // Minimum price
    maxPrice,      // Maximum price
    sortBy,        // Sort by
    order,         // Order - asc/desc
    page,          // Page number
    limit          // Results per page
  } = req.query;

  // Default values
  const currentPage = parseInt(page) || 1;
  const resultsPerPage = parseInt(limit) || 10;
  const sortField = sortBy || 'name';
  const sortOrder = order || 'asc';

  res.json({
    message: 'Product list',
    filters: {
      category: category || 'all',
      priceRange: {
        min: minPrice || 0,
        max: maxPrice || 'unlimited'
      }
    },
    sorting: {
      field: sortField,
      order: sortOrder
    },
    pagination: {
      page: currentPage,
      limit: resultsPerPage
    }
  });
});
```

**Request:**
```
GET http://localhost:3000/products?category=electronics&minPrice=100&maxPrice=500&sortBy=price&order=desc&page=2&limit=20
```

**Response:**
```json
{
  "message": "Product list",
  "filters": {
    "category": "electronics",
    "priceRange": {
      "min": "100",
      "max": "500"
    }
  },
  "sorting": {
    "field": "price",
    "order": "desc"
  },
  "pagination": {
    "page": 2,
    "limit": 20
  }
}
```

---

### ✅ When to use Query Parameters?

- **Filtering** - `?category=books&author=rowling`
- **Sorting** - `?sortBy=price&order=desc`
- **Searching** - `?search=laptop&brand=dell`
- **Pagination** - `?page=2&limit=10`
- **Optional options** - Not required to send them

---

## 3️⃣ Body Parameters (req.body)

### 🤔 What is it?

Data sent **in the request body** (not in the URL). Used for creating and updating resources.

### Setting up Middleware:

```javascript
import express from 'express';
const app = express();

// ⚠️ Must add this to read JSON in request body!
app.use(express.json());
```

---

### Example - Creating a User:

```javascript
// Create new user
app.post('/users', (req, res) => {
  const { name, email, age, city } = req.body;
  
  // Input validation
  if (!name || !email) {
    return res.status(400).json({
      error: 'Name and email are required fields'
    });
  }

  // Here you would save to database...
  const newUser = {
    id: Date.now(),
    name,
    email,
    age: age || null,
    city: city || null,
    createdAt: new Date()
  };

  res.status(201).json({
    message: 'User created successfully',
    user: newUser
  });
});
```

**Request with Body:**
```
POST http://localhost:3000/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "age": 28,
  "city": "New York"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "user": {
    "id": 1703245692834,
    "name": "John Doe",
    "email": "john@example.com",
    "age": 28,
    "city": "New York",
    "createdAt": "2025-12-22T10:34:52.834Z"
  }
}
```

---

### Example - Updating a User:

```javascript
// Update user - combination of params and body
app.put('/users/:id', (req, res) => {
  const userId = req.params.id;  // ID from URL
  const updates = req.body;       // Changes from body

  res.json({
    message: `Updating user ${userId}`,
    userId: userId,
    updates: updates
  });
});
```

**Request:**
```
PUT http://localhost:3000/users/123
Content-Type: application/json

{
  "email": "new.email@example.com",
  "city": "Los Angeles"
}
```

---

### ✅ When to use Body Parameters?

- **Creation (POST)** - Creating user, product, post
- **Update (PUT/PATCH)** - Updating existing information
- **Sensitive data** - Passwords, personal info (not visible in URL)
- **Complex data** - JSON with deep structure

---

## 4️⃣ Headers (req.headers)

### 🤔 What is it?

Additional information about the request - content type, authorization, language, etc.

### Example:

```javascript
app.get('/info', (req, res) => {
  const contentType = req.headers['content-type'];
  const authorization = req.headers['authorization'];
  const userAgent = req.headers['user-agent'];

  res.json({
    headers: {
      contentType: contentType || 'not specified',
      authorization: authorization || 'not specified',
      userAgent: userAgent || 'unknown'
    }
  });
});
```

---

## 🎯 Summary - When to use what?

| Type | Example | When to use? |
|------|---------|--------------|
| **Route Params** | `/users/:id` | Identifiers and specific resources |
| **Query Params** | `/users?age=25&city=NewYork` | Filtering, searching, sorting, pagination |
| **Body** | `{ "name": "John" }` | Creating and updating data |
| **Headers** | `Authorization: Bearer token` | Technical info (authorization, content type) |

---

## 💡 Combined Example - All Types Together!

```javascript
import express from 'express';
const app = express();

app.use(express.json());

// Route: Delete specific order
// Params: orderId
// Query: reason, notify
// Body: feedback
// Headers: authorization
app.delete('/users/:userId/orders/:orderId', (req, res) => {
  // 1. Route Parameters
  const { userId, orderId } = req.params;
  
  // 2. Query Parameters
  const { reason, notify } = req.query;
  
  // 3. Body
  const { feedback } = req.body;
  
  // 4. Headers
  const token = req.headers['authorization'];

  // Authorization check
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  // Response
  res.json({
    message: 'Order deleted successfully',
    details: {
      userId: userId,
      orderId: orderId,
      reason: reason || 'not specified',
      willNotifyUser: notify === 'true',
      feedback: feedback || 'no feedback',
      authenticated: !!token
    }
  });
});

app.listen(3000, () => {
  console.log('🚀 Server running on http://localhost:3000');
});
```

**Full Request:**
```
DELETE http://localhost:3000/users/123/orders/456?reason=outofstock&notify=true
Authorization: Bearer my-secret-token
Content-Type: application/json

{
  "feedback": "Product is out of stock"
}
```

**Response:**
```json
{
  "message": "Order deleted successfully",
  "details": {
    "userId": "123",
    "orderId": "456",
    "reason": "outofstock",
    "willNotifyUser": true,
    "feedback": "Product is out of stock",
    "authenticated": true
  }
}
```

---

## 🛠️ Practice Exercises

### Exercise 1 - Route Parameters
Create an endpoint that receives a username and year:
```
GET /profile/:username/year/:year
```

### Exercise 2 - Query Parameters
Create an endpoint for searching books:
```
GET /books?author=tolkien&minPages=300&genre=fantasy
```

### Exercise 3 - Body + Params
Create an endpoint for updating a post:
```
PUT /posts/:postId
Body: { title, content, tags }
```

### Exercise 4 - Combine Everything
Create an endpoint that combines params, query, body, and headers:
```
POST /api/users/:userId/comments?type=public&notify=true
Headers: Authorization, Content-Type
Body: { text, rating }
```

---

## 📚 Important Tips

### ✅ Do:
- Use Route Params for identifiers (`/users/123`)
- Use Query for filters (`?age=25&city=NewYork`)
- Use Body for complex or sensitive data
- Always check if parameters exist before using them

### ❌ Don't:
- Don't send passwords in Query Parameters (visible in URL!)
- Don't send complex JSON in Query (use Body)
- Don't use GET with Body (not standard)
- Don't forget `app.use(express.json())` when using Body

---

## 🎓 Summary

1. **Params** → Identifiers in path: `/users/:id`
2. **Query** → Filters and options: `?age=25&city=NewYork`
3. **Body** → Complex data: `{ "name": "John" }`
4. **Headers** → Metadata: `Authorization: Bearer token`

**Remember:** Each serves a different purpose. Use the right tool for the right job! 💪

---

## 🚀 Next Steps

Now that you understand Parameters, you can:
- Build more advanced APIs
- Add Validation (input checking)
- Learn about Middleware
- Connect to a database

**Good luck! 🎉**
