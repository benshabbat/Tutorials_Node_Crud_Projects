import mysql from 'mysql2/promise';
import { config } from '../config/config.js';

// יצירת Connection Pool
export const pool = mysql.createPool(config.db);

// בדיקת חיבור
export const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ התחברות מוצלחת ל-MySQL');
        connection.release();
        return true;
    } catch (error) {
        console.error('❌ שגיאה בהתחברות ל-MySQL:', error.message);
        return false;
    }
};
