const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jobOfferSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Job title is required']
  },
  description: {
    type: String,
    required: [true, 'Job description is required']
  },
  salary: {
    type: Number,
    required: [true, 'Salary information is required']
  },
  requiredExperience: {
    type: Number,
    required: [true, 'Experience requirement is required']
  },
  location: {
    type: String,
    required: [true, 'Location is required']
  },
  contact: {
    email: String,
    phone: String,
    isHidden: {
      type: Boolean,
      default: true
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('JobOfferPost', jobOfferSchema);