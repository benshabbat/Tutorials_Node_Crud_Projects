# 🎯 Beginner's Guide - Node.js Step by Step

## What is Node.js? 🤔

Node.js allows you to write JavaScript code on the server side (not just in the browser). With it, you can create servers, work with files, and build full applications.

---

## Step 1️⃣ - Installation

1. **Download Node.js** from [nodejs.org](https://nodejs.org)
2. **Install** (click Next until the end)
3. **Verification** - Open Terminal (PowerShell or CMD):
   ```bash
   node --version
   ```
   See a number? Excellent! ✅
   
   ```bash
   npm --version
   ```
   Should see a number here too ✅

---

## Step 2️⃣ - Creating a Project

Open Terminal and copy the following commands one by one:

```bash
mkdir my-server
cd my-server
npm init -y
```

**What did we do?**
- `mkdir my-server` - created a new folder
- `cd my-server` - entered the folder
- `npm init -y` - created a `package.json` file (project's ID card)

Now you have a folder with a `package.json` file 📦

---

## Step 3️⃣ - Project Setup

Open the `package.json` file and add the line `"type": "module"`:

```json
{
  "name": "my-server",
  "version": "1.0.0",
  "type": "module",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "node --watch server.js"
  }
}
```

**Why?** To use `import` (modern syntax) 🚀

---

## Step 4️⃣ - Installing Express

Express is a framework that helps us build servers easily:

```bash
npm install express
```

---

## Step 5️⃣ - Creating Your First Simple Server

Create a `server.js` file and copy inside:

```javascript
import express from 'express';

const app = express();
const PORT = 3000;

// First test endpoint
app.get('/', (req, res) => {
  res.send('Hello! My server is working! 🎉');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

**Run:**
```bash
npm run dev
```

**Test:**
Open browser and go to http://localhost:3000

---

## Step 6️⃣ - Adding More Routes

Let's add more routes to the server:

```javascript
import express from 'express';

const app = express();
const PORT = 3000;

// Home page
app.get('/', (req, res) => {
  res.send('Hello! Welcome to my server 🎉');
});

// About page
app.get('/about', (req, res) => {
  res.send('This is a Node.js server built with Express');
});

// Page with JSON
app.get('/api/info', (req, res) => {
  res.json({
    message: 'This is JSON',
    version: '1.0.0',
    status: 'active'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

**Test:**
- http://localhost:3000
- http://localhost:3000/about
- http://localhost:3000/api/info

---

## Step 7️⃣ - Working with File System (fs)

### Example 1: Reading a File

Create a `data.txt` file with some text, then:

```javascript
import express from 'express';
import fs from 'fs/promises';

const app = express();
const PORT = 3000;

// Reading a file
app.get('/read-file', async (req, res) => {
  try {
    const data = await fs.readFile('data.txt', 'utf-8');
    res.send(`File content: ${data}`);
  } catch (error) {
    res.status(500).send('Error reading file');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

### Example 2: Writing to a File

```javascript
import express from 'express';
import fs from 'fs/promises';

const app = express();
const PORT = 3000;

// Writing to a file
app.get('/write-file', async (req, res) => {
  try {
    const message = `Written on ${new Date().toLocaleString('en-US')}`;
    await fs.writeFile('log.txt', message);
    res.send('File written successfully! ✅');
  } catch (error) {
    res.status(500).send('Error writing file');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

### Example 3: Appending Content to Existing File

```javascript
import express from 'express';
import fs from 'fs/promises';

const app = express();
const PORT = 3000;

// Appending to a file
app.get('/append-file', async (req, res) => {
  try {
    const message = `\nNew line: ${new Date().toLocaleString('en-US')}`;
    await fs.appendFile('log.txt', message);
    res.send('Line added successfully! ✅');
  } catch (error) {
    res.status(500).send('Error appending content');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

---

## Step 8️⃣ - Complete Server with fs - Task List Management

Complete example of a server managing a task list using a JSON file:

```javascript
import express from 'express';
import fs from 'fs/promises';

const app = express();
const PORT = 3000;
const TASKS_FILE = 'tasks.json';

// Middleware to read JSON from request
app.use(express.json());

// Function to read tasks from file
async function readTasks() {
  try {
    const data = await fs.readFile(TASKS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return []; // If file doesn't exist, return empty array
  }
}

// Function to write tasks to file
async function writeTasks(tasks) {
  await fs.writeFile(TASKS_FILE, JSON.stringify(tasks, null, 2));
}

// Get all tasks
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await readTasks();
    res.json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error reading tasks' });
  }
});

// Create new task
app.post('/tasks', async (req, res) => {
  try {
    const { title } = req.body;
    
    if (!title) {
      return res.status(400).json({ 
        success: false, 
        message: 'Task title is required' 
      });
    }
    
    const tasks = await readTasks();
    const newTask = {
      id: Date.now(),
      title,
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    tasks.push(newTask);
    await writeTasks(tasks);
    
    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: newTask
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating task' });
  }
});

// Delete task
app.delete('/tasks/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const tasks = await readTasks();
    const filteredTasks = tasks.filter(task => task.id !== id);
    
    if (tasks.length === filteredTasks.length) {
      return res.status(404).json({ 
        success: false, 
        message: 'Task not found' 
      });
    }
    
    await writeTasks(filteredTasks);
    
    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting task' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Try: GET http://localhost:${PORT}/tasks`);
});
```

**Test with browser or Postman:**
- `GET http://localhost:3000/tasks` - View all tasks
- `POST http://localhost:3000/tasks` - Create task (send JSON: `{"title": "New task"}`)
- `DELETE http://localhost:3000/tasks/123` - Delete task

---

## Step 9️⃣ - Important Tips 💡

### 1. Automatic File Saving
Use `--watch` so the server restarts automatically:
```bash
node --watch server.js
```

### 2. Error Handling
Always use `try-catch` when working with fs:
```javascript
try {
  const data = await fs.readFile('file.txt', 'utf-8');
} catch (error) {
  console.error('Error:', error.message);
}
```

### 3. Checking File Existence
```javascript
import fs from 'fs/promises';

async function fileExists(path) {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
}
```

### 4. Reading All Files in a Directory
```javascript
const files = await fs.readdir('./data');
console.log(files);
```

---

## Step 🔟 - More Complex Example - File Server

Server that allows uploading, viewing and deleting files:

```javascript
import express from 'express';
import fs from 'fs/promises';
import path from 'path';

const app = express();
const PORT = 3000;
const UPLOADS_DIR = './uploads';

app.use(express.json());

// Create uploads directory if it doesn't exist
async function ensureUploadsDir() {
  try {
    await fs.access(UPLOADS_DIR);
  } catch {
    await fs.mkdir(UPLOADS_DIR);
  }
}

ensureUploadsDir();

// List all files
app.get('/files', async (req, res) => {
  try {
    const files = await fs.readdir(UPLOADS_DIR);
    const filesInfo = await Promise.all(
      files.map(async (file) => {
        const stats = await fs.stat(path.join(UPLOADS_DIR, file));
        return {
          name: file,
          size: stats.size,
          modified: stats.mtime
        };
      })
    );
    
    res.json({
      success: true,
      count: filesInfo.length,
      data: filesInfo
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error reading files' });
  }
});

// Read specific file
app.get('/files/:filename', async (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(UPLOADS_DIR, filename);
    const content = await fs.readFile(filePath, 'utf-8');
    
    res.json({
      success: true,
      filename,
      content
    });
  } catch (error) {
    res.status(404).json({ success: false, message: 'File not found' });
  }
});

// Create new file
app.post('/files', async (req, res) => {
  try {
    const { filename, content } = req.body;
    
    if (!filename || !content) {
      return res.status(400).json({ 
        success: false, 
        message: 'Filename and content are required' 
      });
    }
    
    const filePath = path.join(UPLOADS_DIR, filename);
    await fs.writeFile(filePath, content);
    
    res.status(201).json({
      success: true,
      message: 'File created successfully',
      filename
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating file' });
  }
});

// Delete file
app.delete('/files/:filename', async (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(UPLOADS_DIR, filename);
    await fs.unlink(filePath);
    
    res.json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    res.status(404).json({ success: false, message: 'File not found' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 File server running on http://localhost:${PORT}`);
});
```

---

## Quick Summary 📚

**What we learned:**
1. ✅ How to install Node.js
2. ✅ How to create a new project
3. ✅ How to set up a server with Express
4. ✅ How to work with routes
5. ✅ How to read and write files with fs
6. ✅ How to build a simple API with JSON files
7. ✅ How to manage files on the server

**Next steps:**
- Practice with the examples
- Try changing the code and see what happens
- Create your own small projects
- Learn about Middleware and Authentication

Good luck! 🎉

---

## FAQ ❓

**Q: Server won't start, what to do?**
A: Check that no other server is running on the same port (3000). Try changing the port.

**Q: How to stop the server?**
A: Press `Ctrl + C` in the terminal.

**Q: What's the difference between fs and fs/promises?**
A: `fs/promises` allows us to use async/await (more convenient and clean).

**Q: Where can I see the created files?**
A: In the same folder where the server is running (or in the folder you defined).

---

## Step 4️⃣ - Install Express (continuation of original guide)

```bash
npm install express
```

**What is Express?** A tool that helps us build a server easily ⚡

---

## Step 5️⃣ - Create the Server

Create a new file called `server.js` and copy this code:

```javascript
import express from 'express';

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('🎉 My server is working!');
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
```

---

## Step 6️⃣ - Run the Server

```bash
node server.js
```

You should see:
```
✅ Server running on http://localhost:3000
```

**Open in browser:** `http://localhost:3000`

**Congratulations! 🎊 Your server is running!**

---

## 💪 Upgrade - Server with Users

Want to add a user list? Update `server.js`:

```javascript
import express from 'express';

const app = express();
const PORT = 3000;

// To receive JSON
app.use(express.json());

// User list
let users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
];

// Home page
app.get('/', (req, res) => {
  res.send('🎉 Welcome to my API!');
});

// Get all users
app.get('/users', (req, res) => {
  res.json(users);
});

// Get specific user
app.get('/users/:id', (req, res) => {
  const user = users.find(u => u.id == req.params.id);
  res.json(user || { error: 'Not found' });
});

// Add new user
app.post('/users', (req, res) => {
  const newUser = {
    id: users.length + 1,
    name: req.body.name
  };
  users.push(newUser);
  res.json(newUser);
});

// Delete user
app.delete('/users/:id', (req, res) => {
  users = users.filter(u => u.id != req.params.id);
  res.json({ message: '✅ Deleted successfully' });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
```

**Run again:**
```bash
node server.js
```

---

## 🧪 Testing

### In Browser:
```
http://localhost:3000/users
```

### In PowerShell:

**Get users:**
```powershell
Invoke-RestMethod http://localhost:3000/users
```

**Add user:**
```powershell
Invoke-RestMethod -Uri http://localhost:3000/users -Method Post -Body '{"name":"Charlie"}' -ContentType "application/json"
```

**Delete user:**
```powershell
Invoke-RestMethod -Uri http://localhost:3000/users/1 -Method Delete
```

---

## 💡 Important Tip

If you change the code and the server doesn't update - stop it (Ctrl+C) and run again.

**Or use auto-reload:**
```bash
node --watch server.js
```

Now every change will restart the server automatically! 🔄

---

## 📝 Quick Summary

**What did we do?**
1. ✅ Installed Node.js
2. ✅ Created a project
3. ✅ Installed Express
4. ✅ Built a working server
5. ✅ Added a user list

**What's next?**
- 🎨 Build a user interface (HTML/React)
- 💾 Connect to a database (MongoDB)
- 🔐 Add authentication

---

## 🆘 Common Issues

### Server not working?
1. Check Node.js is installed: `node --version`
2. Check Express is installed: `npm install`
3. Check the code is correct - any errors?

### Browser shows nothing?
- Make sure the server is running (you'll see a message in terminal)
- Check the address: `http://localhost:3000`

### Changes not working?
- Stop the server (Ctrl+C)
- Run again: `node server.js`

---

## 🎉 Excellent!

**Now you know how to:**
- ✅ Set up a Node.js server
- ✅ Use Express
- ✅ Build a simple API
- ✅ Test the server

**Practice and get better! 💪**

**Good luck! 🚀**
