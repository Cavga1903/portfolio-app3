/**
 * Contact Form API Endpoint
 * Backend API for handling contact form submissions
 * 
 * This is a simple Node.js/Express example. You can deploy this to:
 * - Vercel (serverless functions)
 * - Railway
 * - Render
 * - Your own server
 * 
 * Environment Variables Required:
 * - SMTP_HOST: Your SMTP server (e.g., smtp.gmail.com)
 * - SMTP_PORT: SMTP port (usually 587 for TLS)
 * - SMTP_USER: Your email address
 * - SMTP_PASS: Your email password or app password
 * - CONTACT_EMAIL: Email address to receive contact form submissions
 */

const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || '*', // Production'da spesifik domain kullanın
  credentials: true
}));
app.use(express.json());

// Rate limiting - spam koruması
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 5, // Her IP için 15 dakikada maksimum 5 istek
  message: { error: 'Too many requests, please try again later.' }
});

// Email transporter oluştur
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

// Contact form endpoint
app.post('/api/contact', limiter, async (req, res) => {
  try {
    const { name, email, message, language, recaptchaToken } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({ 
        error: 'Name, email, and message are required.' 
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Invalid email address.' 
      });
    }

    // Name validation
    if (name.trim().length < 2) {
      return res.status(400).json({ 
        error: 'Name must be at least 2 characters long.' 
      });
    }

    // Message validation
    if (message.trim().length < 10) {
      return res.status(400).json({ 
        error: 'Message must be at least 10 characters long.' 
      });
    }

    if (message.trim().length > 1000) {
      return res.status(400).json({ 
        error: 'Message must be less than 1000 characters.' 
      });
    }

    // Google reCAPTCHA validation
    const recaptchaSecretKey = process.env.RECAPTCHA_SECRET_KEY;

    if (!recaptchaSecretKey) {
      console.warn('RECAPTCHA_SECRET_KEY not set. Skipping reCAPTCHA verification.');
    } else {
      if (!recaptchaToken) {
        return res.status(400).json({ 
          error: 'reCAPTCHA verification is required.' 
        });
      }

      // Verify reCAPTCHA token with Google
      try {
        const recaptchaVerifyUrl = `https://www.google.com/recaptcha/api/siteverify`;
        const verifyResponse = await fetch(recaptchaVerifyUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `secret=${recaptchaSecretKey}&response=${recaptchaToken}`,
        });

        const verifyData = await verifyResponse.json();

        if (!verifyData.success) {
          console.error('reCAPTCHA verification failed:', verifyData['error-codes']);
          return res.status(400).json({ 
            error: 'reCAPTCHA verification failed. Please try again.' 
          });
        }

        // Optional: Check score for reCAPTCHA v3 (if using v3)
        // For v2, success is enough
        if (verifyData.score !== undefined && verifyData.score < 0.5) {
          return res.status(400).json({ 
            error: 'reCAPTCHA verification failed. Please try again.' 
          });
        }
      } catch (recaptchaError) {
        console.error('Error verifying reCAPTCHA:', recaptchaError);
        return res.status(500).json({ 
          error: 'Failed to verify reCAPTCHA. Please try again later.' 
        });
      }
    }

    // Email gönder
    const transporter = createTransporter();
    const recipientEmail = process.env.CONTACT_EMAIL || process.env.SMTP_USER;

    const mailOptions = {
      from: `"${name}" <${process.env.SMTP_USER}>`,
      to: recipientEmail,
      replyTo: email,
      subject: `Portfolio Contact Form - ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Contact Form Submission</h2>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Language:</strong> ${language || 'Unknown'}</p>
            <p><strong>Time:</strong> ${new Date().toLocaleString('en-US', { 
              dateStyle: 'full', 
              timeStyle: 'short' 
            })}</p>
          </div>
          <div style="background-color: #fff; padding: 20px; border-left: 4px solid #4CAF50; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Message:</h3>
            <p style="white-space: pre-wrap; color: #666;">${message}</p>
          </div>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #999; font-size: 12px;">
            This email was sent from your portfolio contact form.
          </p>
        </div>
      `,
      text: `
New Contact Form Submission

Name: ${name}
Email: ${email}
Language: ${language || 'Unknown'}
Time: ${new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}

Message:
${message}
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ 
      success: true, 
      message: 'Email sent successfully!' 
    });

  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ 
      error: 'Failed to send email. Please try again later.' 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Vercel serverless function export
if (process.env.VERCEL) {
  module.exports = app;
} else {
  // Standalone server
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Contact API server running on port ${PORT}`);
  });
}

