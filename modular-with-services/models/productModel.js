// Product Model - Data Access Layer (DAL)
// ONLY handles database/storage operations
// NO business logic here!

let products = [
  { 
    id: 1, 
    name: 'Laptop', 
    price: 999.99, 
    stock: 10, 
    category: 'Electronics',
    createdAt: new Date('2024-01-01')
  },
  { 
    id: 2, 
    name: 'Mouse', 
    price: 29.99, 
    stock: 50, 
    category: 'Electronics',
    createdAt: new Date('2024-01-02')
  },
  { 
    id: 3, 
    name: 'Desk Chair', 
    price: 199.99, 
    stock: 5, 
    category: 'Furniture',
    createdAt: new Date('2024-01-03')
  },
  { 
    id: 4, 
    name: 'Monitor', 
    price: 349.99, 
    stock: 0, 
    category: 'Electronics',
    createdAt: new Date('2024-01-04')
  }
];

let nextId = 5;

// Get all products
export const findAll = () => {
  return products;
};

// Get product by ID
export const findById = (id) => {
  return products.find(p => p.id === parseInt(id));
};

// Find products by category
export const findByCategory = (category) => {
  return products.filter(p => 
    p.category.toLowerCase() === category.toLowerCase()
  );
};

// Find products by name (partial match)
export const findByName = (searchTerm) => {
  return products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
};

// Find products in stock
export const findInStock = () => {
  return products.filter(p => p.stock > 0);
};

// Find out of stock products
export const findOutOfStock = () => {
  return products.filter(p => p.stock === 0);
};

// Create new product
export const create = (productData) => {
  const newProduct = {
    id: nextId++,
    ...productData,
    createdAt: new Date()
  };
  
  products.push(newProduct);
  return newProduct;
};

// Update product
export const update = (id, productData) => {
  const index = products.findIndex(p => p.id === parseInt(id));
  
  if (index === -1) {
    return null;
  }
  
  products[index] = {
    ...products[index],
    ...productData,
    id: products[index].id, // Prevent ID change
    createdAt: products[index].createdAt // Preserve creation date
  };
  
  return products[index];
};

// Delete product
export const remove = (id) => {
  const index = products.findIndex(p => p.id === parseInt(id));
  
  if (index === -1) {
    return null;
  }
  
  const deleted = products[index];
  products.splice(index, 1);
  return deleted;
};

// Update stock (for inventory management)
export const updateStock = (id, quantity) => {
  const product = findById(id);
  
  if (!product) {
    return null;
  }
  
  product.stock = quantity;
  return product;
};

// Check if product name exists
export const nameExists = (name, excludeId = null) => {
  return products.some(p => 
    p.name.toLowerCase() === name.toLowerCase() && 
    p.id !== parseInt(excludeId)
  );
};

// Get count
export const count = () => {
  return products.length;
};

// Get categories (unique)
export const getCategories = () => {
  return [...new Set(products.map(p => p.category))];
};
