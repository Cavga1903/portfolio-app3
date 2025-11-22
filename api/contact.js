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
const { render } = require('@react-email/render');
const ContactEmail = require('./templates/ContactEmail');

const app = express();

// Middleware
// CORS configuration - hem www hem www olmayan domain'leri destekle
const allowedOrigins = process.env.ALLOWED_ORIGIN 
  ? process.env.ALLOWED_ORIGIN.split(',').map(origin => origin.trim())
  : ['https://www.cavga.dev', 'https://cavga.dev', 'http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
  origin: function (origin, callback) {
    // Origin yoksa (mobile app, Postman, vb.) izin ver
    if (!origin) return callback(null, true);
    
    // ALLOWED_ORIGIN='*' ise tüm origin'lere izin ver
    if (process.env.ALLOWED_ORIGIN === '*') {
      return callback(null, true);
    }
    
    // Allowed origins listesinde var mı kontrol et
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // Development'ta tüm origin'lere izin ver
      if (process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// OPTIONS request'ini manuel olarak handle et (Vercel redirect sorununu önlemek için)
app.options('/api/contact', (req, res) => {
  const origin = req.headers.origin;
  const allowedOrigins = process.env.ALLOWED_ORIGIN 
    ? process.env.ALLOWED_ORIGIN.split(',').map(o => o.trim())
    : ['https://www.cavga.dev', 'https://cavga.dev', 'http://localhost:5173', 'http://localhost:3000'];
  
  // Origin kontrolü
  if (origin && (allowedOrigins.includes(origin) || process.env.ALLOWED_ORIGIN === '*' || process.env.NODE_ENV !== 'production')) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Max-Age', '86400'); // 24 saat
  }
  
  res.status(204).end();
});

// Rate limiting - spam koruması
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: process.env.NODE_ENV === 'production' ? 10 : 50, // Production'da 10, development'ta 50 istek
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // Development modunda daha esnek
  skip: (req) => {
    // Development'ta rate limit'i daha esnek yap
    return false; // Her zaman rate limit uygula, sadece max değeri değişiyor
  }
});

// Email transporter oluştur
const createTransporter = () => {
  const port = parseInt(process.env.SMTP_PORT || '587');
  const secure = port === 465; // 465 için SSL, 587 için TLS
  
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: port,
    secure: secure, // true for 465 (SSL), false for 587 (TLS)
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
  // CORS header'larını manuel olarak set et
  const origin = req.headers.origin;
  const allowedOrigins = process.env.ALLOWED_ORIGIN 
    ? process.env.ALLOWED_ORIGIN.split(',').map(o => o.trim())
    : ['https://www.cavga.dev', 'https://cavga.dev', 'http://localhost:5173', 'http://localhost:3000'];
  
  if (origin && (allowedOrigins.includes(origin) || process.env.ALLOWED_ORIGIN === '*' || process.env.NODE_ENV !== 'production')) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  
  try {
    const { name, email, message, language, recaptchaToken } = req.body;
    
    // Debug: Log received data (without sensitive info)
    console.log('Contact form submission:', {
      name: name ? 'provided' : 'missing',
      email: email ? 'provided' : 'missing',
      message: message ? `length: ${message.length}` : 'missing',
      language: language || 'not provided',
      recaptchaToken: recaptchaToken ? `provided (${recaptchaToken.substring(0, 20)}...)` : 'missing'
    });

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

    // Google reCAPTCHA v3 validation
    const recaptchaSecretKey = process.env.RECAPTCHA_SECRET_KEY;

    if (!recaptchaSecretKey) {
      console.warn('RECAPTCHA_SECRET_KEY not set. Skipping reCAPTCHA verification.');
    } else {
      // reCAPTCHA token kontrolü - eğer token yoksa ve production değilse uyarı ver
      if (!recaptchaToken || recaptchaToken.trim() === '') {
        console.error('reCAPTCHA token missing or empty. Received:', recaptchaToken);
        // Production'da zorunlu, development'ta uyarı
        if (process.env.NODE_ENV === 'production') {
          return res.status(400).json({ 
            error: 'reCAPTCHA verification is required.' 
          });
        } else {
          console.warn('reCAPTCHA token missing in development mode. Continuing without verification.');
        }
      }

      // Verify reCAPTCHA token with Google (only if token is provided)
      if (recaptchaToken && recaptchaToken.trim() !== '') {
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

          // Check score for reCAPTCHA v3 (0.0 = likely bot, 1.0 = likely human)
          if (verifyData.score !== undefined && verifyData.score < 0.5) {
            console.warn('reCAPTCHA score too low:', verifyData.score);
            return res.status(400).json({ 
              error: 'reCAPTCHA verification failed. Please try again.' 
            });
          }
          
          console.log('✅ reCAPTCHA v3 verified successfully. Score:', verifyData.score);
        } catch (recaptchaError) {
          console.error('Error verifying reCAPTCHA:', recaptchaError);
          return res.status(500).json({ 
            error: 'Failed to verify reCAPTCHA. Please try again later.' 
          });
        }
      } else {
        console.warn('reCAPTCHA token not provided, skipping verification');
      }
    }

    // Email gönder
    const transporter = createTransporter();
    const recipientEmail = process.env.CONTACT_EMAIL || process.env.SMTP_USER;

    // React Email template'ini render et
    const timestamp = new Date().toLocaleString('en-US', { 
      dateStyle: 'full', 
      timeStyle: 'short' 
    });

    const emailHtml = await render(
      ContactEmail({
        name,
        email,
        message,
        language: language || 'Unknown',
        timestamp,
      })
    );

    // Plain text versiyonu
    const emailText = `
New Contact Form Submission

Name: ${name}
Email: ${email}
Language: ${language || 'Unknown'}
Time: ${timestamp}

Message:
${message}
    `;

    const mailOptions = {
      from: `"${name}" <${process.env.SMTP_USER}>`,
      to: recipientEmail,
      replyTo: email,
      subject: `Portfolio Contact Form - ${name}`,
      html: emailHtml,
      text: emailText,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ 
      success: true, 
      message: 'Email sent successfully!' 
    });

  } catch (error) {
    console.error('Error sending email:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      smtpUser: process.env.SMTP_USER ? 'Set' : 'Missing',
      smtpPass: process.env.SMTP_PASS ? 'Set' : 'Missing',
    });
    res.status(500).json({ 
      error: 'Failed to send email. Please try again later.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  // CORS header'larını manuel olarak set et
  const origin = req.headers.origin;
  const allowedOrigins = process.env.ALLOWED_ORIGIN 
    ? process.env.ALLOWED_ORIGIN.split(',').map(o => o.trim())
    : ['https://www.cavga.dev', 'https://cavga.dev', 'http://localhost:5173', 'http://localhost:3000'];
  
  if (origin && (allowedOrigins.includes(origin) || process.env.ALLOWED_ORIGIN === '*' || process.env.NODE_ENV !== 'production')) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  
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

