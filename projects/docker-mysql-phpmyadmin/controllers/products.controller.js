import { pool } from '../models/db.js';

// קבלת כל המוצרים
export const getAllProducts = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM products');
        res.json({
            success: true,
            data: rows,
            count: rows.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'שגיאה בקבלת מוצרים',
            error: error.message
        });
    }
};

// קבלת מוצר לפי ID
export const getProductById = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
        
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'מוצר לא נמצא'
            });
        }
        
        res.json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'שגיאה בקבלת מוצר',
            error: error.message
        });
    }
};

// יצירת מוצר חדש
export const createProduct = async (req, res) => {
    try {
        const { name, description, price, stock } = req.body;
        
        if (!name || !price) {
            return res.status(400).json({
                success: false,
                message: 'שם ומחיר הם שדות חובה'
            });
        }
        
        const [result] = await pool.query(
            'INSERT INTO products (name, description, price, stock) VALUES (?, ?, ?, ?)',
            [name, description || null, price, stock || 0]
        );
        
        res.status(201).json({
            success: true,
            message: 'מוצר נוצר בהצלחה',
            data: {
                id: result.insertId,
                name,
                description,
                price,
                stock
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'שגיאה ביצירת מוצר',
            error: error.message
        });
    }
};

// עדכון מוצר
export const updateProduct = async (req, res) => {
    try {
        const { name, description, price, stock } = req.body;
        const { id } = req.params;
        
        const [result] = await pool.query(
            'UPDATE products SET name = COALESCE(?, name), description = COALESCE(?, description), price = COALESCE(?, price), stock = COALESCE(?, stock) WHERE id = ?',
            [name, description, price, stock, id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'מוצר לא נמצא'
            });
        }
        
        res.json({
            success: true,
            message: 'מוצר עודכן בהצלחה'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'שגיאה בעדכון מוצר',
            error: error.message
        });
    }
};

// מחיקת מוצר
export const deleteProduct = async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM products WHERE id = ?', [req.params.id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'מוצר לא נמצא'
            });
        }
        
        res.json({
            success: true,
            message: 'מוצר נמחק בהצלחה'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'שגיאה במחיקת מוצר',
            error: error.message
        });
    }
};
