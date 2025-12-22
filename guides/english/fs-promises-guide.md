# 📂 File System Promises Guide with Node.js + Express

## 🎯 What Will We Learn?

1. **fs.promises** - Working with files asynchronously
2. **async/await** - Clean syntax for asynchronous operations
3. **CRUD with files** - Create, Read, Update, Delete
4. **Integration with Express** - API that works with files
5. **Best Practices** - How to do it right

---

## 🤔 Why File System Promises?

### ❌ The Old Way (Callbacks)
```javascript
fs.readFile('data.json', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(data);
});
```
**Problems:**
- Callback Hell (nested code)
- Difficult error handling
- Not intuitive

---

### ✅ The Modern Way (Promises + async/await)
```javascript
try {
  const data = await fs.readFile('data.json', 'utf8');
  console.log(data);
} catch (err) {
  console.error(err);
}
```
**Benefits:**
- Clean and readable code
- Simple error handling with try/catch
- Easy to chain operations
- Modern syntax

---

## 📦 Installation and Setup

### Step 1: Create a Project

```bash
mkdir fs-promises-tutorial
cd fs-promises-tutorial
npm init -y
```

### Step 2: Install Express

```bash
npm install express
```

### Step 3: Configure package.json

Add this line:
```json
{
  "type": "module"
}
```

**Why?** To use `import` instead of `require`.

---

## 🔧 fs.promises Basics

### Importing the Module

```javascript
import fs from 'fs/promises';
import express from 'express';

const app = express();
app.use(express.json());
```

---

### Basic Operations

#### 1️⃣ Reading a File (Read)

```javascript
// Reading a text file
async function readTextFile() {
  try {
    const data = await fs.readFile('file.txt', 'utf8');
    console.log(data);
  } catch (err) {
    console.error('Error reading file:', err);
  }
}

// Reading JSON
async function readJsonFile() {
  try {
    const data = await fs.readFile('data.json', 'utf8');
    const jsonData = JSON.parse(data);
    console.log(jsonData);
  } catch (err) {
    console.error('Error reading JSON:', err);
  }
}
```

---

#### 2️⃣ Writing a File (Write)

```javascript
// Writing text
async function writeTextFile() {
  try {
    await fs.writeFile('output.txt', 'Hello World!', 'utf8');
    console.log('File written successfully');
  } catch (err) {
    console.error('Error writing file:', err);
  }
}

// Writing JSON
async function writeJsonFile() {
  try {
    const data = { name: 'John', age: 30 };
    await fs.writeFile('data.json', JSON.stringify(data, null, 2), 'utf8');
    console.log('JSON file written successfully');
  } catch (err) {
    console.error('Error writing JSON:', err);
  }
}
```

**💡 Tip:** `JSON.stringify(data, null, 2)` creates formatted JSON with 2 spaces.

---

#### 3️⃣ Appending to a File (Append)

```javascript
async function appendToFile() {
  try {
    await fs.appendFile('log.txt', 'New log entry\n', 'utf8');
    console.log('Data appended successfully');
  } catch (err) {
    console.error('Error appending to file:', err);
  }
}
```

---

#### 4️⃣ Deleting a File (Delete)

```javascript
async function deleteFile() {
  try {
    await fs.unlink('file.txt');
    console.log('File deleted successfully');
  } catch (err) {
    console.error('Error deleting file:', err);
  }
}
```

---

#### 5️⃣ Checking if File Exists

```javascript
async function fileExists(filepath) {
  try {
    await fs.access(filepath);
    return true;
  } catch {
    return false;
  }
}

// Usage
const exists = await fileExists('data.json');
console.log('File exists:', exists);
```

---

#### 6️⃣ Creating a Directory

```javascript
async function createDirectory() {
  try {
    await fs.mkdir('data', { recursive: true });
    console.log('Directory created successfully');
  } catch (err) {
    console.error('Error creating directory:', err);
  }
}
```

**💡 Tip:** `{ recursive: true }` creates parent directories if needed.

---

#### 7️⃣ Reading List of Files in Directory

```javascript
async function listFiles() {
  try {
    const files = await fs.readdir('data');
    console.log('Files:', files);
  } catch (err) {
    console.error('Error reading directory:', err);
  }
}
```

---

## 🎨 Practical Example: CRUD with Files

### Project Structure

```
fs-promises-tutorial/
├── data/
│   └── users.json
├── server.js
└── package.json
```

### users.json file (initial)

```json
[]
```

---

### server.js - Complete Server

```javascript
import fs from 'fs/promises';
import express from 'express';
import path from 'path';

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Path to data file
const DATA_FILE = './data/users.json';

// ===================================
// Helper functions for working with files
// ===================================

// Read all users
async function readUsers() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    // If file doesn't exist, return empty array
    if (err.code === 'ENOENT') {
      return [];
    }
    throw err;
  }
}

// Write users to file
async function writeUsers(users) {
  await fs.writeFile(DATA_FILE, JSON.stringify(users, null, 2), 'utf8');
}

// Create data directory if it doesn't exist
async function ensureDataDirectory() {
  try {
    await fs.mkdir('./data', { recursive: true });
  } catch (err) {
    console.error('Error creating data directory:', err);
  }
}

// ===================================
// API Endpoints
// ===================================

// GET - get all users
app.get('/users', async (req, res) => {
  try {
    const users = await readUsers();
    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Error reading users',
      details: err.message
    });
  }
});

// GET - get specific user
app.get('/users/:id', async (req, res) => {
  try {
    const users = await readUsers();
    const user = users.find(u => u.id === parseInt(req.params.id));

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Error reading user',
      details: err.message
    });
  }
});

// POST - create new user
app.post('/users', async (req, res) => {
  try {
    const { name, email, age } = req.body;

    // Validation
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        error: 'Name and email are required'
      });
    }

    // Read existing users
    const users = await readUsers();

    // Check if email already exists
    if (users.find(u => u.email === email)) {
      return res.status(409).json({
        success: false,
        error: 'Email already exists'
      });
    }

    // Create new user
    const newUser = {
      id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
      name,
      email,
      age: age || null,
      createdAt: new Date().toISOString()
    };

    // Add to list
    users.push(newUser);

    // Save to file
    await writeUsers(users);

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: newUser
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Error creating user',
      details: err.message
    });
  }
});

// PUT - update user
app.put('/users/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const updates = req.body;

    // Read users
    const users = await readUsers();
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Update user
    users[userIndex] = {
      ...users[userIndex],
      ...updates,
      id: userId, // Keep original ID
      updatedAt: new Date().toISOString()
    };

    // Save to file
    await writeUsers(users);

    res.json({
      success: true,
      message: 'User updated successfully',
      user: users[userIndex]
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Error updating user',
      details: err.message
    });
  }
});

// DELETE - delete user
app.delete('/users/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    // Read users
    const users = await readUsers();
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Save the deleted user
    const deletedUser = users[userIndex];

    // Remove from list
    users.splice(userIndex, 1);

    // Save to file
    await writeUsers(users);

    res.json({
      success: true,
      message: 'User deleted successfully',
      user: deletedUser
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Error deleting user',
      details: err.message
    });
  }
});

// ===================================
// Start server
// ===================================

async function startServer() {
  try {
    // Ensure data directory exists
    await ensureDataDirectory();

    // Start server
    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════╗
║  🚀 Server is running!                ║
║  📍 URL: http://localhost:${PORT}       ║
║  📂 Data file: ${DATA_FILE}            ║
╚════════════════════════════════════════╝
      `);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
```

---

## 🧪 Testing the API

### 1. Create user
```bash
POST http://localhost:3000/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "age": 28
}
```

### 2. Get all users
```bash
GET http://localhost:3000/users
```

### 3. Get specific user
```bash
GET http://localhost:3000/users/1
```

### 4. Update user
```bash
PUT http://localhost:3000/users/1
Content-Type: application/json

{
  "age": 29,
  "city": "New York"
}
```

### 5. Delete user
```bash
DELETE http://localhost:3000/users/1
```

---

## 💡 Important Tips

### 1️⃣ Always Use try/catch

```javascript
// ❌ Not good
async function readData() {
  const data = await fs.readFile('data.json', 'utf8');
  return JSON.parse(data);
}

// ✅ Good
async function readData() {
  try {
    const data = await fs.readFile('data.json', 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error:', err);
    throw err;
  }
}
```

---

### 2️⃣ Handle Non-existent File

```javascript
async function readUsers() {
  try {
    const data = await fs.readFile('users.json', 'utf8');
    return JSON.parse(data);
  } catch (err) {
    // If file doesn't exist, return empty array
    if (err.code === 'ENOENT') {
      return [];
    }
    // Other error - throw it
    throw err;
  }
}
```

---

### 3️⃣ Format Readable JSON

```javascript
// ❌ Hard to read
await fs.writeFile('data.json', JSON.stringify(data), 'utf8');

// ✅ Easy to read
await fs.writeFile('data.json', JSON.stringify(data, null, 2), 'utf8');
```

---

### 4️⃣ Don't Forget Encoding

```javascript
// ✅ Always specify 'utf8' for text files
await fs.readFile('file.txt', 'utf8');
await fs.writeFile('file.txt', 'content', 'utf8');
```

---

### 5️⃣ Use Path for File Paths

```javascript
import path from 'path';

// ✅ Works on all operating systems
const dataPath = path.join('data', 'users.json');

// ❌ May not work on Windows
const dataPath = 'data/users.json';
```

---

## 🔒 Best Practices

### 1. Separate Logic

Create a separate file for working with files:

**fileHandler.js:**
```javascript
import fs from 'fs/promises';

export async function readJsonFile(filepath) {
  try {
    const data = await fs.readFile(filepath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    if (err.code === 'ENOENT') {
      return null;
    }
    throw err;
  }
}

export async function writeJsonFile(filepath, data) {
  await fs.writeFile(filepath, JSON.stringify(data, null, 2), 'utf8');
}
```

**server.js:**
```javascript
import { readJsonFile, writeJsonFile } from './fileHandler.js';

app.get('/users', async (req, res) => {
  const users = await readJsonFile('./data/users.json');
  res.json(users || []);
});
```

---

### 2. Create Backup

```javascript
async function updateUsersWithBackup(users) {
  // Create backup
  const backupPath = `./data/users.backup.${Date.now()}.json`;
  
  try {
    // Read old data
    const oldData = await fs.readFile('./data/users.json', 'utf8');
    await fs.writeFile(backupPath, oldData, 'utf8');
  } catch (err) {
    console.log('No backup needed, file doesn\'t exist');
  }

  // Write new data
  await writeUsers(users);
}
```

---

### 3. JSON Validation

```javascript
async function readJsonSafely(filepath) {
  try {
    const data = await fs.readFile(filepath, 'utf8');
    
    // Check if JSON is valid
    try {
      return JSON.parse(data);
    } catch (parseErr) {
      console.error('Invalid JSON in file:', filepath);
      throw new Error('File contains invalid JSON');
    }
  } catch (err) {
    throw err;
  }
}
```

---

### 4. Logging

```javascript
async function logAction(action, data) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    action,
    data
  };
  
  const logLine = JSON.stringify(logEntry) + '\n';
  await fs.appendFile('./logs/app.log', logLine, 'utf8');
}

// Usage
await logAction('USER_CREATED', { id: 1, name: 'John' });
```

---

## ⚠️ Common Errors and Solutions

### Error 1: ENOENT - File Not Found

```javascript
// ❌ Code crashes
const data = await fs.readFile('missing.json', 'utf8');

// ✅ Error handling
try {
  const data = await fs.readFile('missing.json', 'utf8');
} catch (err) {
  if (err.code === 'ENOENT') {
    console.log('File not found, creating new one');
    await fs.writeFile('missing.json', '[]', 'utf8');
  }
}
```

---

### Error 2: EACCES - No Permission

```javascript
// Check permissions before writing
try {
  await fs.access('./data', fs.constants.W_OK);
} catch {
  console.error('No write permission for data directory');
}
```

---

### Error 3: Invalid JSON

```javascript
try {
  const data = await fs.readFile('data.json', 'utf8');
  const json = JSON.parse(data);
} catch (err) {
  if (err instanceof SyntaxError) {
    console.error('Invalid JSON format');
  } else {
    console.error('File read error:', err);
  }
}
```

---

## 🎯 Exercises

### Exercise 1 - Phone Book
Create API for managing contacts:
- `GET /contacts` - all contacts
- `POST /contacts` - add contact
- `PUT /contacts/:id` - update contact
- `DELETE /contacts/:id` - delete contact

---

### Exercise 2 - Logging System
Create system that logs every action to a log file:
- Every server request
- Every data change
- Errors

---

### Exercise 3 - Automatic Backup System
Create system that creates backup every minute:
- Save current data
- Delete old backups (over 10)
- Ability to restore from backup

---

## 📚 Summary

### What we learned:
✅ **fs.promises** - Working with files in a modern way  
✅ **async/await** - Clean and convenient syntax  
✅ **CRUD with files** - Create, Read, Update, Delete  
✅ **Integration with Express** - Complete API with persistence  
✅ **Best Practices** - How to do it right  
✅ **Error Handling** - Handling errors  

### Next step:
- 📊 MongoDB - Real database
- 🔐 Authentication - User authentication
- 📁 File Upload - Uploading files
- 🧪 Testing - Automated tests

**Good luck! 🚀**
