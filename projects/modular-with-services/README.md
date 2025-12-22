# 🏗️ Modular CRUD with Service Layer

Professional Node.js CRUD application demonstrating **Service Layer Architecture** - the industry-standard pattern for complex applications.

## 📂 Project Structure

```
modular-with-services/
├── server.js                      # Entry point
├── package.json
├── models/                        # Data Access Layer (DAL)
│   └── productModel.js           # Database/storage operations
├── services/                     # Business Logic Layer (BLL)
│   └── productService.js        # Validation, rules, calculations
├── controllers/                 # Request/Response Layer
│   └── productController.js    # HTTP handling
├── routes/                     # API Routing Layer
│   └── productRoutes.js       # Endpoint definitions
└── middleware/               # Cross-cutting concerns
    └── errorHandler.js      # Error handling, logging, etc.
```

## 🎯 What is a Service Layer?

The **Service Layer** is where ALL business logic lives:
- ✅ Validations
- ✅ Business rules
- ✅ Calculations
- ✅ Complex operations
- ✅ Transactions
- ✅ Error handling

### Why Use Service Layer?

| Without Service Layer | With Service Layer |
|----------------------|-------------------|
| Logic mixed in controllers | Clean separation |
| Hard to test | Easy to test |
| Code duplication | Reusable logic |
| Tight coupling | Loose coupling |
| Difficult maintenance | Easy maintenance |

## 🔄 Request Flow

```
1. Client Request
   ↓
2. Route (productRoutes.js)
   ↓
3. Controller (productController.js)
   ↓
4. Service (productService.js) ← Business Logic Here!
   ↓
5. Model (productModel.js)
   ↓
6. Database/Storage
```

## 🚀 Installation

```bash
cd modular-with-services
npm install
npm start
```

Server runs on: `http://localhost:3002`

## 📚 API Endpoints

### Basic CRUD

#### Get All Products
```http
GET http://localhost:3002/api/products
```

**With Filters:**
```http
GET http://localhost:3002/api/products?category=Electronics
GET http://localhost:3002/api/products?inStock=true
GET http://localhost:3002/api/products?search=laptop
GET http://localhost:3002/api/products?sortBy=price-asc
```

#### Get Single Product
```http
GET http://localhost:3002/api/products/1
```

#### Create Product
```http
POST http://localhost:3002/api/products
Content-Type: application/json

{
  "name": "Keyboard",
  "price": 79.99,
  "stock": 30,
  "category": "Electronics"
}
```

#### Update Product
```http
PUT http://localhost:3002/api/products/1
Content-Type: application/json

{
  "price": 899.99,
  "stock": 15
}
```

#### Delete Product
```http
DELETE http://localhost:3002/api/products/1
```

### Advanced Operations

#### Purchase Product (Reduce Stock)
```http
POST http://localhost:3002/api/products/1/purchase
Content-Type: application/json

{
  "quantity": 2
}
```
**Service logic:**
- Validates stock availability
- Calculates total price
- Updates stock
- Returns low stock warnings

#### Restock Product (Add Stock)
```http
POST http://localhost:3002/api/products/1/restock
Content-Type: application/json

{
  "quantity": 20
}
```
**Service logic:**
- Validates quantity
- Checks maximum stock limit (10,000)
- Updates stock

#### Get Statistics
```http
GET http://localhost:3002/api/products/stats
```
**Returns:**
- Total products
- In stock / out of stock counts
- Low stock warnings
- Total inventory value
- Average price
- Category breakdown

#### Search Products
```http
GET http://localhost:3002/api/products/search?q=laptop
```

#### Get by Category
```http
GET http://localhost:3002/api/products/category/Electronics
```

## 🧪 Testing Examples

### Get all products:
```bash
curl http://localhost:3002/api/products
```

### Get products with filters:
```bash
curl "http://localhost:3002/api/products?category=Electronics&inStock=true&sortBy=price-asc"
```

### Create product:
```bash
curl -X POST http://localhost:3002/api/products -H "Content-Type: application/json" -d "{\"name\":\"Headphones\",\"price\":59.99,\"stock\":25,\"category\":\"Electronics\"}"
```

### Purchase product:
```bash
curl -X POST http://localhost:3002/api/products/1/purchase -H "Content-Type: application/json" -d "{\"quantity\":3}"
```

### Restock product:
```bash
curl -X POST http://localhost:3002/api/products/1/restock -H "Content-Type: application/json" -d "{\"quantity\":50}"
```

### Get statistics:
```bash
curl http://localhost:3002/api/products/stats
```

### Search:
```bash
curl "http://localhost:3002/api/products/search?q=laptop"
```

## 🔍 Layer Responsibilities

### 1️⃣ Model Layer (models/productModel.js)
**Responsibility:** ONLY data access
```javascript
export const findAll = () => products;
export const findById = (id) => products.find(p => p.id === id);
export const create = (data) => { /* insert */ };
```
- ❌ NO validation
- ❌ NO business rules
- ✅ Pure data operations
- ✅ Database queries

### 2️⃣ Service Layer (services/productService.js)
**Responsibility:** ALL business logic
```javascript
export const createProduct = (data) => {
  // ✅ Validate input
  if (!name || price <= 0) throw new BusinessError('...');
  
  // ✅ Check business rules
  if (ProductModel.nameExists(name)) throw new BusinessError('...');
  
  // ✅ Apply constraints
  if (price > 99999.99) throw new BusinessError('...');
  
  // ✅ Call model
  return ProductModel.create(data);
};
```
- ✅ Validations
- ✅ Business rules
- ✅ Calculations
- ✅ Complex operations
- ✅ Error handling

### 3️⃣ Controller Layer (controllers/productController.js)
**Responsibility:** HTTP request/response ONLY
```javascript
export const createProduct = async (req, res, next) => {
  try {
    // Just pass to service
    const result = ProductService.createProduct(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error); // Pass to error handler
  }
};
```
- ✅ Extract request data
- ✅ Call service
- ✅ Format response
- ❌ NO business logic

### 4️⃣ Routes Layer (routes/productRoutes.js)
**Responsibility:** Define endpoints
```javascript
router.post('/', productController.createProduct);
router.get('/:id', productController.getProduct);
```
- ✅ URL mapping
- ✅ HTTP methods
- ❌ NO logic

## 💡 Key Concepts

### Business Logic in Service
```javascript
// ❌ WRONG: Logic in controller
export const purchaseProduct = (req, res) => {
  const product = ProductModel.findById(req.params.id);
  if (product.stock < req.body.quantity) {
    return res.status(400).json({ error: 'Not enough stock' });
  }
  // More logic...
};

// ✅ CORRECT: Logic in service
export const purchaseProduct = (id, quantity) => {
  const product = ProductModel.findById(id);
  
  if (!product) throw new BusinessError('Product not found', 404);
  if (product.stock < quantity) {
    throw new BusinessError(
      `Insufficient stock. Available: ${product.stock}`
    );
  }
  
  const totalPrice = product.price * quantity;
  // More business logic...
  
  return { product, quantity, totalPrice };
};
```

### Custom Error Classes
```javascript
export class BusinessError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Usage in service
if (!product) {
  throw new BusinessError('Product not found', 404);
}
```

### Separation Example

**Model (Data):**
```javascript
export const updateStock = (id, newStock) => {
  product.stock = newStock;
  return product;
};
```

**Service (Business Logic):**
```javascript
export const purchaseProduct = (id, quantity) => {
  // ✅ Validate
  if (quantity <= 0) throw new BusinessError('Invalid quantity');
  
  // ✅ Check availability
  const product = ProductModel.findById(id);
  if (product.stock < quantity) throw new BusinessError('Insufficient stock');
  
  // ✅ Calculate
  const totalPrice = product.price * quantity;
  const newStock = product.stock - quantity;
  
  // ✅ Update via model
  ProductModel.updateStock(id, newStock);
  
  return { product, quantity, totalPrice };
};
```

**Controller (HTTP):**
```javascript
export const purchaseProduct = async (req, res, next) => {
  try {
    const result = ProductService.purchaseProduct(
      req.params.id,
      req.body.quantity
    );
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};
```

## 🎓 Benefits of Service Layer

### 1. **Testability**
```javascript
// Easy to test - no HTTP dependencies
describe('ProductService', () => {
  it('should throw error for invalid price', () => {
    expect(() => 
      ProductService.createProduct({ name: 'Test', price: -10 })
    ).toThrow('Price must be greater than 0');
  });
});
```

### 2. **Reusability**
```javascript
// Same service used by:
// - REST API controllers
// - GraphQL resolvers
// - CLI commands
// - Background jobs
ProductService.purchaseProduct(productId, quantity);
```

### 3. **Maintainability**
- Change business rule? → Edit service only
- Add validation? → Service only
- Change database? → Model only
- Change API format? → Controller only

### 4. **Team Collaboration**
- Backend dev: Models & Services
- API dev: Controllers & Routes
- Frontend dev: Just consumes API
- No conflicts!

## 🌟 Advanced Features

### Middleware Pipeline
```javascript
app.use(express.json());      // Parse JSON
app.use(corsMiddleware);      // CORS
app.use(requestLogger);       // Logging
app.use(requestTimer);        // Performance
app.use(rateLimiter);         // Rate limiting
app.use(sanitizeInput);       // Security
```

### Business Rules Examples

**Price Validation:**
- Must be positive
- Cannot exceed $99,999.99

**Stock Management:**
- Cannot be negative
- Maximum 10,000 units
- Low stock warning at ≤5
- Out of stock alerts

**Product Names:**
- 3-100 characters
- Must be unique
- Case-insensitive

**Purchase Logic:**
- Check availability
- Calculate total
- Update stock
- Return warnings

## 🆚 Architecture Comparison

| Feature | Simple | Modular | With Services |
|---------|--------|---------|---------------|
| Files | 1 | 6-8 | 8-10 |
| Layers | None | 3 | 4 |
| Business Logic | Mixed | In Controller | In Service ✅ |
| Testability | Hard | Medium | Easy ✅ |
| Reusability | No | Medium | High ✅ |
| Maintainability | Low | Medium | High ✅ |
| Scalability | Low | Good | Excellent ✅ |
| Production Ready | ❌ | ⚠️ | ✅ |

## 🔄 Next Steps

1. **Add Database** - Replace in-memory with real DB
2. **Add Authentication** - JWT tokens in middleware
3. **Add More Services** - User service, order service
4. **Add Unit Tests** - Test services independently
5. **Add Logging** - Winston or Pino
6. **Add Validation Library** - Joi or Zod
7. **Add API Documentation** - Swagger
8. **Add Caching** - Redis

## 📖 Learning Path

1. **Start with:** `server.js` (simple version)
2. **Move to:** `modular-crud` (separation of concerns)
3. **Master:** `modular-with-services` (production pattern) ← You are here!
4. **Next:** Add database + authentication + tests

---

**This is the professional way to structure Node.js applications!** 🚀
