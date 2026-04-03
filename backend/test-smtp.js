const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_PORT == 465,
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
    },
});

const message = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: process.env.SMTP_EMAIL,
    subject: 'SMTP Test',
    text: 'If you see this, SMTP is working!',
};

transporter.sendMail(message)
    .then(info => console.log('✅ Success:', info.messageId))
    .catch(err => console.error('❌ Error:', err));
