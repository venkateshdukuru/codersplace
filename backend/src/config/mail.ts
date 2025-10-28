import nodemailer from 'nodemailer';
import { config } from './env';
import { logger } from '../utils/logger';

// Gmail SMTP configuration
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // Use TLS (STARTTLS)
  auth: {
    user: config.MAIL_USER, // Your Gmail address
    pass: config.MAIL_PASS, // App password
  },
  tls: {
    rejectUnauthorized: true,
  },
});

// Verify connection silently
transporter.verify((error, success) => {
  if (error) {
    logger.error(`SMTP connection failed: ${error}`);
  } else {
    logger.info('Gmail SMTP Server connected successfully');
  }
});

export const sendMail = async (to: string, subject: string, html: string) => {
  try {
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      throw new Error(`Invalid email address: ${to}`);
    }

    const mailOptions = {
      from: `"CodersPlace" <${config.MAIL_FROM}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);

    // Only log essential info
    logger.info(`Email sent successfully to ${to} (messageId: ${info.messageId})`);

    return info;
  } catch (error: any) {
    // Only log essential error info
    logger.error(`Email sending failed to ${to}: ${error.message}`);
    throw error;
  }
};
