import nodemailer from 'nodemailer';
import { config } from './env';
import { logger } from '../utils/logger';

// Brevo (Sendinblue) SMTP configuration
const transporter = nodemailer.createTransport({
  host: config.MAIL_HOST,
  port: Number(config.MAIL_PORT),
  secure: false, // Use TLS (STARTTLS)
  auth: {
    user: config.MAIL_USER,
    pass: config.MAIL_PASS,
  },
  tls: {
    rejectUnauthorized: true // Change to true for production
  },
  debug: true, // Enable debug output
  logger: true // Log to console
});

// Verify connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.error(' SMTP connection error:', error);
    logger.error(`SMTP connection failed: ${error}`);
  } else {
    console.log('✅ SMTP Server is ready to take our messages');
    logger.info('SMTP Server connected successfully');
  }
});

export const sendMail = async (to: string, subject: string, html: string) => {
  try {
    // Validate email address
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      throw new Error(`Invalid email address: ${to}`);
    }

    console.log('Attempting to send email to:', to);
    console.log('From:', config.MAIL_FROM);
    console.log('Subject:', subject);

    const mailOptions = {
      from: `"CodersPlace" <${config.MAIL_FROM}>`,
      to: to,
      subject: subject,
      html: html,
      // headers: {
      //   'X-Mailin-Tag': 'registration',
      // }
    };

    const info = await transporter.sendMail(mailOptions);
   
    console.log('Message sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('Response:', info.response);
    console.log('Accepted:', info.accepted);
    console.log(' Rejected:', info.rejected);

    logger.info(`Email sent successfully to ${to} (messageId: ${info.messageId}, response: ${info.response})`);

    return info;
  } catch (error: any) {
    console.error('Error sending email:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode
    });
    
    logger.error(
      `Email sending failed: ${JSON.stringify({
        to,
        error: error.message,
        code: error.code,
        response: error.response
      })}`
    );
    
    throw error;
  }
};