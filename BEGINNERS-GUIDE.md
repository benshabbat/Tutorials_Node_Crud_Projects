# 🎯 Beginner's Guide - Node.js Step by Step

## Step 1️⃣ - Installation

1. **Download Node.js** from [nodejs.org](https://nodejs.org)
2. **Install** (click Next until finished)
3. **Check** - Open Terminal:
   ```bash
   node --version
   ```
   See a number? Great! ✅

---

## Step 2️⃣ - Create a Project

Open Terminal and copy these commands:

```bash
mkdir my-server
cd my-server
npm init -y
```

Now you have a new folder with a `package.json` file 📦

---

## Step 3️⃣ - Configure the Project

Open the `package.json` file and add the line `"type": "module"`:

```json
{
  "name": "my-server",
  "version": "1.0.0",
  "type": "module",
  "main": "index.js",
  "scripts": {
    "start": "node server.js",
    "dev": "node --watch server.js"
  }
}
```

**Why?** To use `import` (modern syntax) 🚀

---

## Step 4️⃣ - Install Express

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
