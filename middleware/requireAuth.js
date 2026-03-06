const { verifyToken, isTokenRevoked } = require('../utils/jwt');

module.exports = async function requireAuth(req, res, next) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    
    // Check if token is revoked
    const revoked = await isTokenRevoked(token);
    if (revoked) {
      return res.status(401).json({ error: 'Token has been revoked' });
    }
    
    req.userId = decoded.userId;
    req.token = token;
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
