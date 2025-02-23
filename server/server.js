const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const morgan = require('morgan'); // Logs HTTP requests
const authRoutes = require('./routes/auth');
const jobSeekerRoutes = require('./routes/jobSeekers'); // Add job seeker routes
const jobOfferRoutes = require('./routes/jobOffers'); // Add job offer routes
const contactRequestRoutes = require('./routes/contactRequests'); // Add contact request routes
const { connect } = require('./config/database');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));  // Parses URL-encoded data
app.use(cookieParser());
app.use(cors());
//app.use(express.json());
app.use(morgan('dev')); // Logs requests for debugging

// Connect to MongoDB
connect();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobSeekers', jobSeekerRoutes);
app.use('/api/jobOffers', jobOfferRoutes);
app.use('/api/contactRequests', contactRequestRoutes);

// Test Route
app.get('/', (req, res) => {
  res.send(`<h1>Welcome to the Job Portal API</h1>`);
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
