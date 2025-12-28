import { pool } from '../models/db.js';

// קבלת כל המשתמשים
export const getAllUsers = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM users');
        res.json({
            success: true,
            data: rows,
            count: rows.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'שגיאה בקבלת משתמשים',
            error: error.message
        });
    }
};

// קבלת משתמש לפי ID
export const getUserById = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [req.params.id]);
        
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'משתמש לא נמצא'
            });
        }
        
        res.json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'שגיאה בקבלת משתמש',
            error: error.message
        });
    }
};

// יצירת משתמש חדש
export const createUser = async (req, res) => {
    try {
        const { name, email, age } = req.body;
        
        if (!name || !email) {
            return res.status(400).json({
                success: false,
                message: 'שם ואימייל הם שדות חובה'
            });
        }
        
        const [result] = await pool.query(
            'INSERT INTO users (name, email, age) VALUES (?, ?, ?)',
            [name, email, age || null]
        );
        
        res.status(201).json({
            success: true,
            message: 'משתמש נוצר בהצלחה',
            data: {
                id: result.insertId,
                name,
                email,
                age
            }
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({
                success: false,
                message: 'האימייל כבר קיים במערכת'
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'שגיאה ביצירת משתמש',
            error: error.message
        });
    }
};

// עדכון משתמש
export const updateUser = async (req, res) => {
    try {
        const { name, email, age } = req.body;
        const { id } = req.params;
        
        const [result] = await pool.query(
            'UPDATE users SET name = COALESCE(?, name), email = COALESCE(?, email), age = COALESCE(?, age) WHERE id = ?',
            [name, email, age, id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'משתמש לא נמצא'
            });
        }
        
        res.json({
            success: true,
            message: 'משתמש עודכן בהצלחה'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'שגיאה בעדכון משתמש',
            error: error.message
        });
    }
};

// מחיקת משתמש
export const deleteUser = async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'משתמש לא נמצא'
            });
        }
        
        res.json({
            success: true,
            message: 'משתמש נמחק בהצלחה'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'שגיאה במחיקת משתמש',
            error: error.message
        });
    }
};
