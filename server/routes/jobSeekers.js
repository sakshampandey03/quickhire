const express = require('express');
const router = express.Router();
const jobSeekerController = require('../controllers/jobSeekerController');
const { protect, isJobSeeker } = require('../middleware/jobSeekerMiddleware');

// 📌 Create a new job seeker post (Only authenticated job seekers)
router.post('/', protect, isJobSeeker, jobSeekerController.createJobSeekerPost);

// 📌 Get all job seeker posts (Public)
router.get('/', jobSeekerController.getAllJobSeekerPosts);

// 📌 Get a single job seeker post by ID (Public)
router.get('/:id', jobSeekerController.getJobSeekerPostById);

// 📌 Update a job seeker post (Only the job seeker)
router.put('/:id', protect, isJobSeeker, jobSeekerController.updateJobSeekerPost);

// 📌 Delete a job seeker post (Only the job seeker)
router.delete('/:id', protect, isJobSeeker, jobSeekerController.deleteJobSeekerPost);

module.exports = router;
