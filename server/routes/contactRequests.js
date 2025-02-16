const express = require('express');
const router = express.Router();
const {
  createContactRequest,
  getAllContactRequests,
  getContactRequestById,
  updateContactRequestStatus,
  deleteContactRequest
} = require('../controllers/contactRequestController');

const { protect, isJobPoster, isJobSeeker } = require('../middleware/contactRequestMiddleware');

// Create a new contact request (Job Seeker requests contact)
router.post('/', protect, createContactRequest);

// Get all contact requests (Only authenticated users)
router.get('/', protect, getAllContactRequests);

// Get a single contact request by ID
router.get('/:id', protect, getContactRequestById);

// Update contact request status (Only Job Poster can approve/reject)
router.put('/:id', protect, isJobPoster, updateContactRequestStatus);

// Delete contact request (Only the Job Seeker who created it can delete)
router.delete('/:id', protect, isJobSeeker, deleteContactRequest);

module.exports = router;
