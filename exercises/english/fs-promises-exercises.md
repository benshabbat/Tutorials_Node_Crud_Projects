# 🎯 Exercises - File System Promises

## 📋 Instructions

1. Create a new folder for each exercise
2. Install Express: `npm install express`
3. Add `"type": "module"` to package.json
4. Write the code yourself before looking at the solution
5. Run and test that everything works

---

## Exercise 1️⃣ - Basic Phone Book

### Task
Create API for managing contacts with the following operations:

```javascript
GET    /contacts         // get all contacts
GET    /contacts/:id     // get specific contact
POST   /contacts         // add new contact
PUT    /contacts/:id     // update contact
DELETE /contacts/:id     // delete contact
```

### Contact Structure
```json
{
  "id": 1,
  "name": "John Doe",
  "phone": "050-1234567",
  "email": "john@example.com",
  "address": "10 Main Street, New York"
}
```

### Requirements
- ✅ Save to `contacts.json` file
- ✅ Validation on phone (must start with 05)
- ✅ Validation on email (must contain @)
- ✅ Don't allow duplicate phone numbers

### Bonus
- Search by name: `GET /contacts?search=john`
- Filter by city in address

---

## Exercise 2️⃣ - Task Management System (To-Do List)

### Task
Create API for managing tasks with status tracking.

### Endpoints
```javascript
GET    /tasks                    // all tasks
GET    /tasks/:id                // specific task
POST   /tasks                    // create task
PUT    /tasks/:id                // update task
DELETE /tasks/:id                // delete task
PATCH  /tasks/:id/complete       // mark as completed
GET    /tasks/stats              // statistics
```

### Task Structure
```json
{
  "id": 1,
  "title": "Finish project",
  "description": "Complete the project by the weekend",
  "status": "pending",  // pending, in-progress, completed
  "priority": "high",   // low, medium, high
  "dueDate": "2025-12-31",
  "createdAt": "2025-12-22T10:00:00.000Z",
  "completedAt": null
}
```

### Requirements
- ✅ Save to `tasks.json` file
- ✅ Filter by status: `GET /tasks?status=pending`
- ✅ Sort by priority
- ✅ When marking complete, add `completedAt`

### Bonus
- Statistics: how many tasks in each status
- Alert for tasks past dueDate
- Export tasks to CSV

---

## Exercise 3️⃣ - Advanced Logging System

### Task
Create system that logs every action on the server.

### What to Log
```javascript
{
  "timestamp": "2025-12-22T10:30:00.000Z",
  "level": "info",  // info, warning, error
  "action": "USER_LOGIN",
  "userId": 123,
  "ip": "192.168.1.1",
  "details": { ... }
}
```

### Endpoints
```javascript
GET  /logs                    // all logs (with pagination)
GET  /logs?level=error        // filter by level
GET  /logs?date=2025-12-22    // logs from specific date
POST /logs/clear              // clear old logs
GET  /logs/stats              // log statistics
```

### Requirements
- ✅ Save to `logs.txt` file (one line per log)
- ✅ Rotation: when file exceeds 1MB, create new file
- ✅ Keep only last 5 log files
- ✅ Middleware that logs every HTTP request

### Bonus
- Read logs efficiently (without loading everything into memory)
- Search in logs
- Export logs to JSON

---

## Exercise 4️⃣ - Automatic Backup System

### Task
Create system that creates automatic backups of data.

### Requirements
- ✅ Create backup every minute
- ✅ Keep only last 10 backups
- ✅ Filename: `users.backup.TIMESTAMP.json`
- ✅ Automatic deletion of old backups

### Endpoints
```javascript
POST   /backup/create         // create manual backup
GET    /backup/list           // list all backups
POST   /backup/restore/:timestamp  // restore from backup
DELETE /backup/:timestamp     // delete specific backup
GET    /backup/stats          // statistics
```

### Bonus
- Compress backups (gzip)
- Smart restore (with user confirmation)
- Differential backup (only changes)

---

## Exercise 5️⃣ - File Upload System

### Task
Create API that allows uploading text files and saving them.

### Endpoints
```javascript
POST   /upload                // upload file
GET    /files                 // list all files
GET    /files/:filename       // download file
DELETE /files/:filename       // delete file
GET    /files/:filename/info  // file info
```

### Requirements
- ✅ Save in `uploads/` folder
- ✅ Support only `.txt` and `.json` files
- ✅ Limit size per file (e.g., 1MB)
- ✅ Automatic rename if file already exists

### File Info
```json
{
  "filename": "document.txt",
  "size": 1024,
  "createdAt": "2025-12-22T10:00:00.000Z",
  "mimeType": "text/plain"
}
```

### Bonus
- Search content in files
- Statistics: number of files, total size
- Multiple file upload

---

## Exercise 6️⃣ - Restaurant Order System

### Task
Create API for managing restaurant orders.

### Order Structure
```json
{
  "id": 1,
  "customerName": "John Doe",
  "items": [
    { "name": "Pizza", "quantity": 2, "price": 50 },
    { "name": "Salad", "quantity": 1, "price": 30 }
  ],
  "totalPrice": 130,
  "status": "pending",  // pending, preparing, ready, delivered
  "orderTime": "2025-12-22T12:00:00.000Z",
  "deliveryAddress": "10 Main Street"
}
```

### Endpoints
```javascript
GET    /orders                    // all orders
GET    /orders/:id                // specific order
POST   /orders                    // create order
PUT    /orders/:id/status         // update status
DELETE /orders/:id                // cancel order
GET    /orders/stats/daily        // daily statistics
```

### Requirements
- ✅ Save to `orders.json` file
- ✅ Automatic total price calculation
- ✅ Filter by status
- ✅ Filter by date

### Bonus
- Daily orders report in TXT
- Statistics: most popular dish
- Alert for old orders (over an hour)

---

## Exercise 7️⃣ - Inventory Management System

### Task
Create API for managing product inventory.

### Product Structure
```json
{
  "id": 1,
  "name": "Laptop",
  "sku": "LAP-001",
  "quantity": 10,
  "minQuantity": 5,  // minimum quantity for warning
  "price": 3500,
  "category": "electronics",
  "supplier": "Tech Corp",
  "lastRestocked": "2025-12-01"
}
```

### Endpoints
```javascript
GET    /inventory                  // all inventory
GET    /inventory/:id              // specific product
POST   /inventory                  // add product
PUT    /inventory/:id              // update product
DELETE /inventory/:id              // delete product
POST   /inventory/:id/restock      // update stock
GET    /inventory/alerts           // low stock products
GET    /inventory/stats            // statistics
```

### Requirements
- ✅ Save to `inventory.json` file
- ✅ Warning when product is below minQuantity
- ✅ Track last update date
- ✅ Search by SKU

### Bonus
- Export inventory report to CSV
- Stock graph over time
- Automatic alerts for low stock products

---

## Exercise 8️⃣ - Integrated Project: Simple CRM System

### Task
Create a complete CRM (Customer Relationship Management) system.

### Data Files
- `customers.json` - customers
- `interactions.json` - customer interactions
- `tasks.json` - tasks
- `logs.txt` - logs

### Customer Structure
```json
{
  "id": 1,
  "name": "ABC Company",
  "contactPerson": "John Doe",
  "email": "john@abc.com",
  "phone": "050-1234567",
  "status": "active",  // active, inactive, lead
  "createdAt": "2025-12-01",
  "lastContact": "2025-12-20"
}
```

### Interaction Structure
```json
{
  "id": 1,
  "customerId": 1,
  "type": "call",  // call, email, meeting
  "notes": "Call about new project",
  "date": "2025-12-22T10:00:00.000Z"
}
```

### Minimum Endpoints
```javascript
// Customers
GET/POST/PUT/DELETE  /customers
GET                  /customers/:id/interactions

// Interactions
GET/POST             /interactions
POST                 /customers/:id/interactions

// Tasks
GET/POST/PUT/DELETE  /tasks

// Reports
GET                  /reports/customers
GET                  /reports/interactions
```

### Requirements
- ✅ All CRUD operations on all entities
- ✅ Links between customers and interactions
- ✅ Reports: active customers, monthly interactions
- ✅ Automatic backup every 10 minutes
- ✅ Complete logging

### Bonus
- Dashboard with statistics
- Export reports to CSV/PDF
- Alerts for urgent tasks
- Advanced search

---

## 💡 Tips for Success

1. **Start small** - Exercise 1 before Exercise 8
2. **Clean code** - Separate functions into files
3. **Error handling** - Always try/catch
4. **Test** - Use Postman or Thunder Client
5. **Documentation** - Write README for each exercise

---

## ✅ Checklist for Each Exercise

- [ ] Code runs without errors
- [ ] Has try/catch in every async function
- [ ] Files are saved correctly (formatted JSON)
- [ ] Has validation on input
- [ ] Has handling for 404 (not found)
- [ ] Has handling for 409 (duplicates)
- [ ] Code is organized and readable
- [ ] Has comments in important places

---

**Good luck! 💪🚀**

After completing these exercises, you'll be an expert in File System Promises!
