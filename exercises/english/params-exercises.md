# 🎯 Practical Exercises - Parameters

## 📋 Instructions

1. Create a new folder for exercises
2. Copy the file `params-exercises-template.js` to the folder
3. Complete the exercises one by one
4. Run the server and test with browser/Postman

---

## Exercise 1️⃣ - Basic Route Parameters

**Task:** Create an endpoint that receives a username and returns their profile.

```javascript
// Route:
GET /profile/:username

// Example:
GET /profile/john123

// Expected response:
{
  "username": "john123",
  "profileUrl": "http://localhost:3000/profile/john123",
  "message": "Welcome, john123!"
}
```

**Hint:** Use `req.params.username`

---

## Exercise 2️⃣ - Advanced Route Parameters

**Task:** Create an endpoint that returns book information by ISBN and year.

```javascript
// Route:
GET /books/:isbn/year/:year

// Example:
GET /books/978-3-16-148410-0/year/2020

// Expected response:
{
  "isbn": "978-3-16-148410-0",
  "year": "2020",
  "message": "Looking for book with ISBN 978-3-16-148410-0 published in 2020"
}
```

**Hint:** Use destructuring: `const { isbn, year } = req.params`

---

## Exercise 3️⃣ - Query Parameters - Filtering

**Task:** Create an endpoint for searching cars with filters.

```javascript
// Route:
GET /cars

// Examples:
GET /cars?color=red
GET /cars?brand=toyota&year=2020
GET /cars?minPrice=50000&maxPrice=100000

// Expected response:
{
  "filters": {
    "color": "red",
    "brand": null,
    "year": null,
    "minPrice": null,
    "maxPrice": null
  },
  "message": "Searching cars with filters"
}
```

**Hint:** Use `req.query` with default values

---

## Exercise 4️⃣ - Query Parameters - Sorting and Pagination

**Task:** Create an endpoint for movie list with sorting and pagination.

```javascript
// Route:
GET /movies

// Examples:
GET /movies?sortBy=rating&order=desc
GET /movies?page=2&limit=10
GET /movies?genre=action&sortBy=year&order=asc&page=1&limit=5

// Expected response:
{
  "filters": {
    "genre": "action"
  },
  "sorting": {
    "sortBy": "year",
    "order": "asc"
  },
  "pagination": {
    "page": 1,
    "limit": 5,
    "totalPages": 10,
    "totalItems": 50
  },
  "movies": []
}
```

**Hint:** Use default values: `const { page = 1, limit = 10 } = req.query`

---

## Exercise 5️⃣ - Body Parameters - Creation

**Task:** Create an endpoint for creating a new blog post.

```javascript
// Route:
POST /posts

// Body:
{
  "title": "My First Post",
  "content": "This is the content of the post",
  "author": "John",
  "tags": ["nodejs", "tutorial"]
}

// Expected response:
{
  "success": true,
  "message": "Post created successfully",
  "post": {
    "id": 1,
    "title": "My First Post",
    "content": "This is the content of the post",
    "author": "John",
    "tags": ["nodejs", "tutorial"],
    "createdAt": "2025-12-22T10:30:00.000Z"
  }
}
```

**Hints:**
- Don't forget `app.use(express.json())`
- Check that required fields exist
- Use `Date.now()` or `new Date()` for ID and date

---

## Exercise 6️⃣ - Body + Params - Update

**Task:** Create an endpoint for updating an existing product.

```javascript
// Route:
PUT /products/:id

// Example:
PUT /products/123

// Body:
{
  "price": 299.99,
  "stock": 50
}

// Expected response:
{
  "success": true,
  "message": "Product 123 updated successfully",
  "updates": {
    "price": 299.99,
    "stock": 50
  }
}
```

**Hint:** Get ID from `req.params.id` and changes from `req.body`

---

## Exercise 7️⃣ - Headers - Authentication

**Task:** Create a protected endpoint that requires an API Key in the header.

```javascript
// Route:
GET /admin/dashboard

// Headers:
X-API-KEY: my-secret-key-12345

// Response with key:
{
  "success": true,
  "message": "Welcome to dashboard",
  "data": { "users": 100, "orders": 500 }
}

// Response without key:
{
  "error": "API Key required",
  "hint": "Add header: X-API-KEY"
}
```

**Hints:**
- Use `req.headers['x-api-key']` (headers are lowercase!)
- Return status 401 if no key
- Return status 403 if key is wrong

---

## Exercise 8️⃣ - Combine Everything

**Task:** Create a complex endpoint that combines params, query, body, and headers.

```javascript
// Route:
POST /api/v1/users/:userId/orders

// Params: userId
// Query: type (delivery/pickup), notify (true/false)
// Body: { items: [], address: "" }
// Headers: Authorization

// Example:
POST /api/v1/users/123/orders?type=delivery&notify=true
Authorization: Bearer token123

{
  "items": [
    { "productId": 1, "quantity": 2 },
    { "productId": 5, "quantity": 1 }
  ],
  "address": "123 Main St, New York"
}

// Expected response:
{
  "success": true,
  "message": "Order created successfully",
  "order": {
    "id": 5001,
    "userId": 123,
    "type": "delivery",
    "items": [...],
    "address": "123 Main St, New York",
    "willNotify": true,
    "createdAt": "..."
  }
}
```

**Hints:**
- Check authorization first
- Ensure all required parameters exist
- `notify` is a string 'true' or 'false', convert to boolean

---

## Exercise 9️⃣ - Full Validation

**Task:** Create an endpoint with complete input validation.

```javascript
// Route:
POST /register

// Body:
{
  "username": "john123",
  "email": "john@example.com",
  "password": "pass123",
  "age": 25
}

// Validation rules:
// - username: 3-20 characters, letters and numbers only
// - email: must contain @ and .
// - password: minimum 6 characters
// - age: must be over 18

// Response with errors:
{
  "success": false,
  "errors": [
    "Password must be at least 6 characters",
    "Minimum age is 18"
  ]
}

// Successful response:
{
  "success": true,
  "message": "Registration successful!",
  "user": { ... }
}
```

**Hints:**
- Create an empty errors array
- Check each condition and add errors to array
- If there are errors, return 400 + error list
- If everything is valid, create the user

---

## Exercise 🔟 - Mini Project: To-Do List API

**Task:** Create a complete API for task management.

### Required Endpoints:

```javascript
// 1. Get all tasks (with filters)
GET /todos?status=pending&sortBy=createdAt&order=desc

// 2. Get specific task
GET /todos/:id

// 3. Create new task
POST /todos
Body: { title, description, priority, dueDate }

// 4. Update task
PUT /todos/:id
Body: { title?, description?, status?, priority? }

// 5. Delete task
DELETE /todos/:id?reason=completed

// 6. Mark task as completed
PATCH /todos/:id/complete

// 7. Search tasks
GET /search?q=shopping&fields=title,description
```

### Requirements:
- ✅ Full validation on all endpoints
- ✅ Clear error messages
- ✅ Correct status codes (200, 201, 400, 404)
- ✅ Data storage (array)
- ✅ Automatic IDs
- ✅ Timestamps (createdAt, updatedAt)

---

## 🎓 Bonus - Additional Challenges

### Challenge 1: Rate Limiting
Create middleware that checks how many times a user called the API and limits them.

### Challenge 2: Advanced Pagination
Create a pagination system with links (next, previous, first, last).

### Challenge 3: API Documentation
Create an endpoint that returns automatic documentation of all endpoints.

### Challenge 4: Request Logger
Create middleware that logs every request (method, path, params, query, body).

---

## ✅ Solutions

Solutions to all exercises are in the file:
`params-exercises-solutions-en.js`

Don't peek before you try! 😊

---

## 💡 Tips for Success

1. **Start small** - One exercise at a time
2. **Test in browser** - For GET requests
3. **Use Postman** - For POST/PUT/DELETE
4. **Console log** - `console.log(req.params, req.query, req.body)`
5. **Read errors** - They tell you what's wrong!
6. **Experiment** - Try different values and see what happens

---

## 🚀 When you finish all exercises

You will know how to:
- ✅ Use Route Params for identifiers
- ✅ Use Query for filtering and sorting
- ✅ Use Body for creation and updates
- ✅ Check Headers for authentication
- ✅ Combine everything into a complex API
- ✅ Do full validation
- ✅ Write clean and organized code

**Good luck! 💪🎉**
