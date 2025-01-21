const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); 
const Device = require('../models/device'); 

const router = express.Router();

// Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const ipAddress = req.ip;
    console.log('Detected IP Address:', ipAddress);

    // Generate a unique device identifier based on email and user agent address
    const deviceId = `${email}` + req.headers['user-agent'];
    console.log('Generated Device ID:', deviceId);

    // Generate a unique JWT token for this session
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'defaultSecret',
      { expiresIn: '1h' }
    );

    // Check if the device already exists in the database
    const existingDevice = await Device.findOne({ userId: user._id, deviceId });

    if (existingDevice) {
      console.log('Device found, updating token and lastLogin');
      // If the device exists, update the token and last login time
      existingDevice.token = token;
      existingDevice.lastLogin = new Date();
      await existingDevice.save();
      return res.json({ token, message: 'Login successful, existing device updated' });
    }

    console.log('No existing device found, creating new device');
    // If device does not exist, create a new device entry
    const deviceDetails = {
      deviceId,
      userAgent: req.headers['user-agent'],
      ipAddress,
      userId: user._id,
      token,
    };

    const newDevice = new Device(deviceDetails);
    await newDevice.save();

    res.json({ token, message: 'Login successful, new device added' });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
});

module.exports = router;
