const express = require('express');
const cors = require('cors');
require('dotenv').config(); // For environment variables

const User = require('./models/user');
const connectDB = require('./config/db');
const registrationRoute = require('./routes/registrationRoute');
const loginRoute = require('./routes/loginRoute'); 
const verifyToken = require('./middlewares/verifyToken'); 
const deviceRoute = require('./routes/deviceRoute'); 
const profileRoute = require('./routes/profileRoute'); 

const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow Bearer token in the Authorization header
  exposedHeaders: ['Authorization'], // Ensure the browser can access the header if needed
}));

connectDB();

app.use('/', registrationRoute); // Mount registration route

app.use('/', loginRoute); // Mount the login route

app.use('/', deviceRoute); // Mount device routes

app.use('/', profileRoute); // Mount profile routes

// Start the Express server
app.listen(5000, () => console.log('Server running on port 5000'));
