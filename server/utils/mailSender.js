const nodemailer = require('nodemailer');

const mailSender = async (email, subject, html) => {
    try {
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });

        let mailOptions = {
            from: process.env.MAIL_USER,
            to: email,
            subject: subject,
            html: html,
        };

        await transporter.sendMail(mailOptions);
        console.log("Mail Sent");
    } catch (err) {
        console.log("Error while sending email:", err);
    }
};

module.exports = mailSender;