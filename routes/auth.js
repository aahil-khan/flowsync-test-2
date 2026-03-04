const express = require('express');
const router = express.Router();
const crypto = require('crypto');

const users = new Map();

router.post('/register', (req, res) => {
  const { username, password } = req.body;
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  users.set(username, { salt, hash });
  res.status(201).json({ message: 'User registered' });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.get(username);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const hash = crypto.scryptSync(password, user.salt, 64).toString('hex');
  if (hash !== user.hash) return res.status(401).json({ error: 'Invalid credentials' });
  res.json({ token: crypto.randomBytes(32).toString('hex') });
});

module.exports = router;
