# תרגילי MySQL למתחילים מוחלטים 🌱

## למי מיועדים התרגילים?
- אתם חדשים ל-MySQL
- לא התעסקתם עם בסיסי נתונים בעבר
- רוצים להתחיל מהבסיס הכי בסיסי

---

## תרגיל 0: הכנה והגדרה 🔧

### שלב 1: וודאו ש-MySQL מותקן

**בדיקה מהירה:**
```bash
mysql --version
```

**אם רואים משהו כמו:** `mysql Ver 8.0.33`
אז MySQL מותקן! ✅

**אם לא רואים - צריך להתקין:**
- ראו [מדריך MySQL](../../guides/hebrew/mysql-guide.md)
- או [מדריך Docker](../../guides/hebrew/mysql-docker-guide.md)

### שלב 2: צרו תיקייה לתרגילים
```bash
mkdir my-mysql-exercises
cd my-mysql-exercises
```

### שלב 3: התחילו פרויקט Node.js
```bash
npm init -y
```

### שלב 4: התקינו חבילות
```bash
npm install mysql2 dotenv
```

### שלב 5: ערכו package.json
פתחו את `package.json` והוסיפו:
```json
{
  "type": "module",
  "scripts": {
    "start": "node server.js"
  }
}
```

### שלב 6: צרו קובץ .env
צרו קובץ בשם `.env` והוסיפו:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=my_first_db
```

**⚠️ חשוב:** החליפו את "your_password_here" בסיסמה האמיתית!

---

## תרגיל 1: קוד הכי פשוט - בדיקת חיבור ⚡

### 🎯 מטרה
פשוט לבדוק שאפשר להתחבר ל-MySQL

### 📝 מה לעשות
צרו קובץ `test.js` שמתחבר ל-MySQL ומדפיס הודעה אם החיבור הצליח.

### 💡 רמזים
<details>
<summary>רמז 1: איך להתחבר?</summary>

השתמשו ב-`mysql.createConnection()` עם האובייקט:
```javascript
{
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
}
```
</details>

<details>
<summary>רמז 2: מבנה הקוד</summary>

```javascript
import mysql from 'mysql2/promise';
import 'dotenv/config';

async function checkConnection() {
  try {
    const connection = await mysql.createConnection({ /* ... */ });
    // Print success message
    await connection.end();
  } catch (error) {
    // Print error
  }
}
```
</details>

### ✅ תוצאה מצופה
```
✅ Successfully connected to MySQL!
```

---

## תרגיל 2: יוצרים בסיס נתונים ראשון 🎨

### 🎯 מטרה
ליצור בסיס נתונים חדש שיקרא `books_db`

### 📝 מה לעשות
צרו קובץ `create-database.js` שיוצר בסיס נתונים חדש.

### 💡 רמזים
<details>
<summary>רמז 1: SQL Query</summary>

```sql
CREATE DATABASE IF NOT EXISTS books_db
```
</details>

<details>
<summary>רמז 2: איך להריץ Query?</summary>

```javascript
await connection.query('CREATE DATABASE IF NOT EXISTS books_db');
```
</details>

### ✅ תוצאה מצופה
```
✅ Database books_db created successfully!
```

---

## תרגיל 3: יוצרים טבלה ראשונה 📊

### 🎯 מטרה
ליצור טבלה לספרים עם 3 עמודות

### 📝 מה לעשות
צרו קובץ `create-table.js` שיוצר טבלה בשם `books` עם העמודות הבאות:
- `id` - מספר אוטומטי (PRIMARY KEY, AUTO_INCREMENT)
- `title` - כותרת הספר (VARCHAR 200)
- `pages` - מספר עמודים (INT)

### 💡 רמזים
<details>
<summary>רמז 1: SQL Query</summary>

```sql
CREATE TABLE IF NOT EXISTS books (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200),
  pages INT
)
```
</details>

<details>
<summary>רמז 2: חיבור לבסיס נתונים</summary>

צריך להוסיף `database: 'books_db'` בזמן החיבור
</details>

### ✅ תוצאה מצופה
```
✅ Table books created successfully!
```

---

## תרגיל 4: מוסיפים ספר ראשון 📚

### 🎯 מטרה
להוסיף ספר אחד לטבלה

### 📝 מה לעשות
צרו קובץ `add-book.js` שמוסיף ספר עם:
- Title: "Harry Potter"
- Pages: 300

### 💡 רמזים
<details>
<summary>רמז 1: SQL Query עם Placeholders</summary>

```sql
INSERT INTO books (title, pages) VALUES (?, ?)
```
השימוש ב-`?` מונע SQL Injection!
</details>

<details>
<summary>רמז 2: איך לשלוח ערכים?</summary>

```javascript
await connection.query(
  'INSERT INTO books (title, pages) VALUES (?, ?)',
  ['Harry Potter', 300]
);
```
</details>

<details>
<summary>רמז 3: איך לקבל את ה-ID החדש?</summary>

```javascript
const [result] = await connection.query(/* ... */);
console.log('New book ID:', result.insertId);
```
</details>

### ✅ תוצאה מצופה
```
✅ Book added successfully!
New book ID: 1
```

---

## תרגיל 5: רואים מה יש בטבלה 👀

### 🎯 מטרה
להציג את כל הספרים שבטבלה

### 📝 מה לעשות
צרו קובץ `show-books.js` שמציג את כל הספרים בפורמט נקי וקריא.

### 💡 רמזים
<details>
<summary>רמז 1: SQL Query</summary>

```sql
SELECT * FROM books
```
</details>

<details>
<summary>רמז 2: איך לעבור על התוצאות?</summary>

```javascript
const [books] = await connection.query('SELECT * FROM books');

books.forEach(book => {
  console.log(`ID: ${book.id}`);
  console.log(`Title: ${book.title}`);
  console.log(`Pages: ${book.pages}`);
});
```
</details>

### ✅ תוצאה מצופה
```
📚 Our Books:
================
ID: 1
Title: Harry Potter
Pages: 300
----------------
Total: 1 books
```

---

## תרגיל 6: מוסיפים עוד ספרים 📖📖

### 🎯 מטרה
להוסיף כמה ספרים בבת אחת

### 📝 מה לעשות
צרו קובץ `add-many-books.js` שמוסיף את הספרים הבאים:
- "Alice in Wonderland" - 150 pages
- "The Little Prince" - 100 pages  
- "Moby Dick" - 500 pages

### 💡 רמזים
<details>
<summary>רמז 1: מבנה נתונים</summary>

```javascript
const books = [
  { title: 'Alice in Wonderland', pages: 150 },
  { title: 'The Little Prince', pages: 100 },
  { title: 'Moby Dick', pages: 500 }
];
```
</details>

<details>
<summary>רמז 2: לולאה</summary>

```javascript
for (const book of books) {
  await connection.query(
    'INSERT INTO books (title, pages) VALUES (?, ?)',
    [book.title, book.pages]
  );
}
```
</details>

### ✅ תוצאה מצופה
```
✅ Added: Alice in Wonderland
✅ Added: The Little Prince
✅ Added: Moby Dick

🎉 All books added successfully!
```

---

## תרגיל 7: מחפשים ספר מסוים 🔍

### 🎯 מטרה
למצוא ספרים לפי תנאים

### 📝 מה לעשות
צרו קובץ `search-books.js` שמבצע שני חיפושים:
1. מצא את הספר "The Little Prince"
2. מצא את כל הספרים עם יותר מ-200 עמודים

### 💡 רמזים
<details>
<summary>רמז 1: WHERE clause</summary>

```sql
SELECT * FROM books WHERE title = ?
SELECT * FROM books WHERE pages > ?
```
</details>

<details>
<summary>רמז 2: קוד מלא לחיפוש</summary>

```javascript
// Search by title
const [bookByTitle] = await connection.query(
  'SELECT * FROM books WHERE title = ?',
  ['The Little Prince']
);

// Search by pages
const [booksByPages] = await connection.query(
  'SELECT * FROM books WHERE pages > ?',
  [200]
);
```
</details>

### ✅ תוצאה מצופה
```
🔍 Searching for "The Little Prince":
[{ id: 3, title: 'The Little Prince', pages: 100 }]

🔍 Books with more than 200 pages:
[{ id: 1, title: 'Harry Potter', pages: 300 },
 { id: 4, title: 'Moby Dick', pages: 500 }]
```

---

## תרגיל 8: משנים מספר עמודים 📝

### 🎯 מטרה
לעדכן את מספר העמודים של ספר

### 📝 מה לעשות
צרו קובץ `update-book.js` שמשנה את מספר העמודים של הספר עם ID 1 ל-350 עמודים.

### 💡 רמזים
<details>
<summary>רמז 1: UPDATE query</summary>

```sql
UPDATE books SET pages = ? WHERE id = ?
```
</details>

<details>
<summary>רמז 2: איך לבדוק שהעדכון הצליח?</summary>

```javascript
const [result] = await connection.query(/* UPDATE query */);
console.log('Rows affected:', result.affectedRows);

// Then SELECT to see the updated data
const [updated] = await connection.query(
  'SELECT * FROM books WHERE id = ?',
  [bookId]
);
```
</details>

### ⚠️ אזהרה
**תמיד השתמש ב-WHERE בעת עדכון!**
```javascript
// ❌ Dangerous - updates ALL books!
UPDATE books SET pages = 350

// ✅ Safe - updates only one book
UPDATE books SET pages = 350 WHERE id = 1
```

### ✅ תוצאה מצופה
```
✅ Book updated!
Rows affected: 1

📖 Updated book:
{ id: 1, title: 'Harry Potter', pages: 350 }
```

---

## תרגיל 9: מוחקים ספר 🗑️

### 🎯 מטרה
למחוק ספר אחד מהטבלה

### 📝 מה לעשות
צרו קובץ `delete-book.js` שמוחק את הספר עם ID 2.
קודם הצג איזה ספר זה, ואז מחק אותו.

### 💡 רמזים
<details>
<summary>רמז 1: DELETE query</summary>

```sql
DELETE FROM books WHERE id = ?
```
</details>

<details>
<summary>רמז 2: תהליך מלא</summary>

```javascript
// 1. Show the book before deletion
const [before] = await connection.query(
  'SELECT * FROM books WHERE id = ?',
  [bookId]
);
console.log('Book to delete:', before[0]);

// 2. Delete it
await connection.query('DELETE FROM books WHERE id = ?', [bookId]);

// 3. Verify it's gone
const [after] = await connection.query(
  'SELECT * FROM books WHERE id = ?',
  [bookId]
);
if (after.length === 0) {
  console.log('Book deleted successfully!');
}
```
</details>

### ⚠️ אזהרה חשובה
**תמיד השתמש ב-WHERE בעת מחיקה!**
```javascript
// ❌ DANGER - deletes EVERYTHING!!!
DELETE FROM books

// ✅ Safe - deletes only one book
DELETE FROM books WHERE id = 2
```

### ✅ תוצאה מצופה
```
🗑️ Book to delete:
{ id: 2, title: 'Alice in Wonderland', pages: 150 }

✅ Book deleted successfully!
Rows deleted: 1
```

---

## תרגיל 10: סופרים ספרים 🔢

### 🎯 מטרה
לספור כמה ספרים יש לנו

### 📝 מה לעשות
צרו קובץ `count-books.js` שמציג:
1. סך כל הספרים
2. כמה ספרים יש עם יותר מ-200 עמודים

### 💡 רמזים
<details>
<summary>רמז 1: COUNT function</summary>

```sql
SELECT COUNT(*) as total FROM books
SELECT COUNT(*) as total FROM books WHERE pages > 200
```
</details>

<details>
<summary>רמז 2: איך לגשת לתוצאה?</summary>

```javascript
const [result] = await connection.query(
  'SELECT COUNT(*) as total FROM books'
);
console.log('Total books:', result[0].total);
```
</details>

### ✅ תוצאה מצופה
```
📚 Total books: 3
📖 Books with 200+ pages: 2
```

---

## תרגיל בונוס: כל ה-CRUD ביחד 🎯

### 🎯 מטרה
לעשות את כל פעולות ה-CRUD על ספר אחד

### 📝 מה לעשות
צרו קובץ `complete-crud.js` שמבצע את כל השלבים הבאים:
1. **CREATE** - הוסף ספר חדש "Test Book" עם 250 עמודים
2. **READ** - קרא את הספר החדש
3. **UPDATE** - עדכן אותו ל-300 עמודים
4. **READ שוב** - קרא אותו שוב אחרי העדכון
5. **DELETE** - מחק את הספר
6. **VERIFY** - וודא שהוא נמחק

### 💡 רמזים
<details>
<summary>רמז 1: מבנה הקוד</summary>

```javascript
async function completeCRUD() {
  const connection = await mysql.createConnection({ /* ... */ });
  
  try {
    // 1. CREATE
    const [insertResult] = await connection.query(/* ... */);
    const newId = insertResult.insertId;
    
    // 2. READ
    const [books] = await connection.query(/* ... */);
    
    // 3. UPDATE
    await connection.query(/* ... */);
    
    // 4. READ again
    // 5. DELETE
    // 6. VERIFY
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await connection.end();
  }
}
```
</details>

### ✅ תוצאה מצופה
```
1️⃣ Adding new book...
✅ Book added with ID: 5

2️⃣ Reading the new book...
✅ Book: { id: 5, title: 'Test Book', pages: 250 }

3️⃣ Updating the book...
✅ Book updated

4️⃣ Reading again after update...
✅ Updated book: { id: 5, title: 'Test Book', pages: 300 }

5️⃣ Deleting the book...
✅ Book deleted

6️⃣ Verifying deletion...
✅ Book successfully deleted!

🎉 Completed all CRUD operations!
```

---

## 📚 סיכום מה למדנו

✅ **C**REATE - יצירה (`INSERT`)
✅ **R**EAD - קריאה (`SELECT`)
✅ **U**PDATE - עדכון (`UPDATE`)
✅ **D**ELETE - מחיקה (`DELETE`)

---

## 🎓 תרגילים לתרגול עצמי

נסו לכתוב בעצמכם:

1. **תרגיל A**: צרו טבלה למכוניות (cars) עם: model, year, color
2. **תרגיל B**: הוסיפו 5 מכוניות
3. **תרגיל C**: מצאו את כל המכוניות משנת 2020 ומעלה
4. **תרגיל D**: שנו את הצבע של מכונית אחת
5. **תרגיל E**: מחקו מכונית אחת

---

## 🐛 אם משהו לא עובד

### בעיה: "Cannot find module 'mysql2'"
**פתרון:**
```bash
npm install mysql2
```

### בעיה: "Access denied"
**פתרון:** בדקו את הסיסמה בקובץ .env

### בעיה: "Unknown database"
**פתרון:** הריצו את create-database.js קודם

### בעיה: "Table doesn't exist"
**פתרון:** הריצו את create-table.js קודם

---

## ➡️ מה הלאה?

עכשיו שאתם יודעים את הבסיס, אפשר לעבור ל:
- [תרגילים פשוטים](./mysql-simple-exercises.md) - API עם Express
- [מדריך MySQL](../../guides/hebrew/mysql-guide.md) - מידע מתקדם יותר

---

## 📖 פתרונות מלאים

<details>
<summary>פתרון תרגיל 1: בדיקת חיבור</summary>

```javascript
import mysql from 'mysql2/promise';
import 'dotenv/config';

async function checkConnection() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    });

    console.log('✅ Successfully connected to MySQL!');

    await connection.end();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkConnection();
```
</details>

<details>
<summary>פתרון תרגיל 2: יצירת בסיס נתונים</summary>

```javascript
import mysql from 'mysql2/promise';
import 'dotenv/config';

async function createMyDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
  });

  try {
    await connection.query('CREATE DATABASE IF NOT EXISTS books_db');
    console.log('✅ Database books_db created successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await connection.end();
  }
}

createMyDatabase();
```
</details>

<details>
<summary>פתרון תרגיל 3: יצירת טבלה</summary>

```javascript
import mysql from 'mysql2/promise';
import 'dotenv/config';

async function createBooksTable() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'books_db'
  });

  try {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS books (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(200),
        pages INT
      )
    `);
    
    console.log('✅ Table books created successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await connection.end();
  }
}

createBooksTable();
```
</details>

<details>
<summary>פתרון תרגיל 4: הוספת ספר</summary>

```javascript
import mysql from 'mysql2/promise';
import 'dotenv/config';

async function addBook() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'books_db'
  });

  try {
    const bookTitle = 'Harry Potter';
    const bookPages = 300;
    
    const [result] = await connection.query(
      'INSERT INTO books (title, pages) VALUES (?, ?)',
      [bookTitle, bookPages]
    );
    
    console.log('✅ Book added successfully!');
    console.log('New book ID:', result.insertId);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await connection.end();
  }
}

addBook();
```
</details>

<details>
<summary>פתרון תרגיל 5: הצגת ספרים</summary>

```javascript
import mysql from 'mysql2/promise';
import 'dotenv/config';

async function showAllBooks() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'books_db'
  });

  try {
    const [books] = await connection.query('SELECT * FROM books');
    
    console.log('📚 Our Books:');
    console.log('================');
    
    books.forEach(book => {
      console.log(`ID: ${book.id}`);
      console.log(`Title: ${book.title}`);
      console.log(`Pages: ${book.pages}`);
      console.log('----------------');
    });
    
    console.log(`Total: ${books.length} books`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await connection.end();
  }
}

showAllBooks();
```
</details>

<details>
<summary>פתרון תרגיל 6: הוספת ספרים מרובים</summary>

```javascript
import mysql from 'mysql2/promise';
import 'dotenv/config';

async function addManyBooks() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'books_db'
  });

  try {
    const books = [
      { title: 'Alice in Wonderland', pages: 150 },
      { title: 'The Little Prince', pages: 100 },
      { title: 'Moby Dick', pages: 500 }
    ];
    
    for (const book of books) {
      await connection.query(
        'INSERT INTO books (title, pages) VALUES (?, ?)',
        [book.title, book.pages]
      );
      console.log(`✅ Added: ${book.title}`);
    }
    
    console.log('\n🎉 All books added successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await connection.end();
  }
}

addManyBooks();
```
</details>

<details>
<summary>פתרון תרגיל 7: חיפוש ספרים</summary>

```javascript
import mysql from 'mysql2/promise';
import 'dotenv/config';

async function searchBooks() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'books_db'
  });

  try {
    console.log('🔍 Searching for "The Little Prince":');
    const [book1] = await connection.query(
      'SELECT * FROM books WHERE title = ?',
      ['The Little Prince']
    );
    console.log(book1);
    console.log('');
    
    console.log('🔍 Books with more than 200 pages:');
    const [book2] = await connection.query(
      'SELECT * FROM books WHERE pages > ?',
      [200]
    );
    console.log(book2);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await connection.end();
  }
}

searchBooks();
```
</details>

<details>
<summary>פתרון תרגיל 8: עדכון ספר</summary>

```javascript
import mysql from 'mysql2/promise';
import 'dotenv/config';

async function updateBook() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'books_db'
  });

  try {
    const bookId = 1;
    const newPages = 350;
    
    const [result] = await connection.query(
      'UPDATE books SET pages = ? WHERE id = ?',
      [newPages, bookId]
    );
    
    console.log('✅ Book updated!');
    console.log('Rows affected:', result.affectedRows);
    
    const [updated] = await connection.query(
      'SELECT * FROM books WHERE id = ?',
      [bookId]
    );
    
    console.log('\n📖 Updated book:');
    console.log(updated[0]);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await connection.end();
  }
}

updateBook();
```
</details>

<details>
<summary>פתרון תרגיל 9: מחיקת ספר</summary>

```javascript
import mysql from 'mysql2/promise';
import 'dotenv/config';

async function deleteBook() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'books_db'
  });

  try {
    const bookId = 2;
    
    const [before] = await connection.query(
      'SELECT * FROM books WHERE id = ?',
      [bookId]
    );
    
    console.log('🗑️ Book to delete:');
    console.log(before[0]);
    console.log('');
    
    const [result] = await connection.query(
      'DELETE FROM books WHERE id = ?',
      [bookId]
    );
    
    console.log('✅ Book deleted successfully!');
    console.log('Rows deleted:', result.affectedRows);
    
    const [after] = await connection.query(
      'SELECT * FROM books WHERE id = ?',
      [bookId]
    );

    if (after.length === 0) {
      console.log('✅ Verified: Book is gone!');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await connection.end();
  }
}

deleteBook();
```
</details>

<details>
<summary>פתרון תרגיל 10: ספירת ספרים</summary>

```javascript
import mysql from 'mysql2/promise';
import 'dotenv/config';

async function countBooks() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'books_db'
  });

  try {
    const [result1] = await connection.query(
      'SELECT COUNT(*) as total FROM books'
    );
    console.log(`📚 Total books: ${result1[0].total}`);
    
    const [result2] = await connection.query(
      'SELECT COUNT(*) as total FROM books WHERE pages > 200'
    );
    console.log(`📖 Books with 200+ pages: ${result2[0].total}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await connection.end();
  }
}

countBooks();
```
</details>

<details>
<summary>פתרון תרגיל בונוס: CRUD מלא</summary>

```javascript
import mysql from 'mysql2/promise';
import 'dotenv/config';

async function completeCRUD() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'books_db'
  });

  try {
    // CREATE
    console.log('1️⃣ Adding new book...');
    const [insertResult] = await connection.query(
      'INSERT INTO books (title, pages) VALUES (?, ?)',
      ['Test Book', 250]
    );
    const newId = insertResult.insertId;
    console.log(`✅ Book added with ID: ${newId}\n`);

    // READ
    console.log('2️⃣ Reading the new book...');
    const [books] = await connection.query(
      'SELECT * FROM books WHERE id = ?',
      [newId]
    );
    console.log('✅ Book:', books[0]);
    console.log('');

    // UPDATE
    console.log('3️⃣ Updating the book...');
    await connection.query(
      'UPDATE books SET pages = ? WHERE id = ?',
      [300, newId]
    );
    console.log('✅ Book updated\n');

    // READ again
    console.log('4️⃣ Reading again after update...');
    const [updated] = await connection.query(
      'SELECT * FROM books WHERE id = ?',
      [newId]
    );
    console.log('✅ Updated book:', updated[0]);
    console.log('');

    // DELETE
    console.log('5️⃣ Deleting the book...');
    await connection.query(
      'DELETE FROM books WHERE id = ?',
      [newId]
    );
    console.log('✅ Book deleted\n');

    // VERIFY
    console.log('6️⃣ Verifying deletion...');
    const [check] = await connection.query(
      'SELECT * FROM books WHERE id = ?',
      [newId]
    );
    if (check.length === 0) {
      console.log('✅ Book successfully deleted!');
    }

    console.log('\n🎉 Completed all CRUD operations!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await connection.end();
  }
}

completeCRUD();
```
</details>

---

**בהצלחה! 🚀**
