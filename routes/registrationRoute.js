const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/user'); 
const jwtSecret = require('../config/jwt'); // Import the JWT secret
const router = express.Router();

require('dotenv').config(); 

// Setup nodemailer for sending emails
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use your email service (e.g., Gmail, SendGrid)
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Helper function to send verification email
const sendVerificationEmail = (email, token) => {
  const verificationUrl = `http://localhost:5000/verify-email/${token}`;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Email Verification',
    text: `Please verify your email by clicking on the following link: ${verificationUrl}`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log('Error sending email:', err);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

// Registration Route
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    const emailVerificationToken = jwt.sign(
      { email },
      jwtSecret,
      { expiresIn: '1h' }
    );

    // sendVerificationEmail(email, emailVerificationToken);

    res.json({ message: 'User registered successfully. Please verify your email.' });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
});

module.exports = router;
