// Database Configuration and Connection Pool
// קובץ ניהול החיבור למסד הנתונים

import mysql from 'mysql2/promise';
import 'dotenv/config';

// יצירת Connection Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// בדיקת חיבור
pool.getConnection()
  .then(connection => {
    console.log('✅ חיבור למסד נתונים הצליח!');
    connection.release();
  })
  .catch(err => {
    console.error('❌ שגיאה בחיבור למסד נתונים:', err.message);
    console.log('💡 וודא ש-MySQL רץ ושהגדרות החיבור ב-.env נכונות');
  });

// יצירת טבלאות
async function setupDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        age INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ הטבלה users מוכנה');
  } catch (err) {
    console.error('❌ שגיאה ביצירת טבלה:', err.message);
  }
}

// הפעלת הגדרת מסד הנתונים
setupDatabase();

export default pool;
