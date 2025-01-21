require('dotenv').config(); 

const jwtSecret = process.env.JWT_SECRET || 'fallbackSecret';

module.exports = jwtSecret;
