const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to check if the user is authenticated
exports.protect = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);

        if (!req.user) {
            return res.status(401).json({ success: false, message: "Unauthorized: User not found" });
        }

        next();
    } catch (error) {
        console.error("Error in authentication middleware", error);
        return res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
    }
};

// Middleware to check if the user is a job seeker
exports.isJobSeeker = (req, res, next) => {
    if (req.user && req.user.role === 'jobSeeker') {
        next();
    } else {
        return res.status(403).json({ success: false, message: "Forbidden: Only job seekers are allowed" });
    }
};
