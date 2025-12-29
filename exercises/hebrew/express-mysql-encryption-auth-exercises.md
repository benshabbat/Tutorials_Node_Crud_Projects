# תרגילים: Express + MySQL + הצפנת הודעות + Basic Auth

## תיאור כללי
בתרגילים אלה תבנה שרת Express שמאחסן הודעות מוצפנות במסד נתונים MySQL, מאפשר למשתמשים להצפין ולפענח הודעות באמצעות צפנים פשוטים, ומשתמש ב-HTTP Basic Authentication.

## דרישות מקדימות
- Node.js מותקן
- MySQL מותקן (או Docker עם MySQL)
- הבנה בסיסית של Express ו-MySQL
- הבנה בסיסית של HTTP Headers

## תרגיל 1: הקמת פרויקט בסיסי ומסד נתונים

### שלב 1.1: יצירת פרויקט
צור תיקייה חדשה ואתחל פרויקט Node.js:

```bash
mkdir encrypted-messages-app
cd encrypted-messages-app
npm init -y
```

### שלב 1.2: התקנת חבילות
התקן את החבילות הדרושות:

```bash
npm install express mysql2 dotenv
```

### שלב 1.3: יצירת מבנה תיקיות
צור את המבנה הבא:

```
encrypted-messages-app/
├── server.js
├── .env
├── config/
│   └── db.js
├── controllers/
│   ├── authController.js
│   └── messagesController.js
├── middleware/
│   └── authMiddleware.js
├── routes/
│   └── messagesRoutes.js
├── utils/
│   └── cipher.js
└── sql/
    └── init.sql
```

### שלב 1.4: יצירת מסד נתונים
צור קובץ `sql/init.sql`:

```sql
-- יצירת מסד נתונים
CREATE DATABASE IF NOT EXISTS encrypted_messages_db;
USE encrypted_messages_db;

-- טבלת משתמשים
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- טבלת הודעות מוצפנות
CREATE TABLE IF NOT EXISTS messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    encrypted_content TEXT NOT NULL,
    cipher_type ENUM('caesar', 'reverse', 'atbash', 'substitution') NOT NULL,
    cipher_key VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- הכנסת נתוני דמו
INSERT INTO users (username, password) VALUES
('alice', 'password123'),
('bob', 'secret456'),
('charlie', 'mypass789');

INSERT INTO messages (user_id, title, encrypted_content, cipher_type, cipher_key) VALUES
(1, 'הודעה ראשונה', 'Khoor Zruog', 'caesar', '3'),
(1, 'הודעה שנייה', 'dlroW olleH', 'reverse', NULL),
(2, 'הודעה סודית', 'Svool Dliow', 'caesar', '7');
```

הרץ את הסקריפט:
```bash
mysql -u root -p < sql/init.sql
```

או אם אתה משתמש ב-Docker:
```bash
docker exec -i mysql-container mysql -uroot -proot < sql/init.sql
```

---

## תרגיל 2: הגדרת חיבור למסד נתונים

### שלב 2.1: קובץ סביבה
צור קובץ `.env`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=encrypted_messages_db
PORT=3000
```

### שלב 2.2: חיבור למסד נתונים
צור קובץ `config/db.js`:

```javascript
const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const promisePool = pool.promise();

module.exports = promisePool;
```

---

## תרגיל 3: יישום צפנים (Ciphers)

### שלב 3.1: יצירת פונקציות הצפנה
צור קובץ `utils/cipher.js`:

```javascript
// Caesar Cipher - הזזת אותיות
function caesarEncrypt(text, shift) {
    return text.split('').map(char => {
        if (char.match(/[a-z]/i)) {
            const code = char.charCodeAt(0);
            const isUpperCase = code >= 65 && code <= 90;
            const base = isUpperCase ? 65 : 97;
            return String.fromCharCode(((code - base + shift) % 26) + base);
        }
        return char;
    }).join('');
}

function caesarDecrypt(text, shift) {
    return caesarEncrypt(text, 26 - shift);
}

// Reverse Cipher - היפוך טקסט
function reverseEncrypt(text) {
    return text.split('').reverse().join('');
}

function reverseDecrypt(text) {
    return reverseEncrypt(text); // היפוך הוא סימטרי
}

// Atbash Cipher - A=Z, B=Y, וכו'
function atbashEncrypt(text) {
    return text.split('').map(char => {
        if (char.match(/[a-z]/i)) {
            const code = char.charCodeAt(0);
            const isUpperCase = code >= 65 && code <= 90;
            const base = isUpperCase ? 65 : 97;
            return String.fromCharCode(base + (25 - (code - base)));
        }
        return char;
    }).join('');
}

function atbashDecrypt(text) {
    return atbashEncrypt(text); // אטבש הוא סימטרי
}

// Substitution Cipher - החלפת אותיות לפי מפתח
function substitutionEncrypt(text, key) {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    if (!key || key.length !== 26) {
        throw new Error('מפתח חייב להיות בעל 26 תווים');
    }
    
    return text.split('').map(char => {
        if (char.match(/[a-z]/i)) {
            const isUpperCase = char === char.toUpperCase();
            const lowerChar = char.toLowerCase();
            const index = alphabet.indexOf(lowerChar);
            const newChar = key[index];
            return isUpperCase ? newChar.toUpperCase() : newChar;
        }
        return char;
    }).join('');
}

function substitutionDecrypt(text, key) {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    if (!key || key.length !== 26) {
        throw new Error('מפתח חייב להיות בעל 26 תווים');
    }
    
    // יצירת מפתח הפוך
    const reverseKey = alphabet.split('').map(char => {
        const index = key.indexOf(char);
        return alphabet[index];
    }).join('');
    
    return substitutionEncrypt(text, reverseKey);
}

// פונקציית עזר - הצפנה לפי סוג
function encrypt(text, cipherType, key) {
    switch(cipherType) {
        case 'caesar':
            return caesarEncrypt(text, parseInt(key) || 3);
        case 'reverse':
            return reverseEncrypt(text);
        case 'atbash':
            return atbashEncrypt(text);
        case 'substitution':
            return substitutionEncrypt(text, key);
        default:
            throw new Error('סוג צופן לא נתמך');
    }
}

// פונקציית עזר - פענוח לפי סוג
function decrypt(text, cipherType, key) {
    switch(cipherType) {
        case 'caesar':
            return caesarDecrypt(text, parseInt(key) || 3);
        case 'reverse':
            return reverseDecrypt(text);
        case 'atbash':
            return atbashDecrypt(text);
        case 'substitution':
            return substitutionDecrypt(text, key);
        default:
            throw new Error('סוג צופן לא נתמך');
    }
}

module.exports = {
    caesarEncrypt,
    caesarDecrypt,
    reverseEncrypt,
    reverseDecrypt,
    atbashEncrypt,
    atbashDecrypt,
    substitutionEncrypt,
    substitutionDecrypt,
    encrypt,
    decrypt
};
```

### שלב 3.2: בדיקת הצפנים
צור קובץ `test-ciphers.js` לבדיקה:

```javascript
const cipher = require('./utils/cipher');

console.log('=== Caesar Cipher ===');
const caesar = cipher.caesarEncrypt('Hello World', 3);
console.log('מוצפן:', caesar); // Khoor Zruog
console.log('מפוענח:', cipher.caesarDecrypt(caesar, 3)); // Hello World

console.log('\n=== Reverse Cipher ===');
const reverse = cipher.reverseEncrypt('Hello World');
console.log('מוצפן:', reverse); // dlroW olleH
console.log('מפוענח:', cipher.reverseDecrypt(reverse)); // Hello World

console.log('\n=== Atbash Cipher ===');
const atbash = cipher.atbashEncrypt('Hello World');
console.log('מוצפן:', atbash); // Svool Dliow
console.log('מפוענח:', cipher.atbashDecrypt(atbash)); // Hello World

console.log('\n=== Substitution Cipher ===');
const key = 'qwertyuiopasdfghjklzxcvbnm';
const substitution = cipher.substitutionEncrypt('Hello World', key);
console.log('מוצפן:', substitution);
console.log('מפוענח:', cipher.substitutionDecrypt(substitution, key)); // Hello World
```

הרץ:
```bash
node test-ciphers.js
```

---

## תרגיל 4: Authentication Middleware

### שלב 4.1: יצירת Middleware לאימות
צור קובץ `middleware/authMiddleware.js`:

```javascript
const db = require('../config/db');

// פענוח HTTP Basic Auth Header
function parseBasicAuth(authHeader) {
    if (!authHeader || !authHeader.startsWith('Basic ')) {
        return null;
    }
    
    // הסרת "Basic " והמרה מ-Base64
    const base64Credentials = authHeader.slice(6);
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    const [username, password] = credentials.split(':');
    
    return { username, password };
}

// Middleware לאימות משתמש
async function authenticateUser(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            return res.status(401).json({
                error: 'נדרש אימות',
                message: 'יש לשלוח Authorization header'
            });
        }
        
        const credentials = parseBasicAuth(authHeader);
        
        if (!credentials) {
            return res.status(401).json({
                error: 'פורמט אימות שגוי',
                message: 'יש להשתמש ב-Basic Authentication'
            });
        }
        
        const { username, password } = credentials;
        
        // בדיקת משתמש במסד נתונים
        const [users] = await db.query(
            'SELECT * FROM users WHERE username = ? AND password = ?',
            [username, password]
        );
        
        if (users.length === 0) {
            return res.status(401).json({
                error: 'אימות נכשל',
                message: 'שם משתמש או סיסמה שגויים'
            });
        }
        
        // שמירת נתוני המשתמש ב-request
        req.user = {
            id: users[0].id,
            username: users[0].username
        };
        
        next();
    } catch (error) {
        console.error('שגיאה באימות:', error);
        res.status(500).json({ error: 'שגיאת שרת באימות' });
    }
}

module.exports = { authenticateUser, parseBasicAuth };
```

---

## תרגיל 5: Controllers להודעות

### שלב 5.1: יצירת Messages Controller
צור קובץ `controllers/messagesController.js`:

```javascript
const db = require('../config/db');
const { encrypt, decrypt } = require('../utils/cipher');

// קבלת כל ההודעות של המשתמש
async function getAllMessages(req, res) {
    try {
        const userId = req.user.id;
        
        const [messages] = await db.query(
            `SELECT id, title, encrypted_content, cipher_type, cipher_key, created_at 
             FROM messages 
             WHERE user_id = ? 
             ORDER BY created_at DESC`,
            [userId]
        );
        
        res.json({
            success: true,
            count: messages.length,
            messages
        });
    } catch (error) {
        console.error('שגיאה בקבלת הודעות:', error);
        res.status(500).json({ error: 'שגיאה בקבלת הודעות' });
    }
}

// קבלת הודעה ספציפית
async function getMessage(req, res) {
    try {
        const userId = req.user.id;
        const messageId = req.params.id;
        
        const [messages] = await db.query(
            `SELECT id, title, encrypted_content, cipher_type, cipher_key, created_at 
             FROM messages 
             WHERE id = ? AND user_id = ?`,
            [messageId, userId]
        );
        
        if (messages.length === 0) {
            return res.status(404).json({ error: 'הודעה לא נמצאה' });
        }
        
        res.json({
            success: true,
            message: messages[0]
        });
    } catch (error) {
        console.error('שגיאה בקבלת הודעה:', error);
        res.status(500).json({ error: 'שגיאה בקבלת הודעה' });
    }
}

// פענוח הודעה
async function decryptMessage(req, res) {
    try {
        const userId = req.user.id;
        const messageId = req.params.id;
        
        const [messages] = await db.query(
            `SELECT * FROM messages WHERE id = ? AND user_id = ?`,
            [messageId, userId]
        );
        
        if (messages.length === 0) {
            return res.status(404).json({ error: 'הודעה לא נמצאה' });
        }
        
        const message = messages[0];
        const decryptedContent = decrypt(
            message.encrypted_content,
            message.cipher_type,
            message.cipher_key
        );
        
        res.json({
            success: true,
            message: {
                id: message.id,
                title: message.title,
                encrypted_content: message.encrypted_content,
                decrypted_content: decryptedContent,
                cipher_type: message.cipher_type,
                created_at: message.created_at
            }
        });
    } catch (error) {
        console.error('שגיאה בפענוח הודעה:', error);
        res.status(500).json({ error: 'שגיאה בפענוח הודעה' });
    }
}

// יצירת הודעה חדשה
async function createMessage(req, res) {
    try {
        const userId = req.user.id;
        const { title, content, cipher_type, cipher_key } = req.body;
        
        // ולידציה
        if (!title || !content || !cipher_type) {
            return res.status(400).json({
                error: 'נתונים חסרים',
                message: 'יש לספק title, content ו-cipher_type'
            });
        }
        
        const validCipherTypes = ['caesar', 'reverse', 'atbash', 'substitution'];
        if (!validCipherTypes.includes(cipher_type)) {
            return res.status(400).json({
                error: 'סוג צופן לא תקין',
                message: `יש לבחור אחד מ: ${validCipherTypes.join(', ')}`
            });
        }
        
        // ולידציה למפתח
        if (cipher_type === 'caesar' && !cipher_key) {
            return res.status(400).json({
                error: 'חסר מפתח',
                message: 'Caesar cipher דורש cipher_key (מספר)'
            });
        }
        
        if (cipher_type === 'substitution' && (!cipher_key || cipher_key.length !== 26)) {
            return res.status(400).json({
                error: 'מפתח לא תקין',
                message: 'Substitution cipher דורש מפתח בן 26 תווים'
            });
        }
        
        // הצפנת התוכן
        const encryptedContent = encrypt(content, cipher_type, cipher_key);
        
        // שמירה במסד נתונים
        const [result] = await db.query(
            `INSERT INTO messages (user_id, title, encrypted_content, cipher_type, cipher_key) 
             VALUES (?, ?, ?, ?, ?)`,
            [userId, title, encryptedContent, cipher_type, cipher_key]
        );
        
        res.status(201).json({
            success: true,
            message: 'הודעה נוצרה בהצלחה',
            data: {
                id: result.insertId,
                title,
                encrypted_content: encryptedContent,
                cipher_type,
                original_content: content
            }
        });
    } catch (error) {
        console.error('שגיאה ביצירת הודעה:', error);
        res.status(500).json({ error: 'שגיאה ביצירת הודעה' });
    }
}

// עדכון הודעה
async function updateMessage(req, res) {
    try {
        const userId = req.user.id;
        const messageId = req.params.id;
        const { title, content, cipher_type, cipher_key } = req.body;
        
        // בדיקה שההודעה קיימת ושייכת למשתמש
        const [existing] = await db.query(
            'SELECT * FROM messages WHERE id = ? AND user_id = ?',
            [messageId, userId]
        );
        
        if (existing.length === 0) {
            return res.status(404).json({ error: 'הודעה לא נמצאה' });
        }
        
        let encryptedContent = existing[0].encrypted_content;
        let newCipherType = existing[0].cipher_type;
        let newCipherKey = existing[0].cipher_key;
        
        // אם יש תוכן חדש - הצפן אותו
        if (content) {
            const cipherTypeToUse = cipher_type || existing[0].cipher_type;
            const cipherKeyToUse = cipher_key !== undefined ? cipher_key : existing[0].cipher_key;
            encryptedContent = encrypt(content, cipherTypeToUse, cipherKeyToUse);
            newCipherType = cipherTypeToUse;
            newCipherKey = cipherKeyToUse;
        }
        
        // עדכון במסד נתונים
        await db.query(
            `UPDATE messages 
             SET title = ?, encrypted_content = ?, cipher_type = ?, cipher_key = ?
             WHERE id = ? AND user_id = ?`,
            [
                title || existing[0].title,
                encryptedContent,
                newCipherType,
                newCipherKey,
                messageId,
                userId
            ]
        );
        
        res.json({
            success: true,
            message: 'הודעה עודכנה בהצלחה'
        });
    } catch (error) {
        console.error('שגיאה בעדכון הודעה:', error);
        res.status(500).json({ error: 'שגיאה בעדכון הודעה' });
    }
}

// מחיקת הודעה
async function deleteMessage(req, res) {
    try {
        const userId = req.user.id;
        const messageId = req.params.id;
        
        const [result] = await db.query(
            'DELETE FROM messages WHERE id = ? AND user_id = ?',
            [messageId, userId]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'הודעה לא נמצאה' });
        }
        
        res.json({
            success: true,
            message: 'הודעה נמחקה בהצלחה'
        });
    } catch (error) {
        console.error('שגיאה במחיקת הודעה:', error);
        res.status(500).json({ error: 'שגיאה במחיקת הודעה' });
    }
}

module.exports = {
    getAllMessages,
    getMessage,
    decryptMessage,
    createMessage,
    updateMessage,
    deleteMessage
};
```

---

## תרגיל 6: Routes

### שלב 6.1: יצירת Routes להודעות
צור קובץ `routes/messagesRoutes.js`:

```javascript
const express = require('express');
const router = express.Router();
const messagesController = require('../controllers/messagesController');
const { authenticateUser } = require('../middleware/authMiddleware');

// כל ה-routes מוגנים באימות
router.use(authenticateUser);

// Routes להודעות
router.get('/', messagesController.getAllMessages);
router.get('/:id', messagesController.getMessage);
router.get('/:id/decrypt', messagesController.decryptMessage);
router.post('/', messagesController.createMessage);
router.put('/:id', messagesController.updateMessage);
router.delete('/:id', messagesController.deleteMessage);

module.exports = router;
```

---

## תרגיל 7: Server ראשי

### שלב 7.1: יצירת שרת
צור קובץ `server.js`:

```javascript
const express = require('express');
require('dotenv').config();
const messagesRoutes = require('./routes/messagesRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// לוג של כל הבקשות
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Routes
app.get('/', (req, res) => {
    res.json({
        message: 'ברוכים הבאים למערכת ההודעות המוצפנות',
        endpoints: {
            messages: '/api/messages',
            info: 'כל ה-endpoints דורשים HTTP Basic Authentication'
        },
        cipherTypes: ['caesar', 'reverse', 'atbash', 'substitution']
    });
});

app.use('/api/messages', messagesRoutes);

// טיפול בנתיבים לא קיימים
app.use((req, res) => {
    res.status(404).json({ error: 'נתיב לא נמצא' });
});

// טיפול בשגיאות
app.use((err, req, res, next) => {
    console.error('שגיאת שרת:', err);
    res.status(500).json({ error: 'שגיאת שרת פנימית' });
});

app.listen(PORT, () => {
    console.log(`🚀 השרת רץ על פורט ${PORT}`);
    console.log(`🔐 Authentication: HTTP Basic Auth`);
    console.log(`📝 נתונים לדמו:`);
    console.log(`   משתמש: alice, סיסמה: password123`);
    console.log(`   משתמש: bob, סיסמה: secret456`);
    console.log(`   משתמש: charlie, סיסמה: mypass789`);
});
```

---

## תרגיל 8: בדיקת המערכת

### שלב 8.1: הרצת השרת
```bash
node server.js
```

### שלב 8.2: בדיקות עם cURL

#### 1. ניסיון ללא אימות (צריך להיכשל):
```bash
curl http://localhost:3000/api/messages
```

#### 2. קבלת כל ההודעות עם אימות:
```bash
curl -u alice:password123 http://localhost:3000/api/messages
```

#### 3. יצירת הודעה חדשה עם Caesar Cipher:
```bash
curl -X POST -u alice:password123 \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"הודעה סודית\",\"content\":\"This is a secret message\",\"cipher_type\":\"caesar\",\"cipher_key\":\"5\"}" \
  http://localhost:3000/api/messages
```

#### 4. יצירת הודעה עם Reverse Cipher:
```bash
curl -X POST -u alice:password123 \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"הודעה הפוכה\",\"content\":\"Hello World\",\"cipher_type\":\"reverse\"}" \
  http://localhost:3000/api/messages
```

#### 5. פענוח הודעה (החלף :id במספר ההודעה):
```bash
curl -u alice:password123 http://localhost:3000/api/messages/1/decrypt
```

#### 6. עדכון הודעה:
```bash
curl -X PUT -u alice:password123 \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"הודעה מעודכנת\",\"content\":\"New secret content\",\"cipher_type\":\"atbash\"}" \
  http://localhost:3000/api/messages/1
```

#### 7. מחיקת הודעה:
```bash
curl -X DELETE -u alice:password123 http://localhost:3000/api/messages/1
```

### שלב 8.3: בדיקות עם Postman או Thunder Client

1. **הגדרת Authorization:**
   - Type: Basic Auth
   - Username: alice
   - Password: password123

2. **GET** `http://localhost:3000/api/messages`
   - קבלת כל ההודעות

3. **POST** `http://localhost:3000/api/messages`
   ```json
   {
       "title": "הודעה חדשה",
       "content": "Secret information here",
       "cipher_type": "caesar",
       "cipher_key": "7"
   }
   ```

4. **GET** `http://localhost:3000/api/messages/1/decrypt`
   - פענוח הודעה

---

## תרגיל 9: הוספת Controller למשתמשים

### שלב 9.1: יצירת Auth Controller
צור קובץ `controllers/authController.js`:

```javascript
const db = require('../config/db');

// הרשמת משתמש חדש
async function register(req, res) {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({
                error: 'נתונים חסרים',
                message: 'יש לספק username ו-password'
            });
        }
        
        // בדיקה אם המשתמש כבר קיים
        const [existing] = await db.query(
            'SELECT id FROM users WHERE username = ?',
            [username]
        );
        
        if (existing.length > 0) {
            return res.status(409).json({
                error: 'משתמש קיים',
                message: 'שם המשתמש כבר תפוס'
            });
        }
        
        // יצירת משתמש חדש (סיסמה בטקסט פשוט)
        const [result] = await db.query(
            'INSERT INTO users (username, password) VALUES (?, ?)',
            [username, password]
        );
        
        res.status(201).json({
            success: true,
            message: 'משתמש נוצר בהצלחה',
            user: {
                id: result.insertId,
                username
            }
        });
    } catch (error) {
        console.error('שגיאה בהרשמה:', error);
        res.status(500).json({ error: 'שגיאה בהרשמת משתמש' });
    }
}

// קבלת פרטי משתמש מחובר
async function getProfile(req, res) {
    try {
        const userId = req.user.id;
        
        const [users] = await db.query(
            'SELECT id, username, created_at FROM users WHERE id = ?',
            [userId]
        );
        
        const [messageCount] = await db.query(
            'SELECT COUNT(*) as count FROM messages WHERE user_id = ?',
            [userId]
        );
        
        res.json({
            success: true,
            profile: {
                ...users[0],
                message_count: messageCount[0].count
            }
        });
    } catch (error) {
        console.error('שגיאה בקבלת פרופיל:', error);
        res.status(500).json({ error: 'שגיאה בקבלת פרופיל' });
    }
}

module.exports = {
    register,
    getProfile
};
```

### שלב 9.2: הוספת Routes למשתמשים
עדכן את `server.js` להוסיף:

```javascript
const authController = require('./controllers/authController');
const { authenticateUser } = require('./middleware/authMiddleware');

// Route להרשמה (ללא אימות)
app.post('/api/register', authController.register);

// Route לפרופיל (עם אימות)
app.get('/api/profile', authenticateUser, authController.getProfile);
```

### שלב 9.3: בדיקת ההרשמה

```bash
# הרשמת משתמש חדש
curl -X POST -H "Content-Type: application/json" \
  -d "{\"username\":\"david\",\"password\":\"mypassword\"}" \
  http://localhost:3000/api/register

# קבלת פרופיל
curl -u david:mypassword http://localhost:3000/api/profile
```

---

## תרגיל 10: תרגילי הרחבה

### 10.1: הוספת סטטיסטיקות
הוסף endpoint שמחזיר סטטיסטיקות על השימוש בצפנים:

```javascript
// controllers/messagesController.js
async function getStatistics(req, res) {
    try {
        const userId = req.user.id;
        
        const [stats] = await db.query(
            `SELECT 
                cipher_type,
                COUNT(*) as count,
                AVG(LENGTH(encrypted_content)) as avg_length
             FROM messages 
             WHERE user_id = ?
             GROUP BY cipher_type`,
            [userId]
        );
        
        const [total] = await db.query(
            'SELECT COUNT(*) as total FROM messages WHERE user_id = ?',
            [userId]
        );
        
        res.json({
            success: true,
            total_messages: total[0].total,
            by_cipher: stats
        });
    } catch (error) {
        console.error('שגיאה בקבלת סטטיסטיקות:', error);
        res.status(500).json({ error: 'שגיאה בקבלת סטטיסטיקות' });
    }
}
```

הוסף ל-routes:
```javascript
router.get('/stats', messagesController.getStatistics);
```

### 10.2: חיפוש הודעות
הוסף endpoint לחיפוש בכותרות:

```javascript
async function searchMessages(req, res) {
    try {
        const userId = req.user.id;
        const { query } = req.query;
        
        if (!query) {
            return res.status(400).json({ error: 'יש לספק query parameter' });
        }
        
        const [messages] = await db.query(
            `SELECT id, title, encrypted_content, cipher_type, created_at 
             FROM messages 
             WHERE user_id = ? AND title LIKE ?
             ORDER BY created_at DESC`,
            [userId, `%${query}%`]
        );
        
        res.json({
            success: true,
            count: messages.length,
            messages
        });
    } catch (error) {
        console.error('שגיאה בחיפוש:', error);
        res.status(500).json({ error: 'שגיאה בחיפוש הודעות' });
    }
}
```

### 10.3: שיתוף הודעות
הוסף אפשרות לשתף הודעה מוצפנת עם משתמש אחר:

```javascript
async function shareMessage(req, res) {
    try {
        const userId = req.user.id;
        const messageId = req.params.id;
        const { target_username } = req.body;
        
        if (!target_username) {
            return res.status(400).json({ error: 'יש לספק target_username' });
        }
        
        // מציאת המשתמש היעד
        const [targetUsers] = await db.query(
            'SELECT id FROM users WHERE username = ?',
            [target_username]
        );
        
        if (targetUsers.length === 0) {
            return res.status(404).json({ error: 'משתמש לא נמצא' });
        }
        
        // קבלת ההודעה המקורית
        const [messages] = await db.query(
            'SELECT * FROM messages WHERE id = ? AND user_id = ?',
            [messageId, userId]
        );
        
        if (messages.length === 0) {
            return res.status(404).json({ error: 'הודעה לא נמצאה' });
        }
        
        const message = messages[0];
        const targetUserId = targetUsers[0].id;
        
        // יצירת עותק של ההודעה למשתמש היעד
        await db.query(
            `INSERT INTO messages (user_id, title, encrypted_content, cipher_type, cipher_key) 
             VALUES (?, ?, ?, ?, ?)`,
            [
                targetUserId,
                `[משותף] ${message.title}`,
                message.encrypted_content,
                message.cipher_type,
                message.cipher_key
            ]
        );
        
        res.json({
            success: true,
            message: 'הודעה שותפה בהצלחה',
            shared_with: target_username
        });
    } catch (error) {
        console.error('שגיאה בשיתוף הודעה:', error);
        res.status(500).json({ error: 'שגיאה בשיתוף הודעה' });
    }
}
```

### 10.4: פענוח אוטומטי (ניחוש צופן)
הוסף endpoint שמנסה לפענח הודעה עם כל הצפנים האפשריים:

```javascript
const { decrypt } = require('../utils/cipher');

async function tryDecryptAll(req, res) {
    try {
        const userId = req.user.id;
        const messageId = req.params.id;
        
        const [messages] = await db.query(
            'SELECT * FROM messages WHERE id = ? AND user_id = ?',
            [messageId, userId]
        );
        
        if (messages.length === 0) {
            return res.status(404).json({ error: 'הודעה לא נמצאה' });
        }
        
        const message = messages[0];
        const results = [];
        
        // ניסיון עם Caesar (מספר אפשרויות)
        for (let shift = 1; shift <= 25; shift++) {
            try {
                const decrypted = decrypt(message.encrypted_content, 'caesar', shift.toString());
                results.push({
                    cipher_type: 'caesar',
                    key: shift,
                    result: decrypted
                });
            } catch (e) {}
        }
        
        // ניסיון עם Reverse
        try {
            const decrypted = decrypt(message.encrypted_content, 'reverse', null);
            results.push({
                cipher_type: 'reverse',
                result: decrypted
            });
        } catch (e) {}
        
        // ניסיון עם Atbash
        try {
            const decrypted = decrypt(message.encrypted_content, 'atbash', null);
            results.push({
                cipher_type: 'atbash',
                result: decrypted
            });
        } catch (e) {}
        
        res.json({
            success: true,
            message: 'נוסו כל השיטות האפשריות',
            original: message.encrypted_content,
            attempts: results.length,
            results
        });
    } catch (error) {
        console.error('שגיאה בפענוח אוטומטי:', error);
        res.status(500).json({ error: 'שגיאה בפענוח אוטומטי' });
    }
}
```

---

## תרגיל בונוס 1: הצפנה כפולה

יצור אפשרות להצפנה כפולה (שימוש ב-2 צפנים):

```javascript
// utils/cipher.js
function doubleEncrypt(text, cipher1, key1, cipher2, key2) {
    const firstEncryption = encrypt(text, cipher1, key1);
    const secondEncryption = encrypt(firstEncryption, cipher2, key2);
    return secondEncryption;
}

function doubleDecrypt(text, cipher1, key1, cipher2, key2) {
    const firstDecryption = decrypt(text, cipher2, key2);
    const secondDecryption = decrypt(firstDecryption, cipher1, key1);
    return secondDecryption;
}

module.exports = {
    // ... פונקציות קיימות
    doubleEncrypt,
    doubleDecrypt
};
```

עדכן את טבלת ההודעות:
```sql
ALTER TABLE messages
ADD COLUMN cipher_type2 VARCHAR(50),
ADD COLUMN cipher_key2 VARCHAR(255);
```

---

## תרגיל בונוס 2: Rate Limiting

הוסף הגבלת קצב לבקשות:

```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 דקות
    max: 100, // מקסימום 100 בקשות
    message: 'יותר מדי בקשות, נסה שוב מאוחר יותר',
    standardHeaders: true,
    legacyHeaders: false,
});

app.use('/api/', limiter);
```

---

## תרגיל בונוס 3: לוגינג מתקדם

צור מערכת לוגים מתקדמת:

```javascript
const fs = require('fs').promises;
const path = require('path');

async function logAction(userId, action, details) {
    const logEntry = {
        timestamp: new Date().toISOString(),
        userId,
        action,
        details
    };
    
    const logFile = path.join(__dirname, '../logs', 'actions.log');
    await fs.appendFile(logFile, JSON.stringify(logEntry) + '\n');
}

// שימוש:
await logAction(req.user.id, 'CREATE_MESSAGE', { 
    messageId: result.insertId, 
    cipherType: cipher_type 
});
```

---

## תרגיל בונוס 4: ממשק HTML פשוט

צור דף HTML פשוט לניהול הודעות:

```html
<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>מערכת הודעות מוצפנות</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            margin-bottom: 20px;
        }
        input, select, textarea {
            width: 100%;
            padding: 10px;
            margin: 5px 0;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        button {
            background: #007bff;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        button:hover {
            background: #0056b3;
        }
        .message {
            border: 1px solid #ddd;
            padding: 15px;
            margin: 10px 0;
            border-radius: 4px;
            background: #fafafa;
        }
        .error {
            color: red;
            margin: 10px 0;
        }
        .success {
            color: green;
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <h1>מערכת הודעות מוצפנות</h1>
    
    <div class="container">
        <h2>התחברות</h2>
        <input type="text" id="username" placeholder="שם משתמש">
        <input type="password" id="password" placeholder="סיסמה">
        <button onclick="login()">התחבר</button>
        <div id="loginStatus"></div>
    </div>
    
    <div class="container">
        <h2>יצירת הודעה חדשה</h2>
        <input type="text" id="title" placeholder="כותרת">
        <textarea id="content" placeholder="תוכן ההודעה" rows="4"></textarea>
        <select id="cipherType">
            <option value="caesar">Caesar Cipher</option>
            <option value="reverse">Reverse Cipher</option>
            <option value="atbash">Atbash Cipher</option>
            <option value="substitution">Substitution Cipher</option>
        </select>
        <input type="text" id="cipherKey" placeholder="מפתח (רק ל-Caesar ו-Substitution)">
        <button onclick="createMessage()">שלח הודעה</button>
        <div id="createStatus"></div>
    </div>
    
    <div class="container">
        <h2>ההודעות שלי</h2>
        <button onclick="loadMessages()">רענן הודעות</button>
        <div id="messagesList"></div>
    </div>

    <script>
        let auth = '';
        
        function login() {
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            auth = 'Basic ' + btoa(username + ':' + password);
            document.getElementById('loginStatus').innerHTML = 
                '<span class="success">התחברת בהצלחה!</span>';
        }
        
        async function createMessage() {
            const title = document.getElementById('title').value;
            const content = document.getElementById('content').value;
            const cipherType = document.getElementById('cipherType').value;
            const cipherKey = document.getElementById('cipherKey').value;
            
            try {
                const response = await fetch('/api/messages', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': auth
                    },
                    body: JSON.stringify({
                        title,
                        content,
                        cipher_type: cipherType,
                        cipher_key: cipherKey || undefined
                    })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    document.getElementById('createStatus').innerHTML = 
                        '<span class="success">הודעה נוצרה בהצלחה!</span>';
                    document.getElementById('title').value = '';
                    document.getElementById('content').value = '';
                    loadMessages();
                } else {
                    document.getElementById('createStatus').innerHTML = 
                        '<span class="error">' + data.error + '</span>';
                }
            } catch (error) {
                document.getElementById('createStatus').innerHTML = 
                    '<span class="error">שגיאה ביצירת הודעה</span>';
            }
        }
        
        async function loadMessages() {
            try {
                const response = await fetch('/api/messages', {
                    headers: {
                        'Authorization': auth
                    }
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    const messagesList = document.getElementById('messagesList');
                    messagesList.innerHTML = data.messages.map(msg => `
                        <div class="message">
                            <h3>${msg.title}</h3>
                            <p><strong>מוצפן:</strong> ${msg.encrypted_content}</p>
                            <p><strong>צופן:</strong> ${msg.cipher_type}</p>
                            <p><strong>תאריך:</strong> ${new Date(msg.created_at).toLocaleString('he-IL')}</p>
                            <button onclick="decryptMessage(${msg.id})">פענח</button>
                            <button onclick="deleteMessage(${msg.id})">מחק</button>
                            <div id="decrypt-${msg.id}"></div>
                        </div>
                    `).join('');
                } else {
                    document.getElementById('messagesList').innerHTML = 
                        '<span class="error">שגיאה בטעינת הודעות</span>';
                }
            } catch (error) {
                document.getElementById('messagesList').innerHTML = 
                    '<span class="error">שגיאה בטעינת הודעות</span>';
            }
        }
        
        async function decryptMessage(id) {
            try {
                const response = await fetch(`/api/messages/${id}/decrypt`, {
                    headers: {
                        'Authorization': auth
                    }
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    document.getElementById(`decrypt-${id}`).innerHTML = 
                        '<p><strong>מפוענח:</strong> ' + data.message.decrypted_content + '</p>';
                }
            } catch (error) {
                alert('שגיאה בפענוח הודעה');
            }
        }
        
        async function deleteMessage(id) {
            if (!confirm('האם למחוק את ההודעה?')) return;
            
            try {
                const response = await fetch(`/api/messages/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': auth
                    }
                });
                
                if (response.ok) {
                    loadMessages();
                } else {
                    alert('שגיאה במחיקת הודעה');
                }
            } catch (error) {
                alert('שגיאה במחיקת הודעה');
            }
        }
    </script>
</body>
</html>
```

הוסף ל-`server.js`:
```javascript
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
```

---

## סיכום ומטלות נוספות

### מה למדנו:
- ✅ HTTP Basic Authentication
- ✅ אחסון סיסמאות כטקסט פשוט (לא מומלץ בפרודקשן!)
- ✅ הצפנה ופענוח עם צפנים קלאסיים
- ✅ חיבור ל-MySQL עם Promise Pool
- ✅ CRUD מלא עם Express
- ✅ Middleware לאימות
- ✅ טיפול בשגיאות

### מטלות נוספות להתאמן:
1. הוסף צופן נוסף (ROT13, Vigenère)
2. צור מערכת ניקוד לחוזק ההצפנה
3. הוסף יכולת ייצוא/ייבוא של הודעות
4. צור API documentation עם Swagger
5. הוסף בדיקות יחידה (Unit Tests)
6. שפר את הביטחון: hash passwords (bcrypt)
7. הוסף HTTPS
8. יצור Docker Compose להרצת המערכת המלאה

### משאבים נוספים:
- [Express.js Documentation](https://expressjs.com/)
- [MySQL2 npm package](https://www.npmjs.com/package/mysql2)
- [HTTP Basic Auth](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication)
- [Classical Ciphers](https://en.wikipedia.org/wiki/Classical_cipher)

---

**בהצלחה! 🚀**
