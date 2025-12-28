// Validation Middleware
// Middleware לוולידציה

// וולידציה ליצירה/עדכון משתמש
export const validateUser = (req, res, next) => {
  const { name, email, age } = req.body;

  // בדיקת שדות חובה
  if (!name || !email) {
    return res.status(400).json({ 
      success: false,
      error: 'שם ואימייל הם שדות חובה' 
    });
  }

  // בדיקת אימייל תקין
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      success: false,
      error: 'אימייל לא תקין' 
    });
  }

  // בדיקת גיל תקין
  if (age !== undefined && age !== null && age !== '') {
    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 0 || ageNum > 150) {
      return res.status(400).json({ 
        success: false,
        error: 'גיל לא תקין (0-150)' 
      });
    }
  }

  next();
};

// וולידציה ל-ID
export const validateId = (req, res, next) => {
  const { id } = req.params;
  
  if (!id || isNaN(id) || parseInt(id) <= 0) {
    return res.status(400).json({ 
      success: false,
      error: 'ID לא תקין' 
    });
  }

  next();
};
