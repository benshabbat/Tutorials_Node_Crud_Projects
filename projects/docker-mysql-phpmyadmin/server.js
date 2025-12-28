import express from 'express';
import cors from 'cors';
import { config } from './config/config.js';
import { testConnection } from './models/db.js';
import usersRoutes from './routes/users.routes.js';
import productsRoutes from './routes/products.routes.js';

const app = express();
const PORT = config.port;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes

// דף בית
app.get('/', (req, res) => {
    res.json({
        message: 'ברוכים הבאים לשרת Node.js + MySQL + Docker!',
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
        phpmyadmin: 'http://localhost:8080'
    });
});

// API Routes
app.use('/api/users', usersRoutes);
app.use('/api/products', productsRoutes);

// Route לא קיים
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'נתיב לא נמצא'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'שגיאת שרת פנימית',
        error: err.message
    });
});

// הפעלת השרת
app.listen(PORT, async () => {
    console.log(`🚀 השרת רץ על http://localhost:${PORT}`);
    console.log(`📊 phpMyAdmin: http://localhost:8080`);
    await testConnection();
});
