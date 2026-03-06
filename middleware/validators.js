const { validateUsername, validatePassword } = require('../utils/validation');

const validateRegister = (req, res, next) => {
  const { username, password } = req.body;
  
  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }
  
  if (!validateUsername(username)) {
    return res.status(400).json({ 
      error: 'Username must be 3-20 alphanumeric characters (underscore allowed)' 
    });
  }
  
  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }
  
  if (!validatePassword(password)) {
    return res.status(400).json({ 
      error: 'Password must be 8+ chars with uppercase, lowercase, number, and special char' 
    });
  }
  
  next();
};

const validateLogin = (req, res, next) => {
  const { username, password } = req.body;
  
  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }
  
  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }
  
  next();
};

const validateTaskCreate = (req, res, next) => {
  const { title } = req.body;
  
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  
  if (typeof title !== 'string' || title.trim().length === 0) {
    return res.status(400).json({ error: 'Title must be a non-empty string' });
  }
  
  if (title.length > 200) {
    return res.status(400).json({ error: 'Title must be 200 characters or less' });
  }
  
  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateTaskCreate
};
