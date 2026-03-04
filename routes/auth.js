const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwt');
const { validateRegister, validateLogin } = require('../middleware/validators');

router.post('/register', validateRegister, async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.scryptSync(password, salt, 64).toString('hex');
    
    const user = new User({ username, salt, hash });
    await user.save();
    
    res.status(201).json({ message: 'User registered', userId: user._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/login', validateLogin, async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const hash = crypto.scryptSync(password, user.salt, 64).toString('hex');
    if (hash !== user.hash) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    
    res.json({ 
      accessToken, 
      refreshToken, 
      userId: user._id,
      tokenType: 'Bearer'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token required' });
    }
    
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET || 'dev-secret-key');
    const accessToken = generateAccessToken(decoded.userId);
    
    res.json({ accessToken, tokenType: 'Bearer' });
  } catch (error) {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
});

module.exports = router;
