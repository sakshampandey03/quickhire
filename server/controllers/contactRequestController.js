const ContactRequest = require('../models/contactRequestModel');
const JobOfferPost = require('../models/jobOfferPostModel');
const User = require('../models/userModel');

// Create a new contact request
exports.createContactRequest = async (req, res) => {
  try {
    const { jobOffer, message } = req.body;
    const seeker = req.user.id; // Extracting user ID from the token

    // Ensure the job offer exists
    const jobOfferExists = await JobOfferPost.findById(jobOffer);
    if (!jobOfferExists) {
      return res.status(404).json({ message: 'Job offer not found' });
    }

    // Prevent duplicate requests
    const existingRequest = await ContactRequest.findOne({ jobOffer, seeker });
    if (existingRequest) {
      return res.status(400).json({ message: 'Contact request already sent' });
    }

    const contactRequest = new ContactRequest({
      jobOffer,
      seeker,
      message
    });

    await contactRequest.save();
    res.status(201).json({ message: 'Contact request sent successfully', contactRequest });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

//  Get all contact requests for a specific job offer
exports.getContactRequestsByJobOffer = async (req, res) => {
  try {
    const { jobOfferId } = req.params;
    const requests = await ContactRequest.find({ jobOffer: jobOfferId }).populate('seeker', 'name email');
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

//  Get contact requests made by a specific job seeker
exports.getContactRequestsBySeeker = async (req, res) => {
  try {
    const seekerId = req.user.id;
    const requests = await ContactRequest.find({ seeker: seekerId }).populate('jobOffer', 'title location');
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

//  Approve or reject a contact request (Only the job poster can do this)
exports.updateContactRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const contactRequest = await ContactRequest.findById(id).populate('jobOffer');
    if (!contactRequest) {
      return res.status(404).json({ message: 'Contact request not found' });
    }

    // Only the job poster can approve/reject requests
    if (contactRequest.jobOffer.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this request' });
    }

    contactRequest.status = status;
    await contactRequest.save();
    res.status(200).json({ message: `Contact request ${status}`, contactRequest });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

//  Delete a contact request (Only the seeker can delete their request)
exports.deleteContactRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const contactRequest = await ContactRequest.findById(id);

    if (!contactRequest) {
      return res.status(404).json({ message: 'Contact request not found' });
    }

    if (contactRequest.seeker.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this request' });
    }

    await contactRequest.deleteOne();
    res.status(200).json({ message: 'Contact request deleted successfully' });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
