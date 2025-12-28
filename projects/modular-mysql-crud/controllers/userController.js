// User Controller - Business logic
// בקר המשתמש - לוגיקה עסקית

import User from '../models/userModel.js';

// קבלת כל המשתמשים
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.getAll();
    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (err) {
    console.error('שגיאה בקבלת משתמשים:', err);
    res.status(500).json({ 
      success: false,
      error: 'שגיאה בשרת' 
    });
  }
};

// קבלת משתמש לפי ID
export const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.getById(id);

    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: 'משתמש לא נמצא' 
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (err) {
    console.error('שגיאה בקבלת משתמש:', err);
    res.status(500).json({ 
      success: false,
      error: 'שגיאה בשרת' 
    });
  }
};

// יצירת משתמש חדש
export const createUser = async (req, res) => {
  const { name, email, age } = req.body;

  // ולידציה - מטופל ב-middleware
  try {
    const userId = await User.create({ name, email, age });
    const newUser = await User.getById(userId);

    res.status(201).json({
      success: true,
      message: 'משתמש נוסף בהצלחה',
      data: newUser
    });
  } catch (err) {
    console.error('שגיאה בהוספת משתמש:', err);

    // טיפול בשגיאת אימייל כפול
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ 
        success: false,
        error: 'אימייל כבר קיים במערכת' 
      });
    }

    res.status(500).json({ 
      success: false,
      error: 'שגיאה בשרת' 
    });
  }
};

// עדכון משתמש
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, age } = req.body;

  // ולידציה - מטופל ב-middleware
  try {
    const updated = await User.update(id, { name, email, age });

    if (!updated) {
      return res.status(404).json({ 
        success: false,
        error: 'משתמש לא נמצא' 
      });
    }

    const updatedUser = await User.getById(id);

    res.json({
      success: true,
      message: 'משתמש עודכן בהצלחה',
      data: updatedUser
    });
  } catch (err) {
    console.error('שגיאה בעדכון משתמש:', err);

    // טיפול בשגיאת אימייל כפול
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ 
        success: false,
        error: 'אימייל כבר קיים במערכת' 
      });
    }

    res.status(500).json({ 
      success: false,
      error: 'שגיאה בשרת' 
    });
  }
};

// מחיקת משתמש
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    // קבלת המשתמש לפני המחיקה
    const user = await User.getById(id);

    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: 'משתמש לא נמצא' 
      });
    }

    // מחיקת המשתמש
    await User.delete(id);

    res.json({
      success: true,
      message: 'משתמש נמחק בהצלחה',
      data: user
    });
  } catch (err) {
    console.error('שגיאה במחיקת משתמש:', err);
    res.status(500).json({ 
      success: false,
      error: 'שגיאה בשרת' 
    });
  }
};

// סטטיסטיקות
export const getUserStats = async (req, res) => {
  try {
    const stats = await User.getStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (err) {
    console.error('שגיאה בקבלת סטטיסטיקות:', err);
    res.status(500).json({ 
      success: false,
      error: 'שגיאה בשרת' 
    });
  }
};
