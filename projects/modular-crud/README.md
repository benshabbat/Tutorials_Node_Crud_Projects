# 📦 Modular CRUD API

A professional, modular CRUD application demonstrating separation of concerns using Node.js with ES Modules.

## 🏗️ Project Structure

```
modular-crud/
├── server.js                 # Main entry point
├── package.json             # Project configuration
├── models/                  # Data layer
│   └── userModel.js        # User data operations
├── controllers/            # Business logic layer
│   └── userController.js  # Request/response handlers
├── routes/                # Routing layer
│   └── userRoutes.js     # API endpoint definitions
└── middleware/           # Middleware functions
    └── errorHandler.js  # Error handling & logging
```

## 🎯 Architecture Pattern

This project follows the **MVC (Model-View-Controller)** pattern:

- **Models** (`models/`) - Data layer, handles all data operations
- **Controllers** (`controllers/`) - Business logic, validates input and processes requests
- **Routes** (`routes/`) - Defines API endpoints and maps them to controllers
- **Middleware** (`middleware/`) - Handles cross-cutting concerns (errors, logging)

## 🚀 Installation

```bash
cd modular-crud
npm install
```

## ▶️ Running the Server

```bash
npm start
```

Or with auto-reload in development:
```bash
npm run dev
```

The server runs on: `http://localhost:3001`

## 📚 API Endpoints

### Get All Users
```http
GET http://localhost:3001/api/users
```

### Get User Statistics
```http
GET http://localhost:3001/api/users/stats
```
Returns total users, users with age, and average age.

### Get Single User
```http
GET http://localhost:3001/api/users/1
```

### Create New User
```http
POST http://localhost:3001/api/users
Content-Type: application/json

{
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "age": 28
}
```

### Update User
```http
PUT http://localhost:3001/api/users/1
Content-Type: application/json

{
  "name": "Alice Williams",
  "email": "alice.w@example.com",
  "age": 29
}
```

### Delete User
```http
DELETE http://localhost:3001/api/users/1
```

## 🧪 Testing Examples

### Get all users:
```bash
curl http://localhost:3001/api/users
```

### Get statistics:
```bash
curl http://localhost:3001/api/users/stats
```

### Create user:
```bash
curl -X POST http://localhost:3001/api/users -H "Content-Type: application/json" -d "{\"name\":\"Tom Brown\",\"email\":\"tom@example.com\",\"age\":32}"
```

### Update user:
```bash
curl -X PUT http://localhost:3001/api/users/1 -H "Content-Type: application/json" -d "{\"age\":31}"
```

### Delete user:
```bash
curl -X DELETE http://localhost:3001/api/users/1
```

## 🔍 Key Features

### ✅ Modular Architecture
- Clear separation of concerns
- Easy to maintain and test
- Scalable structure

### ✅ Data Validation
- Email format validation
- Age range validation (0-150)
- Duplicate email prevention
- Required field checking

### ✅ Error Handling
- Centralized error middleware
- Consistent error responses
- Request logging

### ✅ Clean Code
- ES6+ modules (import/export)
- Named exports for utilities
- Consistent code style
- Meaningful function names

## 📖 How Each Layer Works

### 1. **Models** (`models/userModel.js`)
```javascript
export const getAllUsers = () => { /* ... */ }
export const createUser = (userData) => { /* ... */ }
```
- Pure data operations
- No HTTP logic
- Reusable functions
- Single responsibility

### 2. **Controllers** (`controllers/userController.js`)
```javascript
export const getUsers = (req, res, next) => {
  const users = UserModel.getAllUsers();
  res.json({ success: true, data: users });
}
```
- Handles requests/responses
- Validates input
- Calls model functions
- Returns formatted responses

### 3. **Routes** (`routes/userRoutes.js`)
```javascript
router.get('/', userController.getUsers);
router.post('/', userController.createUser);
```
- Defines URL endpoints
- Maps URLs to controllers
- HTTP method specification
- Clean routing logic

### 4. **Middleware** (`middleware/errorHandler.js`)
```javascript
export const errorHandler = (err, req, res, next) => {
  res.status(statusCode).json({ success: false, error: message });
}
```
- Centralized error handling
- Request logging
- 404 handling
- Consistent error format

## 🎓 Learning Benefits

### Compared to Simple CRUD:
1. **Separation of Concerns** - Each file has a single responsibility
2. **Testability** - Easy to test individual modules
3. **Maintainability** - Changes are isolated to specific files
4. **Scalability** - Easy to add new features (products, orders, etc.)
5. **Reusability** - Models can be reused across different routes

### Real-world Patterns:
- Professional project structure
- Industry-standard architecture
- Easy team collaboration
- Prepares for database integration

## 🔄 Next Steps

1. **Add Database** - Replace in-memory storage with MongoDB/PostgreSQL
2. **Add Authentication** - Implement JWT tokens
3. **Add Validation Library** - Use Joi or Zod for complex validation
4. **Add Unit Tests** - Test models, controllers separately
5. **Add More Resources** - Products, orders, categories
6. **Add Pagination** - For large datasets
7. **Add Search/Filter** - Query parameters

## 💡 Tips

- Each layer can be tested independently
- Models don't know about HTTP
- Controllers don't know about data storage
- Easy to swap data sources (memory → database)
- Middleware keeps code DRY

## 🆚 Simple vs Modular

| Feature | Simple CRUD | Modular CRUD |
|---------|-------------|--------------|
| Files | 1 file | Multiple organized files |
| Structure | All in one | Separated by concern |
| Testability | Hard to test | Easy to test |
| Scalability | Limited | Highly scalable |
| Maintenance | Difficult | Easy |
| Team work | Conflicts | Parallel work |

---

**Perfect for:** Learning professional Node.js architecture and preparing for real-world projects!
