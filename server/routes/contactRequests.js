const express = require('express');
const router = express.Router();
const {
  createContactRequest,
  getAllContactRequests,
  getContactRequestById,
  updateContactRequestStatus,
  deleteContactRequest
} = require('../controllers/contactRequestController');

const { protect, isJobPoster, isJobSeeker } = require('../middlewares/contactRequestMiddleware');

// Create a new contact request (Job Seeker requests contact)
router.post('/contact-requests', protect, createContactRequest);

// Get all contact requests (Only authenticated users)
router.get('/contact-requests', protect, getAllContactRequests);

// Get a single contact request by ID
router.get('/contact-requests/:id', protect, getContactRequestById);

// Update contact request status (Only Job Poster can approve/reject)
router.put('/contact-requests/:id/status', protect, isJobPoster, updateContactRequestStatus);

// Delete contact request (Only the Job Seeker who created it can delete)
router.delete('/contact-requests/:id', protect, isJobSeeker, deleteContactRequest);

module.exports = router;
