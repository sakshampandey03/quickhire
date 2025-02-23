const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify user authentication 
exports.protect = async (req, res, next) => {
  const token = req.cookies?.token; // Extract token from cookies

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password'); // Attach user to request
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, invalid token' });
  }
};

//Middleware to verify job offer ownership
exports.verifyJobOfferOwner = async (req, res, next) => {
  const JobOfferPost = require('../models/JobOfferPost');

  try {
    const jobOffer = await JobOfferPost.findById(req.params.id);
    
    if (!jobOffer) {
      return res.status(404).json({ message: 'Job offer not found' });
    }

    if (jobOffer.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to modify this job offer' });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
