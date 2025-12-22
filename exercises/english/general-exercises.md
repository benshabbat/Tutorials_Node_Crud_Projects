# 💪 Exercises - Node.js CRUD

## 📝 Difficulty Level: Beginners

### Exercise 1: Testing Endpoints
**Goal:** Understanding basic CRUD operations

1. Run the server in the main project (`npm start`)
2. Use cURL or Postman to perform the following operations:
   - Add 3 new users with different names and emails
   - Get the list of all users
   - Update the name of the user with ID=2
   - Delete the user with ID=1
   - Try to get the user you deleted - what's the result?

**Understanding Questions:**
- What's the difference between GET and POST?
- Why do you need to send `Content-Type: application/json` in POST/PUT requests?
- What happens to the data when you stop the server?

---

### Exercise 2: Adding New Fields
**Goal:** Changing data model and adding validation

**Task:**
1. Open `server.js`
2. Add a `phone` field to the user (optional)
3. Add an `age` field to the user (required, must be a number)
4. Add validation that age is between 0 and 120

**Example:**
```javascript
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "050-1234567",  // new
  "age": 25                 // new
}
```

**Testing:**
- Try creating a user without age field - do you get an error?
- Try creating a user with age: 150 - do you get an error?
- Try creating a user with age: "abc" - do you get an error?

---

### Exercise 3: Improving Error Messages
**Goal:** Learning about error handling

**Task:**
Add more detailed error messages:
- When user doesn't exist: "User with ID {id} not found"
- When name is missing: "Name field is required"
- When email is missing: "Email field is required"
- When email is invalid: "Email format is invalid"

**Hint:** Use regex to check email format:
```javascript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
```

---

## 📚 Difficulty Level: Intermediate

### Exercise 4: Creating Products API
**Goal:** Implementing a complete CRUD system from scratch

**Task:** Create a new API for products in Modular structure

**Folder Structure:**
```
products-api/
├── server.js
├── routes/
│   └── productRoutes.js
├── controllers/
│   └── productController.js
└── models/
    └── productModel.js
```

**Product Model:**
```javascript
{
  id: 1,
  name: "Laptop",
  price: 3500,
  category: "Electronics",
  stock: 15,
  description: "Advanced laptop"
}
```

**Required Endpoints:**
- `GET /products` - get all products
- `GET /products/:id` - get specific product
- `POST /products` - create new product
- `PUT /products/:id` - update product
- `DELETE /products/:id` - delete product

**Validation Tests:**
- Name must be at least 2 characters
- Price must be positive
- Stock cannot be negative

---

### Exercise 5: Adding Filters and Search
**Goal:** Learning Query Parameters

**Task:**
Add filtering options to `GET /products` endpoint:

**Usage Examples:**
```
GET /products?category=Electronics
GET /products?minPrice=1000&maxPrice=5000
GET /products?search=laptop
GET /products?inStock=true
GET /products?sortBy=price&order=asc
```

**Hint:** Use `req.query` to get the parameters
```javascript
const { category, minPrice, maxPrice, search } = req.query;
```

---

### Exercise 6: Logging Middleware
**Goal:** Understanding Middleware

**Task:**
Create middleware that logs every request to the server:

**Example Output:**
```
[2024-12-21 14:30:45] GET /products - 200 OK
[2024-12-21 14:31:12] POST /products - 201 Created
[2024-12-21 14:32:05] DELETE /products/5 - 404 Not Found
```

**Requirements:**
- Date and time
- HTTP method (GET/POST etc.)
- Path
- Status code

**Hint:** Use `Date()` and `res.on('finish')`

---

## 🚀 Difficulty Level: Advanced

### Exercise 7: Complete Order System
**Goal:** Combining multiple entities

**Task:**
Create an order system that includes:
- **Users**
- **Products**
- **Orders**

**Order Structure:**
```javascript
{
  id: 1,
  userId: 2,
  items: [
    { productId: 1, quantity: 2 },
    { productId: 3, quantity: 1 }
  ],
  totalPrice: 7500,
  status: "pending", // pending, confirmed, shipped, delivered
  createdAt: "2024-12-21T14:30:00Z"
}
```

**Required Endpoints:**
- `POST /orders` - create new order
- `GET /orders/:id` - get order
- `GET /users/:userId/orders` - all orders of a user
- `PATCH /orders/:id/status` - update order status

**Business Logic:**
- Check that user exists
- Check that all products exist
- Check sufficient stock
- Automatic calculation of total price
- Automatic stock reduction

---

### Exercise 8: Basic Authentication
**Goal:** Understanding authentication

**Task:**
Add a simple login system:

**Endpoints:**
```javascript
POST /auth/register - registration
POST /auth/login - login
```

**Requirements:**
1. Store passwords encrypted (use bcrypt)
2. Create simple token (random string)
3. Store tokens in memory
4. Add middleware to check authentication

**Installation:**
```bash
npm install bcrypt
```

**Usage Example:**
```javascript
import bcrypt from 'bcrypt';

// Hash password
const hashedPassword = await bcrypt.hash(password, 10);

// Compare password
const isValid = await bcrypt.compare(password, hashedPassword);
```

**Middleware for Checking:**
```javascript
export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  // Check token...
  next();
};
```

---

### Exercise 9: Pagination
**Goal:** Learning pagination for large data sets

**Task:**
Add pagination to the products endpoint:

**Usage Examples:**
```
GET /products?page=1&limit=10
GET /products?page=2&limit=5
```

**Expected Response:**
```javascript
{
  success: true,
  data: [...], // 10 products
  pagination: {
    currentPage: 1,
    totalPages: 5,
    totalItems: 50,
    itemsPerPage: 10,
    hasNextPage: true,
    hasPrevPage: false
  }
}
```

**Hint:** Pagination calculation
```javascript
const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 10;
const startIndex = (page - 1) * limit;
const endIndex = startIndex + limit;

const results = allProducts.slice(startIndex, endIndex);
```

---

### Exercise 10: Export to File
**Goal:** Working with File System

**Task:**
Add endpoint that exports all data to JSON file:

**Endpoints:**
```
GET /export/users
GET /export/products
GET /export/all
```

**Use fs module:**
```javascript
import fs from 'fs/promises';

await fs.writeFile('users.json', JSON.stringify(users, null, 2));
```

**Bonus:**
- Add date to filename: `users-2024-12-21.json`
- Allow export in CSV format too

---

## 🎯 Summary Project

### Exercise 11: Complete Blog API
**Goal:** Combining everything you learned

**System Includes:**

**1. Users:**
- Registration and login
- User profile
- Update details

**2. Posts:**
```javascript
{
  id: 1,
  title: "Title",
  content: "Content...",
  authorId: 2,
  tags: ["nodejs", "tutorial"],
  published: true,
  createdAt: "...",
  updatedAt: "..."
}
```

**3. Comments:**
```javascript
{
  id: 1,
  postId: 5,
  userId: 3,
  content: "Great comment!",
  createdAt: "..."
}
```

**Requirements:**
- ✅ Complete modular structure (routes, controllers, services, models)
- ✅ Comprehensive validation
- ✅ Advanced error handling
- ✅ Authentication
- ✅ Authorization (only author can delete/edit)
- ✅ Search and filters
- ✅ Pagination
- ✅ Middleware logging
- ✅ API documentation (README)

**Complete Endpoints:**

**Auth:**
- POST /auth/register
- POST /auth/login
- GET /auth/profile
- PUT /auth/profile

**Posts:**
- GET /posts (with filters)
- GET /posts/:id
- POST /posts (requires login)
- PUT /posts/:id (author only)
- DELETE /posts/:id (author only)
- GET /posts/user/:userId (all posts by user)

**Comments:**
- GET /posts/:postId/comments
- POST /posts/:postId/comments (requires login)
- DELETE /comments/:id (commenter only)

**Search:**
- GET /search?q=nodejs
- GET /posts?tag=tutorial
- GET /posts?author=username

---

## 📖 Additional Resources

### Recommended Tools:
- **Postman** - for testing API
- **Thunder Client** - VS Code extension
- **Nodemon** - auto-reload during development

### Useful Libraries:
```bash
npm install express      # server
npm install bcrypt       # password encryption
npm install joi          # advanced validation
npm install dotenv       # environment variables management
```

### Tips:
1. 🔍 Always check with `console.log()` what's happening
2. 📝 Write documentation for every endpoint
3. ✅ Test all cases (success, error, edge cases)
4. 🎨 Use tools like Postman
5. 🔄 Try to break your code - it's the best way to learn!

---

## 🏆 Additional Challenges

Want more? Try this:
- Add Rate Limiting (request limiting)
- Add CORS
- Add Swagger for automatic documentation
- Connect the project to a real database (MongoDB/PostgreSQL)
- Add File Upload for images
- Build a simple Frontend that connects to the API

---

**Good luck! 💪🚀**

If you get stuck, go back to the guides or try googling - it's part of learning!
