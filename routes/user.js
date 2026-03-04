const express = require('express');
const router = express.Router();
const User = require('../models/User');
const requireAuth = require('../middleware/requireAuth');
const { createRateLimitMiddleware, LIMITS } = require('../middleware/rateLimit');

// Get current user profile
router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-salt -hash');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      id: user._id,
      username: user.username,
      profile: user.profile,
      preferences: user.preferences,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user profile
router.patch('/me', requireAuth, async (req, res) => {
  try {
    const { firstName, lastName, email, bio, theme, emailNotifications } = req.body;
    
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Update profile fields
    if (firstName !== undefined) user.profile.firstName = firstName;
    if (lastName !== undefined) user.profile.lastName = lastName;
    if (email !== undefined) user.profile.email = email;
    if (bio !== undefined) {
      if (bio.length > 500) {
        return res.status(400).json({ error: 'Bio must be 500 characters or less' });
      }
      user.profile.bio = bio;
    }
    
    // Update preferences
    if (theme !== undefined) {
      if (!['light', 'dark'].includes(theme)) {
        return res.status(400).json({ error: 'Invalid theme' });
      }
      user.preferences.theme = theme;
    }
    if (emailNotifications !== undefined) {
      user.preferences.emailNotifications = emailNotifications;
    }
    
    await user.save();
    
    res.json({
      message: 'Profile updated successfully',
      profile: user.profile,
      preferences: user.preferences
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get public user profile by username
router.get('/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select('-salt -hash -preferences');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      id: user._id,
      username: user.username,
      profile: user.profile,
      createdAt: user.createdAt
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update last login timestamp
router.post('/activity/login', requireAuth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.userId,
      { lastLogin: new Date() },
      { new: true }
    ).select('username lastLogin');
    
    res.json({ lastLogin: user.lastLogin });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
