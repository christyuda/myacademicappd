const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
  secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    logger: true,  // Tampilkan log
    debug: true,   // Debug detail
});

async function sendEmail(to, subject, text, html) {
    try {
        const info = await transporter.sendMail({
            from: `"SIKAD" <maddison53@ethereal.email>`, // Sender address
            to, // Recipient address
            subject, // Subject
            text, // Plain text body
            html, // HTML body
        });
        console.log('Email sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        return nodemailer.getTestMessageUrl(info); // Return preview URL for testing
    } catch (error) {
        console.error('Error sending email:', error);
        throw error; // Throw error to be handled by the calling function
    }
}

module.exports = { sendEmail };
