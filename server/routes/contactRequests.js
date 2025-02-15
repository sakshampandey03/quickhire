import express from 'express';
import auth from '../middleware/auth.js';
import ContactRequest from '../models/ContactRequest.js';
import JobOfferPost from '../models/JobOfferPost.js';

const router = express.Router();

// @route   POST /api/requests
router.post('/', auth, checkRole('seeker'), async (req, res) => { // checkrole middleware se role compare kare rhe h
  const { jobOfferId, message } = req.body;

  try {
    const jobOffer = await JobOfferPost.findById(jobOfferId); // check if job exists
    if (!jobOffer) return res.status(404).json({ msg: 'Job offer not found' });

    const newRequest = new ContactRequest({ // a job seeker requests for a job
      jobOffer: jobOfferId,
      seeker: req.user.id,
      message
    });

    await newRequest.save();
    res.json(newRequest);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/requests/:id/approve
router.put('/:id/approve', auth, async (req, res) => { // update karenge jab approval hoga
  try {
    const request = await ContactRequest.findById(req.params.id)
      .populate('jobOffer');
    
    if (!request) return res.status(404).json({ msg: 'Request not found' });
    
    // Check if current user is the job offer owner
    if (request.jobOffer.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    request.status = 'approved';
    await request.save();
    
    res.json(request);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/requests/:id/reject
router.put('/:id/reject', auth, async (req, res) => { // for rejection
    try {
      const request = await ContactRequest.findById(req.params.id)
        .populate('jobOffer');
      
      if (!request) return res.status(404).json({ msg: 'Request not found' });
      
      // Check if current user is the job offer owner
      if (request.jobOffer.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'User not authorized' });
      }
  
      request.status = 'rejected';
      await request.save();
      
      res.json(request);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });

export default router;