const jwt = require('jsonwebtoken');
const Device = require('../models/device');
const jwtSecret = require('../config/jwt');

const verifyToken = async (req, res, next) => {
  const token = req.header('Authorization') && req.header('Authorization').split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied, token missing' });
  }
  try {
    const decoded = jwt.verify(token, jwtSecret);

    // Verify the token exists in the Device collection
    const device = await Device.findOne({ userId: decoded.id, token });
    if (!device) {
      return res.status(401).json({ message: 'Invalid token or session expired' });
    }

    req.user = decoded;
    next();
  } catch (err) {
    console.log("catch")
    return res.status(400).json({ message: 'Invalid token' });
  }
};

module.exports = verifyToken;
