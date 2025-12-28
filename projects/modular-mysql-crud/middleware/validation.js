// Validation Middleware
// Validation middleware

// Validation for create/update user
export const validateUser = (req, res, next) => {
  const { name, email, age } = req.body;

  // Check required fields
  if (!name || !email) {
    return res.status(400).json({ 
      success: false,
      error: 'Name and email are required' 
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      success: false,
      error: 'Invalid email format' 
    });
  }

  // Validate age
  if (age !== undefined && age !== null && age !== '') {
    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 0 || ageNum > 150) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid age (0-150)' 
      });
    }
  }

  next();
};

// Validation for ID
export const validateId = (req, res, next) => {
  const { id } = req.params;
  
  if (!id || isNaN(id) || parseInt(id) <= 0) {
    return res.status(400).json({ 
      success: false,
      error: 'Invalid ID' 
    });
  }

  next();
};
