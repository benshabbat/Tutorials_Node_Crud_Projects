-- קובץ אתחול MySQL
-- קובץ זה ירוץ אוטומטית בפעם הראשונה שמקימים את הקונטיינר

-- יצירת טבלת משתמשים לדוגמה
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    age INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- הוספת נתונים לדוגמה
INSERT INTO users (name, email, age) VALUES
    ('אליס כהן', 'alice@example.com', 28),
    ('בוב לוי', 'bob@example.com', 32),
    ('צ\'רלי דוד', 'charlie@example.com', 25);

-- יצירת טבלת מוצרים לדוגמה
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- הוספת מוצרים לדוגמה
INSERT INTO products (name, description, price, stock) VALUES
    ('מחשב נייד', 'מחשב נייד עם מסך 15 אינץ', 3500.00, 10),
    ('עכבר אלחוטי', 'עכבר אלחוטי ארגונומי', 89.90, 50),
    ('מקלדת', 'מקלדת מכנית RGB', 299.00, 25);
