const express = require('express');
const verifyToken = require('../middlewares/verifyToken');
const User = require('../models/user');

const router = express.Router();

// Protected Profile Route
router.get('/profile', verifyToken, async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('-password'); 
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json({
        message: 'Protected profile data',
        username: user.username,
        email: user.email,
      });
    } catch (err) {
      res.status(500).json({ message: 'Error fetching profile data', error: err.message });
    }
  });
  
  // Update Profile Route
router.put('/profile', verifyToken, async (req, res) => {
    try {
      const { username, email } = req.body;
      const user = await User.findById(req.user.id); // Find the user by the decoded ID in the token
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Update the user fields
      if (username) user.username = username;
      if (email) user.email = email;
  
      // Save the updated user
      await user.save();
  
      res.json({
        message: 'Profile updated successfully',
        username: user.username,
        email: user.email,
      });
    } catch (err) {
      res.status(500).json({ message: 'Error updating profile', error: err.message });
    }
  });

module.exports = router;
