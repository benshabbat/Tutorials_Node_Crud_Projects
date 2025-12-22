// 🚀 שרת פשוט עם Express ו-File System
// דוגמה מעשית לעבודה עם קבצים

import express from 'express';
import fs from 'fs/promises';

const app = express();
const PORT = 3000;

// Middleware לקריאת JSON
app.use(express.json());

// 📄 דף הבית - הסבר על השרת
app.get('/', (req, res) => {
  res.send(`
    <h1>🎉 שרת Node.js עם File System</h1>
    <h2>נתיבים זמינים:</h2>
    <ul>
      <li><a href="/read">📖 קריאת קובץ - GET /read</a></li>
      <li>✍️ כתיבה לקובץ - POST /write (שלח JSON עם "content")</li>
      <li><a href="/list">📂 רשימת קבצים - GET /list</a></li>
      <li>🗑️ מחיקת קובץ - DELETE /delete/:filename</li>
    </ul>
    <h3>איך להתחיל?</h3>
    <ol>
      <li>לחץ על "קריאת קובץ" כדי ליצור קובץ אוטומטית</li>
      <li>שלח POST ל-/write כדי לכתוב תוכן חדש</li>
      <li>ראה את כל הקבצים ב-/list</li>
    </ol>
  `);
});

// 📖 קריאת קובץ
app.get('/read', async (req, res) => {
  try {
    // ננסה לקרוא את הקובץ
    const content = await fs.readFile('example.txt', 'utf-8');
    res.json({
      success: true,
      message: 'הקובץ נקרא בהצלחה',
      content: content,
      timestamp: new Date().toLocaleString('he-IL')
    });
  } catch (error) {
    // אם הקובץ לא קיים, ניצור אותו
    if (error.code === 'ENOENT') {
      const initialContent = 'ברוך הבא! זה קובץ הדוגמה שלך.\nנוצר ב-' + new Date().toLocaleString('he-IL');
      await fs.writeFile('example.txt', initialContent);
      res.json({
        success: true,
        message: 'קובץ חדש נוצר!',
        content: initialContent
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'שגיאה בקריאת הקובץ',
        error: error.message
      });
    }
  }
});

// ✍️ כתיבה לקובץ
app.post('/write', async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'חובה לספק תוכן לכתיבה'
      });
    }
    
    const fullContent = `${content}\n[נכתב ב-${new Date().toLocaleString('he-IL')}]`;
    await fs.writeFile('example.txt', fullContent);
    
    res.json({
      success: true,
      message: 'התוכן נכתב בהצלחה!',
      content: fullContent
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'שגיאה בכתיבת הקובץ',
      error: error.message
    });
  }
});

// 📝 הוספה לקובץ קיים
app.post('/append', async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'חובה לספק תוכן להוספה'
      });
    }
    
    const appendContent = `\n${content} [${new Date().toLocaleString('he-IL')}]`;
    await fs.appendFile('example.txt', appendContent);
    
    res.json({
      success: true,
      message: 'התוכן נוסף בהצלחה!'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'שגיאה בהוספת תוכן',
      error: error.message
    });
  }
});

// 📂 רשימת כל הקבצים בתיקייה
app.get('/list', async (req, res) => {
  try {
    const files = await fs.readdir('.');
    
    // נסנן רק קבצי טקסט וJSON
    const filteredFiles = files.filter(file => 
      file.endsWith('.txt') || 
      file.endsWith('.json') || 
      file.endsWith('.md')
    );
    
    // נקבל מידע מפורט על כל קובץ
    const filesWithInfo = await Promise.all(
      filteredFiles.map(async (file) => {
        const stats = await fs.stat(file);
        return {
          name: file,
          size: `${stats.size} bytes`,
          modified: stats.mtime.toLocaleString('he-IL'),
          isFile: stats.isFile()
        };
      })
    );
    
    res.json({
      success: true,
      count: filesWithInfo.length,
      files: filesWithInfo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'שגיאה בקריאת הקבצים',
      error: error.message
    });
  }
});

// 🗑️ מחיקת קובץ
app.delete('/delete/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    
    // בטיחות: נוודא שלא מוחקים קבצים חשובים
    const protectedFiles = ['server.js', 'package.json', 'simple-fs-server.js'];
    if (protectedFiles.includes(filename)) {
      return res.status(403).json({
        success: false,
        message: 'לא ניתן למחוק קובץ זה'
      });
    }
    
    await fs.unlink(filename);
    
    res.json({
      success: true,
      message: `הקובץ ${filename} נמחק בהצלחה`
    });
  } catch (error) {
    if (error.code === 'ENOENT') {
      res.status(404).json({
        success: false,
        message: 'הקובץ לא נמצא'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'שגיאה במחיקת הקובץ',
        error: error.message
      });
    }
  }
});

// 📊 מידע על קובץ ספציפי
app.get('/info/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const stats = await fs.stat(filename);
    
    res.json({
      success: true,
      info: {
        name: filename,
        size: stats.size,
        sizeKB: (stats.size / 1024).toFixed(2),
        created: stats.birthtime.toLocaleString('he-IL'),
        modified: stats.mtime.toLocaleString('he-IL'),
        isFile: stats.isFile(),
        isDirectory: stats.isDirectory()
      }
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: 'הקובץ לא נמצא'
    });
  }
});

// הפעלת השרת
app.listen(PORT, () => {
  console.log('\n🎉 השרת הופעל בהצלחה!');
  console.log(`🌐 כתובת: http://localhost:${PORT}`);
  console.log('\n📚 נתיבים זמינים:');
  console.log('   GET    /           - דף הבית');
  console.log('   GET    /read       - קריאת קובץ');
  console.log('   POST   /write      - כתיבת קובץ');
  console.log('   POST   /append     - הוספה לקובץ');
  console.log('   GET    /list       - רשימת קבצים');
  console.log('   DELETE /delete/:id - מחיקת קובץ');
  console.log('   GET    /info/:id   - מידע על קובץ');
  console.log('\n💡 טיפ: פתח דפדפן וגש ל-http://localhost:3000');
  console.log('');
});
