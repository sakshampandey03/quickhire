const nodemailer = require('nodemailer');
const mailSender = async(email, subject, text) =>{
    try{
        let transporter = nodemailer.createTransport({
            host : "smtp.gmail.com",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        });
        let mailOptions = {
            from: process.env.EMAIL,
            to: {email},
            subject: {subject},
            text: {text},
        };
        await transporter.sendMail(mailOptions);
        console.log("Mail Sent");
}
    catch(err){
        console.log(err);
    }
}