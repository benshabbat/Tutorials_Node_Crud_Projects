# 🎯 Simple CRUD Project

A basic CRUD project for absolute beginners using in-memory storage (Array).

## 📋 Description

This is the simplest project demonstrating:
- ✅ Express server setup
- ✅ Basic CRUD operations (Create, Read, Update, Delete)
- ✅ In-memory data storage with Array
- ✅ No additional dependencies
- ✅ Perfect for absolute beginners

## 🎯 Who is this for?

- People taking their first steps with Node.js and Express
- Those who want to understand CRUD basics
- Anyone who wants to learn without complications

## 🚀 Installation and Setup

### 1. Install packages

```powershell
npm install
```

### 2. Run the server

```powershell
npm start
```

The server will run on http://localhost:3000

## 📚 Project Structure

```
simple-crud/
├── server.js         # Main server file
├── package.json      # Project configuration
└── README.md         # This guide
```

## 🌐 API Endpoints

### 🏠 Home Page
```powershell
curl http://localhost:3000/
```

Returns API information and current statistics.

### 📖 Get All Users
```powershell
curl http://localhost:3000/users
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "users": [...]
}
```

### 🔍 Get Specific User
```powershell
curl http://localhost:3000/users/1
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### ➕ Create New User
```powershell
curl -X POST http://localhost:3000/users `
  -H "Content-Type: application/json" `
  -d '{
    \"name\": \"Jane Smith\",
    \"email\": \"jane@example.com\"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "user": {
    "id": 2,
    "name": "Jane Smith",
    "email": "jane@example.com"
  }
}
```

### ✏️ Update User
```powershell
curl -X PUT http://localhost:3000/users/1 `
  -H "Content-Type: application/json" `
  -d '{
    \"name\": \"John Smith\",
    \"email\": \"john.smith@example.com\"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "User updated successfully",
  "user": {
    "id": 1,
    "name": "John Smith",
    "email": "john.smith@example.com"
  }
}
```

### ❌ Delete User
```powershell
curl -X DELETE http://localhost:3000/users/1
```

**Response:**
```json
{
  "success": true,
  "message": "User deleted successfully",
  "user": {
    "id": 1,
    "name": "John Smith",
    "email": "john.smith@example.com"
  }
}
```

## 🔑 Key Features

### 1. In-Memory Storage
```javascript
// Data is stored in a simple array
const users = [];
```

### 2. Simple CRUD Operations
```javascript
// Create
users.push(newUser);

// Read
const user = users.find(u => u.id === id);

// Update
users[index] = updatedUser;

// Delete
users.splice(index, 1);
```

### 3. Input Validation
```javascript
// Check required fields
if (!name || !email) {
  return res.status(400).json({ error: 'Required fields' });
}
```

## 🎓 What You'll Learn

1. **Express Basics**
   - Server setup
   - Route handling
   - Middleware usage

2. **HTTP Methods**
   - GET - retrieve data
   - POST - create data
   - PUT - update data
   - DELETE - delete data

3. **Status Codes**
   - 200 - Success
   - 201 - Created
   - 400 - Bad Request
   - 404 - Not Found
   - 409 - Conflict

4. **JSON**
   - Sending JSON responses
   - Receiving JSON data
   - Working with `express.json()`

## ⚠️ Important Notes

### Data is NOT Persistent
⚠️ **Important:** When you stop the server, all data is lost!

This is because:
- Data is stored in memory (Array)
- Not saved to files or database
- Designed for learning purposes only

**For persistent storage, see:** [fs-promises-crud](../../fs-promises-crud/)

## 📖 Common Errors

### "Address already in use"
**Solution:** Another process is using port 3000. Change the port or stop the other process.

### "Cannot POST /users"
**Solution:** Make sure to include `Content-Type: application/json` header.

### "Email already exists"
**Solution:** Use a different email - duplicates are not allowed.

## 🔄 Difference from Other Projects

| Feature | Simple CRUD | FS Promises |
|---------|-------------|-------------|
| Storage | Memory (Array) | Files (JSON) |
| Persistent? | ❌ No | ✅ Yes |
| Complexity | Very Simple | Medium |
| Files | 1 | 1 |
| Lines of Code | ~150 | ~300 |

## 📖 Next Steps

After mastering this project:

1. **Add features:**
   - Age validation
   - Search by name
   - Sorting options

2. **Move to next level:**
   - [FS Promises CRUD](../../fs-promises-crud/) - Learn file storage
   - [Modular CRUD](../../modular-crud/) - Learn code organization

3. **Read guides:**
   - [Params Guide](../../../guides/english/params-guide.md)
   - [Beginner's Guide](../../../guides/english/quick-start.md)

## 🎯 Challenges

Try to add:
1. ✅ Age field with validation (0-150)
2. ✅ City field
3. ✅ Search endpoint
4. ✅ Sorting by name or email

## 🛠️ Development Tips

### Quick Testing
```powershell
# View all users
curl http://localhost:3000/users

# Create test user
curl -X POST http://localhost:3000/users `
  -H "Content-Type: application/json" `
  -d '{\"name\": \"Test User\", \"email\": \"test@example.com\"}'
```

### Auto-restart on Changes
```powershell
npm run dev
```

This uses `--watch` flag to restart automatically on file changes.

## 🤝 Contributing

Found a bug? Have an improvement idea?
Open an issue or send a pull request!

## 📄 License

MIT License - Free to use and learn from!

---

**Happy Coding! 🚀**
