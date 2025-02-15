const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jobSeekerSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Professional title is required']
  },
  description: {
    type: String,
    required: [true, 'Personal description is required']
  },
  expectedSalary: {
    type: Number,
    required: [true, 'Expected salary is required']
  },
  experienceYears: {
    type: Number,
    required: [true, 'Experience years is required']
  },
  desiredLocation: {
    type: String,
    required: [true, 'Desired location is required']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('JobSeekerPost', jobSeekerSchema);