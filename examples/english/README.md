# 💻 Code Examples

## English

### [basic-server.js](basic-server.js)
Simple Express server:
- Basic setup
- Simple endpoints
- Perfect first example

---

### [simple-fs-server.js](simple-fs-server.js)
Server with file system:
- Reading files
- Writing files
- Basic file operations

---

### [params-examples.js](params-examples.js)
Practical examples for all Parameter types:
- Route Parameters - `/users/:id`
- Query Parameters - `?age=25&city=NewYork`
- Body Parameters - POST/PUT with JSON
- Headers - Authorization, Content-Type
- Filtering, sorting, pagination
- Full validation
- 15+ ready-to-use endpoints

---

### [fs-promises-example.js](fs-promises-example.js)
Complete CRUD with file storage:
- Full CRUD operations
- fs/promises usage
- Backup system
- Logging
- Statistics

---

### [middleware-examples.js](middleware-examples.js)
Comprehensive Middleware examples:
- Logger - request logging
- Request Timer - timing measurements
- Authentication - API Key authentication
- Role-based Authorization - permissions
- Rate Limiter - rate limiting (20/minute)
- Validation - data validation
- File Logger - saving to file
- Error Handler - error handling

**How to run:**
```bash
node middleware-examples.js
# Now open: http://localhost:3000
```

**Example API Keys:**
```
key-123 → User
key-456 → Admin
key-789 → Moderator
```

**Endpoints:**
```
GET    /              # API info
GET    /profile       # Requires API Key
POST   /users         # Requires API Key + Validation
DELETE /users/:id     # Admin only
GET    /stats         # Admin/Moderator
```

**How to run:**
```bash
node params-examples.js
# Now open: http://localhost:3000
```

**Example Endpoints:**
```
GET  /                             # List all endpoints
GET  /users/:id                    # Get user by ID
GET  /users?age=25&city=NewYork    # Filter users
GET  /products?category=electronics # Filter products
POST /users                        # Create user
PUT  /users/:id                    # Update user
```

---

## How to Start?

1. **Install dependencies** (if not yet):
   ```bash
   npm install
   ```

2. **Run example**:
   ```bash
   node params-examples.js
   ```

3. **Test in browser**:
   - Open: `http://localhost:3000`
   - For POST/PUT use Postman or Thunder Client

4. **Experiment**:
   - Modify the code
   - Add new endpoints
   - Try different values

---

## Tips

💡 **Browser** - Good for GET requests  
💡 **Postman** - Great for testing POST/PUT/DELETE  
💡 **Thunder Client** - VS Code extension for API testing  
💡 **Console.log** - Print variables to understand what's happening

---

**Good Luck! 🚀**
