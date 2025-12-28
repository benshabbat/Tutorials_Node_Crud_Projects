# Node.js + Docker + JSON Data Store + MySQL + phpMyAdmin

Full project with Express.js, JSON data storage, MySQL and phpMyAdmin running on Docker.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running](#running)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Troubleshooting](#troubleshooting)

## 🔧 Prerequisites

Before starting, ensure you have installed:

- [Node.js](https://nodejs.org/) (version 14+)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

## 📦 Installation

1. **Install Node.js dependencies:**
```bash
npm install
```

2. **Environment variables:**
   - The `.env` file already exists with default settings
   - You can edit it according to your needs

## 🚀 Running

### Start Docker Containers (Optional)

```bash
# Start MySQL and phpMyAdmin
npm run docker:up

# Or directly with docker-compose
docker-compose up -d
```

This will start:
- **MySQL Server** on port `3306`
- **phpMyAdmin** on `http://localhost:8080`

> **Note:** Docker/MySQL is optional. The project uses JSON files for data storage by default.

### Start Node.js Server

```bash
# Normal run
npm start

# Or in development mode (with nodemon)
npm run dev
```

Server will start on `http://localhost:3000`

## 🎯 Usage

### Access phpMyAdmin (if using MySQL)

1. Open browser and go to: `http://localhost:8080`
2. Login with:
   - **Server:** `mysql`
   - **Username:** `root`
   - **Password:** `root123` (or as defined in .env)

### Access API

The server provides a complete API for two resources:

#### Home Page
```
GET http://localhost:3000/
```

## 📚 API Endpoints

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Get all users |
| GET | `/api/users/:id` | Get user by ID |
| POST | `/api/users` | Create new user |
| PUT | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Delete user |

**Example - Create user:**
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Danny Shemesh",
    "email": "danny@example.com",
    "age": 30
  }'
```

### Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products |
| GET | `/api/products/:id` | Get product by ID |
| POST | `/api/products` | Create new product |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |

**Example - Create product:**
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Smartphone",
    "description": "Smartphone with AMOLED screen",
    "price": 2500.00,
    "stock": 15
  }'
```

## 🐳 Useful Docker Commands

```bash
# Stop containers
npm run docker:down

# View logs
npm run docker:logs

# Restart containers
npm run docker:restart

# Remove everything including volumes (data)
docker-compose down -v
```

## 🗃️ Data Structure

The project uses JSON files for data storage with sample data:

### Users JSON Structure
```json
{
  "id": 1,
  "name": "Alice Cohen",
  "email": "alice@example.com",
  "age": 28,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

### Products JSON Structure
```json
{
  "id": 1,
  "name": "Laptop",
  "description": "15 inch laptop with SSD",
  "price": 3500.00,
  "stock": 10,
  "createdAt": "2024-01-15T08:00:00Z"
}
```

## 🔍 Troubleshooting

### Issue: MySQL not starting
```bash
# Check container status
docker ps -a

# View MySQL logs
docker logs mysql_db
```

### Issue: Ports already in use
Change ports in `docker-compose.yml`:
```yaml
ports:
  - "3307:3306"  # Instead of 3306
```

### Issue: Connection error from Node.js
Make sure:
1. Docker containers are running (if using MySQL)
2. Environment variables in `.env` match `docker-compose.yml`
3. Wait a few seconds after Docker startup for MySQL to be ready

## 📝 Important Notes

- **Data is stored** in JSON files in the `data/` directory
- **Sample data** is included in `users.json` and `products.json`
- **MySQL is optional** - the project works with JSON files by default
- **Data persists** between server restarts

## 🌟 Features

✅ Docker Compose ready to use  
✅ MySQL 8.0 with optimal settings  
✅ phpMyAdmin for visual management  
✅ Full REST API with CRUD  
✅ JSON file-based data storage  
✅ ES6 Modules  
✅ Modular code structure  
✅ Sample data included  

## 📄 License

ISC
