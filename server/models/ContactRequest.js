const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contactRequestSchema = new Schema({
  jobOffer: {
    type: Schema.Types.ObjectId,
    ref: 'JobOfferPost',
    required: true
  },
  seeker: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  message: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ContactRequest', contactRequestSchema);