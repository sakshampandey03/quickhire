const JobOfferPost = require('../models/JobOfferPost');

// 📌 Create a new job offer post
exports.createJobOfferPost = async (req, res) => {
  try {
    const { title, description, salary, requiredExperience, location, contact } = req.body;

    const newJobOffer = new JobOfferPost({
      user: req.user.id,
      title,
      description,
      salary,
      requiredExperience,
      location,
      contact
    });

    const savedJobOffer = await newJobOffer.save();
    res.status(201).json(savedJobOffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📌 Get all job offer posts
exports.getAllJobOfferPosts = async (req, res) => {
  try {
    const jobOffers = await JobOfferPost.find().populate('user', 'name email');
    res.status(200).json(jobOffers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📌 Get a single job offer post by ID
exports.getJobOfferPostById = async (req, res) => {
  try {
    const jobOffer = await JobOfferPost.findById(req.params.id).populate('user', 'name email');
    if (!jobOffer) {
      return res.status(404).json({ message: 'Job offer not found' });
    }
    res.status(200).json(jobOffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📌 Update a job offer post (Only owner can update)
exports.updateJobOfferPost = async (req, res) => {
  try {
    const jobOffer = await JobOfferPost.findById(req.params.id);

    if (!jobOffer) {
      return res.status(404).json({ message: 'Job offer not found' });
    }

    if (jobOffer.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to update this post' });
    }

    const updatedJobOffer = await JobOfferPost.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedJobOffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📌 Delete a job offer post (Only owner can delete)
exports.deleteJobOfferPost = async (req, res) => {
  try {
    const jobOffer = await JobOfferPost.findById(req.params.id);

    if (!jobOffer) {
      return res.status(404).json({ message: 'Job offer not found' });
    }

    if (jobOffer.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to delete this post' });
    }

    await jobOffer.deleteOne();
    res.status(200).json({ message: 'Job offer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
