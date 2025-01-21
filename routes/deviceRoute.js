const express = require('express');
const Device = require('../models/device'); // Adjust the path to your Device model
const verifyToken = require('../middlewares/verifyToken'); 
const router = express.Router();

router.get('/devices', verifyToken, async (req, res) => {
    try {
      const userId = req.user.id;
      const devices = await Device.find({ userId });
  
      if (!devices || devices.length === 0) {
        return res.status(404).json({ message: 'No devices found' });
      }
  
      res.json(devices);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching devices', error: err.message });
    }
  });
  
// Logout From Device Route
router.post('/logout-device', verifyToken, async (req, res) => {
    try {
      const { deviceId } = req.body;
      const userId = req.user.id;
  
      // Remove the device session
      const result = await Device.findOneAndDelete({ userId, deviceId });
      if (!result) {
        return res.status(404).json({ message: 'Device not found or already logged out' });
      }
  
      res.json({ message: 'Logged out from device successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Error logging out from device', error: err.message });
    }
  });

module.exports = router;
