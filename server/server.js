const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const contactInfoRoutes = require('./routes/contactinfo');
const cookieParser = require('cookie-parser');
// const userRoutes = require('./routes/user');
const { connect } = require('./config/database');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// Connect to MongoDB
connect();
// Routes
app.use('/api/auth/', authRoutes);
app.use('/api/contact-info/', contactInfoRoutes);
// app.use('/api/user/', userRoutes);
app.get('/', (req, res) => {
  res.send(`<h1>Hello World!</h1>`);
});
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});