const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ContactRequest = require('../models/ContactRequest');
const JobOfferPost = require('../models/JobOfferPost');

//  Middleware to verify JWT token from cookies
exports.protect = async (req, res, next) => {
  try {
    const token = req.cookies.token; // Token is stored in cookies

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Middleware to check if the user is the **Job Offer Poster**
exports.isJobPoster = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contactRequest = await ContactRequest.findById(id).populate('jobOffer');

    if (!contactRequest) {
      return res.status(404).json({ message: 'Contact request not found' });
    }

    const jobOffer = await JobOfferPost.findById(contactRequest.jobOffer._id);

    if (!jobOffer || jobOffer.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to modify this request' });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Middleware to check if the user is the **Job Seeker who requested contact**
exports.isJobSeeker = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contactRequest = await ContactRequest.findById(id);

    if (!contactRequest) {
      return res.status(404).json({ message: 'Contact request not found' });
    }

    if (contactRequest.seeker.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this request' });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
