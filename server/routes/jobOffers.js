import express from 'express';
import auth from '../middleware/auth.js';
import JobOfferPost from '../models/JobOfferPost.js';

const router = express.Router();

// @route   GET /api/job-offers
router.get('/', async (req, res) => {
  try {
    const offers = await JobOfferPost.find().populate('user', ['name', 'email']); // retrieve name and email
    res.json(offers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/job-offers
router.post('/', auth, checkRole('employer'), async (req, res) => {
  const { title, description, salary, requiredExperience, location, contact } = req.body;

  try {
    const newOffer = new JobOfferPost({
      user: req.user.id,
      title,
      description,
      salary,
      requiredExperience,
      location,
      contact
    });

    const offer = await newOffer.save();
    res.json(offer);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/job-offers/:id -- for a particular user
router.get('/:id', async (req, res) => {
  try {
    const offer = await JobOfferPost.findById(req.params.id)
      .populate('user', ['name', 'email', 'profile']);

    if (!offer) return res.status(404).json({ msg: 'Offer not found' });
    
    res.json(offer);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

export default router;