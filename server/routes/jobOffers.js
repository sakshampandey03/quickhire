const express = require('express');
const router = express.Router();
const { protect, verifyJobOfferOwner } = require('../middlewares/jobOfferMiddleware');
const {
  createJobOfferPost,
  getAllJobOfferPosts,
  getJobOfferPostById,
  updateJobOfferPost,
  deleteJobOfferPost
} = require('../controllers/jobOfferController');

// Create a new job offer (Only authenticated users)
router.post('/job-offers', protect, createJobOfferPost);

// Get all job offers (Public)
router.get('/job-offers', getAllJobOfferPosts);

// Get a specific job offer by ID (Public)
router.get('/job-offers/:id', getJobOfferPostById);

// Update a job offer (Only the owner)
router.put('/job-offers/:id', protect, verifyJobOfferOwner, updateJobOfferPost);

// Delete a job offer (Only the owner)
router.delete('/job-offers/:id', protect, verifyJobOfferOwner, deleteJobOfferPost);

module.exports = router;
