const express = require('express');
const router = express.Router();
const jobSeekerController = require('../controllers/jobSeekerController');
const { protect, isJobSeeker } = require('../middlewares/jobSeekerMiddleware');

// 📌 Create a new job seeker post (Only authenticated job seekers)
router.post('/job-seekers', protect, isJobSeeker, jobSeekerController.createJobSeekerPost);

// 📌 Get all job seeker posts (Public)
router.get('/job-seekers', jobSeekerController.getAllJobSeekerPosts);

// 📌 Get a single job seeker post by ID (Public)
router.get('/job-seekers/:id', jobSeekerController.getJobSeekerPostById);

// 📌 Update a job seeker post (Only the job seeker who created it)
router.put('/job-seekers/:id', protect, isJobSeeker, jobSeekerController.updateJobSeekerPost);

// 📌 Delete a job seeker post (Only the job seeker who created it)
router.delete('/job-seekers/:id', protect, isJobSeeker, jobSeekerController.deleteJobSeekerPost);

module.exports = router;
