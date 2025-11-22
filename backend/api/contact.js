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
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || '*', // Production'da spesifik domain kullanın
  credentials: true
}));
app.use(express.json());

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

    // Google reCAPTCHA Enterprise validation
    const recaptchaApiKey = process.env.RECAPTCHA_API_KEY;
    const recaptchaProjectId = process.env.RECAPTCHA_PROJECT_ID || 'my-portfolio-478020';
    const recaptchaSiteKey = process.env.RECAPTCHA_SITE_KEY || '6LeBJAssAAAAAAYqpCg-88Z3_Nm250eqnxTUrZdO';
    const expectedAction = 'CONTACT_FORM_SUBMIT';

    if (!recaptchaApiKey) {
      console.warn('RECAPTCHA_API_KEY not set. Skipping reCAPTCHA Enterprise verification.');
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

      // Verify reCAPTCHA Enterprise token with Google Cloud API (only if token is provided)
      if (recaptchaToken && recaptchaToken.trim() !== '') {
        try {
          const recaptchaEnterpriseUrl = `https://recaptchaenterprise.googleapis.com/v1/projects/${recaptchaProjectId}/assessments?key=${recaptchaApiKey}`;
          
          const requestBody = {
            event: {
              token: recaptchaToken,
              expectedAction: expectedAction,
              siteKey: recaptchaSiteKey,
            },
          };

          const verifyResponse = await fetch(recaptchaEnterpriseUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
          });

          if (!verifyResponse.ok) {
            const errorText = await verifyResponse.text();
            console.error('reCAPTCHA Enterprise API error:', verifyResponse.status, errorText);
            return res.status(500).json({ 
              error: 'Failed to verify reCAPTCHA. Please try again later.' 
            });
          }

          const verifyData = await verifyResponse.json();

          // Check if the token is valid
          if (!verifyData.tokenProperties || !verifyData.tokenProperties.valid) {
            const invalidReason = verifyData.tokenProperties?.invalidReason || 'unknown';
            console.error('reCAPTCHA Enterprise token invalid:', invalidReason);
            return res.status(400).json({ 
              error: 'reCAPTCHA verification failed. Please try again.' 
            });
          }

          // Check if the expected action was executed
          if (verifyData.tokenProperties.action !== expectedAction) {
            console.error('reCAPTCHA action mismatch. Expected:', expectedAction, 'Got:', verifyData.tokenProperties.action);
            return res.status(400).json({ 
              error: 'reCAPTCHA verification failed. Please try again.' 
            });
          }

          // Get the risk score and assessment details
          const riskScore = verifyData.riskAnalysis?.score || 0;
          const assessmentId = verifyData.name?.split('/').pop() || 'unknown'; // Extract assessment ID from name
          const reasons = verifyData.riskAnalysis?.reasons || [];
          
          // Log assessment details for review and annotation
          console.log('📊 reCAPTCHA Enterprise Assessment:', {
            assessmentId: assessmentId,
            riskScore: riskScore,
            action: verifyData.tokenProperties.action,
            valid: verifyData.tokenProperties.valid,
            reasons: reasons.length > 0 ? reasons : 'none',
            createTime: verifyData.createTime || 'not provided'
          });
          
          // Check risk score (0.0 = likely bot, 1.0 = likely human)
          if (riskScore < 0.5) {
            console.warn('⚠️ reCAPTCHA Enterprise risk score too low:', riskScore);
            console.warn('Risk reasons:', reasons);
            // Store assessment ID for potential annotation (mark as false positive if needed)
            console.warn('Assessment ID for annotation:', assessmentId);
            return res.status(400).json({ 
              error: 'reCAPTCHA verification failed. Please try again.' 
            });
          }
          
          console.log('✅ reCAPTCHA Enterprise verified successfully. Score:', riskScore);
          if (reasons.length > 0) {
            console.log('ℹ️ Risk reasons (for model tuning):', reasons);
          }
          
          // Store assessment ID in response metadata (for future annotation if needed)
          // You can use this ID later to annotate assessments via Google Cloud API
          // Assessment ID format: projects/{project}/assessments/{assessment_id}
        } catch (recaptchaError) {
          console.error('Error verifying reCAPTCHA Enterprise:', recaptchaError);
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

