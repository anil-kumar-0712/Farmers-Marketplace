const nodemailer = require('nodemailer');

// Create transporter with pooling to keep SMTP connections alive
const transporter = nodemailer.createTransport({
    pool: true,
    maxConnections: 5,
    maxMessages: 100,
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_PORT == 465,
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
    },
});

/**
 * Send email utility
 * @param {Object} options - {email, subject, message, html}
 */
const sendEmail = async (options) => {
    // console.log(`📧 Dispatching email to: ${options.email}`);

    const message = {
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html,
    };

    try {
        const info = await transporter.sendMail(message);
        console.log('✅ Email delivered to %s: %s', options.email, info.messageId);
        return info;
    } catch (error) {
        console.error('❌ SendMail Error:', error.message);
        throw error;
    }
};

module.exports = sendEmail;
