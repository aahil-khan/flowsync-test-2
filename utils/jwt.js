const jwt = require('jsonwebtoken');
const TokenBlacklist = require('../models/TokenBlacklist');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';
const ACCESS_TOKEN_EXPIRY = '15m'; // 15 minutes
const REFRESH_TOKEN_EXPIRY = '7d'; // 7 days

const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

const revokeToken = async (token, userId, reason = 'logout') => {
  try {
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) {
      throw new Error('Invalid token format');
    }
    
    const blacklist = new TokenBlacklist({
      token,
      userId,
      expiresAt: new Date(decoded.exp * 1000),
      reason
    });
    
    await blacklist.save();
    return true;
  } catch (error) {
    console.error('Token revocation failed:', error.message);
    return false;
  }
};

const isTokenRevoked = async (token) => {
  try {
    const blacklisted = await TokenBlacklist.findOne({ token });
    return !!blacklisted;
  } catch (error) {
    console.error('Blacklist check failed:', error.message);
    return false;
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  revokeToken,
  isTokenRevoked
};
