const express = require('express');
const { signup, login, logout, sendOtp } = require('../controllers/Auth');
const { changePassword } = require('../controllers/Auth');
const { auth } = require('../middlewares/Auth');
const router = express.Router();


// Register route
router.post('/signup', signup);

// Login route
router.post('/login', login);

// Logout route
router.post('/logout', logout);

// check the middle ware in case of error
router.post('/reset-password', auth, changePassword);

router.post('/sendotp', sendOtp);

module.exports = router;