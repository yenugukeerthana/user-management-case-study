const mongoose = require('mongoose');

const DeviceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  deviceId: { type: String, required: true },  // Unique ID for the device (could be a combination of device details)
  userAgent: { type: String, required: true }, // Store User Agent for device identification
  ipAddress: { type: String, required: true },  // IP Address of the device
  lastLogin: { type: Date, default: Date.now }, //Track last login time
  token: { type: String, required: true }, // Store the JWT token
});

const Device = mongoose.model('Device', DeviceSchema);

module.exports = Device;
