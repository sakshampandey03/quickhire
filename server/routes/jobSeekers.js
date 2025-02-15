import express from 'express';
import auth from '../middleware/auth.js';
import JobSeekerPost from '../models/JobSeekerPost.js';

const router = express.Router();

// @route   POST /api/job-seekers
router.post('/', auth, checkRole('seeker'), async (req, res) => {
  const { title, description, expectedSalary, experienceYears, desiredLocation } = req.body;

  try {
    const newPost = new JobSeekerPost({
      user: req.user.id,
      title,
      description,
      expectedSalary,
      experienceYears,
      desiredLocation
    });

    const post = await newPost.save();
    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/job-seekers
router.get('/', async (req, res) => {
  try {
    const posts = await JobSeekerPost.find().populate('user', ['name', 'email', 'profile']);
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

export default router;