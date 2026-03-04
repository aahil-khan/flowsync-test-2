const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const User = require('../models/User');
const Session = require('../models/Session');

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Check if user exists
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

router.post('/login', async (req, res) => {
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
    
    // Generate and store token in session
    const token = crypto.randomBytes(32).toString('hex');
    const session = new Session({ userId: user._id, token });
    await session.save();
    
    res.json({ token, userId: user._id, expiresAt: session.expiresAt });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
