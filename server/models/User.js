const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name : {
        type : String,
        required: [true, 'Name is required']
    },
    email : {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },
    password : {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6
    },
    role : {
        type: String,
        enum: ['seeker', 'employer'],
        required: true
    },
    profile : {
        bio: String,
        location: String,
        skills: [String],
        experienceYears: Number,
    }
});

module.exports = mongoose.model('User', userSchema);