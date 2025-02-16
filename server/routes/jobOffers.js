const express = require('express');
const router = express.Router();
const { protect, verifyJobOfferOwner } = require('../middleware/jobOfferMiddleware');
const {
  createJobOfferPost,
  getAllJobOfferPosts,
  getJobOfferPostById,
  updateJobOfferPost,
  deleteJobOfferPost
} = require('../controllers/jobOfferController');

// Create a new job offer (Only authenticated users)
router.post('/', protect, createJobOfferPost);

// Get all job offers (Public)
router.get('/', getAllJobOfferPosts);

// Get a specific job offer by ID (Public)
router.get('/:id', getJobOfferPostById);

// Update a job offer (Only the owner)
router.put('/:id', protect, verifyJobOfferOwner, updateJobOfferPost);

// Delete a job offer (Only the owner)
router.delete('/:id', protect, verifyJobOfferOwner, deleteJobOfferPost);

module.exports = router;
