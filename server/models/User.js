const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstname: { 
      type: String, 
      required: true, 
    },
    lastname :{
      type: String,
      required: true,
    },
    email: { 
      type: String, 
      required: true, 
      unique: true 
    },
    password: { 
      type: String, 
      required: true 
    },
    role: { 
      type: String, 
      enum: ['jobSeeker', 'jobOfferer'], 
      required: true 
    },
    contactInfo: { 
      type: mongoose.Schema.Types.ObjectId,
        ref: 'ContactInfo',
    },
    image : {
        type: String,
    },

  }, { timestamps: true });

  module.exports = mongoose.model('User', userSchema);
