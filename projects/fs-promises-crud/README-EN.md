# 📂 File System Promises CRUD Project

Complete CRUD project with persistent data storage in JSON files using `fs/promises`.

## 📋 Description

This is an intermediate project demonstrating:
- ✅ Persistent data storage in files
- ✅ Asynchronous read/write with `async/await`
- ✅ Managing formatted JSON files
- ✅ Handling file errors (ENOENT)
- ✅ Automatic directory creation

## 🎯 Who is this for?

- Those who completed the basic project (`simple-crud`)
- Anyone wanting to learn about data persistence
- Those interested in working with File System

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
fs-promises-crud/
├── server.js         # Main server
├── package.json      # Project configuration
├── data/             # Folder for files (auto-created)
│   └── users.json    # Users file
└── README.md         # This guide
```

## 🌐 API Endpoints

### 🏠 Home Page
```powershell
curl http://localhost:3000/
```

Returns API information and statistics.

### 📖 Get All Users
```powershell
# All users
curl http://localhost:3000/users

# With filters
curl "http://localhost:3000/users?search=john"
curl "http://localhost:3000/users?minAge=25"
curl "http://localhost:3000/users?minAge=20&maxAge=40"
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "totalCount": 2,
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
    "email": "john@example.com",
    "age": 30,
    "city": "New York",
    "createdAt": "2024-01-01T10:00:00.000Z",
    "updatedAt": "2024-01-01T10:00:00.000Z"
  }
}
```

### ➕ Create New User
```powershell
curl -X POST http://localhost:3000/users `
  -H "Content-Type: application/json" `
  -d '{
    \"name\": \"Jane Smith\",
    \"email\": \"jane@example.com\",
    \"age\": 28,
    \"city\": \"Los Angeles\"
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
    "email": "jane@example.com",
    "age": 28,
    "city": "Los Angeles",
    "createdAt": "2024-01-01T10:05:00.000Z",
    "updatedAt": "2024-01-01T10:05:00.000Z"
  }
}
```

### ✏️ Update User
```powershell
curl -X PUT http://localhost:3000/users/1 `
  -H "Content-Type: application/json" `
  -d '{
    \"age\": 31,
    \"city\": \"Chicago\"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "User updated successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "age": 31,
    "city": "Chicago",
    "createdAt": "2024-01-01T10:00:00.000Z",
    "updatedAt": "2024-01-01T10:10:00.000Z"
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
    "name": "John Doe",
    ...
  }
}
```

### 📊 Statistics
```powershell
curl http://localhost:3000/stats
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalUsers": 5,
    "averageAge": 30,
    "cities": ["New York", "Los Angeles", "Chicago"],
    "dataFile": "./data/users.json"
  }
}
```

## 💾 Data File

Data is saved in `data/users.json`:

```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "age": 30,
    "city": "New York",
    "createdAt": "2024-01-01T10:00:00.000Z",
    "updatedAt": "2024-01-01T10:00:00.000Z"
  }
]
```

## 🔑 Key Features

### 1. Persistent Storage
```javascript
// Every operation saves the data
await writeUsers(users);
```

### 2. Automatic Directory Creation
```javascript
async function ensureDataDirectory() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}
```

### 3. Handling Missing File
```javascript
async function readUsers() {
  try {
    const data = await fs.readFile(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    if (err.code === 'ENOENT') {
      // Create new file
      await writeUsers([]);
      return [];
    }
    throw err;
  }
}
```

### 4. Formatted JSON
```javascript
// Save with beautiful formatting (2 spaces)
JSON.stringify(users, null, 2)
```

## 🎓 What You'll Learn

1. **File System Promises**
   - `fs.readFile()` - reading files
   - `fs.writeFile()` - writing to files
   - `fs.mkdir()` - creating directories

2. **Async/Await**
   - Proper asynchronous work
   - Error handling with try/catch
   - Declaring async functions

3. **JSON**
   - Converting from string to object with `JSON.parse()`
   - Converting from object to string with `JSON.stringify()`
   - Beautiful formatting with null, 2

4. **Timestamps**
   - Creation date: `createdAt`
   - Update date: `updatedAt`
   - ISO format: `new Date().toISOString()`

## ⚠️ Common Errors

### ENOENT - File not found
**Solution:** The code handles this automatically and creates a new file.

### JSON Parse Error
**Solution:** Check that the file contains valid JSON.

### Permission Denied
**Solution:** Ensure you have write permissions to the directory.

## 🔄 Differences from Basic Project

| Feature | Basic (Array) | FS Promises (File) |
|---------|--------------|-------------------|
| Data Storage | Memory only | Persistent file |
| Survives Restart? | ❌ No | ✅ Yes |
| Complexity | Simple | Medium |
| Read/Write Functions | - | ✅ Yes |
| Timestamps | - | ✅ Yes |

## 📖 Further Learning

1. **Guides:**
   - [fs.promises Guide](../../guides/english/fs-promises-guide.md)
   - [Params Guide](../../guides/english/params-guide.md)

2. **Examples:**
   - [Complete fs.promises Example](../../examples/english/fs-promises-example.js)

3. **Exercises:**
   - [fs.promises Exercises](../../exercises/english/fs-promises-exercises.md)

## 🎯 Challenges

Try to add:
1. ✅ Automatic backup system
2. ✅ Log file for every operation
3. ✅ Cleanup of old users
4. ✅ Export to different formats (CSV)

## 🛠️ Development Tips

### Quick Testing
```powershell
# Check the file
Get-Content .\data\users.json

# Delete file to start fresh
Remove-Item .\data\users.json
```

### Watch for Changes in Real-time
```powershell
npm run dev
```

This uses `--watch` for automatic restart.

## 🤝 Contributing

Found a bug? Have an improvement idea?
Open an issue or send a pull request!

## 📄 License

MIT License - Free to use and learn from!

---

**Happy Coding! 🚀**
