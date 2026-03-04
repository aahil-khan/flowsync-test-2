const Session = require('../models/Session');

module.exports = async function requireAuth(req, res, next) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    // Verify token against stored sessions
    const session = await Session.findOne({ token, isValid: true });
    if (!session) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    
    // Check if token has expired
    if (new Date() > session.expiresAt) {
      session.isValid = false;
      await session.save();
      return res.status(401).json({ error: 'Token expired' });
    }
    
    req.userId = session.userId;
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
