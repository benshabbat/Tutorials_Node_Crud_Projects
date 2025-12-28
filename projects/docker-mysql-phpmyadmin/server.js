import express from 'express';
import cors from 'cors';
import { config } from './config/config.js';
import usersRoutes from './routes/users.routes.js';
import productsRoutes from './routes/products.routes.js';

const app = express();
const PORT = config.port;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes

// Home page
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Node.js + JSON Data Store + Docker!',
        endpoints: {
            users: {
                getAll: 'GET /api/users',
                getById: 'GET /api/users/:id',
                create: 'POST /api/users',
                update: 'PUT /api/users/:id',
                delete: 'DELETE /api/users/:id'
            },
            products: {
                getAll: 'GET /api/products',
                getById: 'GET /api/products/:id',
                create: 'POST /api/products',
                update: 'PUT /api/products/:id',
                delete: 'DELETE /api/products/:id'
            }
        },
        dataStorage: 'JSON Files',
        phpmyadmin: 'http://localhost:8080 (MySQL available if needed)'
    });
});

// API Routes
app.use('/api/users', usersRoutes);
app.use('/api/products', productsRoutes);

// Route not found
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: err.message
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 phpMyAdmin: http://localhost:8080`);
    console.log(`💾 Data Storage: JSON Files`);
});
