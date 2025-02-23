const express = require('express');
const { signup, login, logout, sendOtp } = require('../controllers/Auth');
const { changePassword } = require('../controllers/Auth');

const router = express.Router();


// Register route
router.post('/signup', signup);

// Login route
router.post('/login', login);

// Logout route
router.post('/logout', logout);

router.post('/reset-password', changePassword);

router.post('/sendotp', sendOtp);

module.exports = router;