const mongoose = require('mongoose');
const mailSender = require('../utils/mailSender');


const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt : {
        type: Date,
        default: Date.now,
        expires: 600,
    }
});

async function sendVerificationEmail(email, otp) {
    const subject = 'Email Verification';
    const html = `<p>Your OTP is <b>${otp}</b></p>`;
    await mailSender(email, subject, html);
}
otpSchema.pre('save', async function (next){
    try{
        await sendVerificationEmail(this.email, this.otp);
    }
    catch(err){
        console.log(err);
    }
    next();
})

module.exports = mongoose.model('Otp', otpSchema);