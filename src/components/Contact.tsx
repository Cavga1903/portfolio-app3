import React, { useState, FormEvent, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAnalytics } from '../hooks/useAnalytics';
import { VALIDATION, TIMING } from '../utils/constants';
import { getValidationError } from '../utils/validation';
import emailjs from '@emailjs/browser';

interface FormErrors {
  name: string;
  email: string;
  message: string;
}

// Google reCAPTCHA Enterprise window interface
interface WindowWithRecaptcha extends Window {
  grecaptcha?: {
    enterprise?: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
    ready?: (callback: () => void) => void;
    execute?: (siteKey: string, options: { action: string }) => Promise<string>;
  };
}

const Contact: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { trackContactSubmission, trackFormInteraction } = useAnalytics();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<FormErrors>({
    name: '',
    email: '',
    message: '',
  });
  const [errorMessage, setErrorMessage] = useState<string>('');
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // EmailJS configuration
  const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
  const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
  const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';
  
  // reCAPTCHA Enterprise configuration
  const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || '6LeBJAssAAAAAAYqpCg-88Z3_Nm250eqnxTUrZdO';

  // Initialize EmailJS
  useEffect(() => {
    if (EMAILJS_PUBLIC_KEY) {
      emailjs.init(EMAILJS_PUBLIC_KEY);
    }
  }, [EMAILJS_PUBLIC_KEY]);

  // Validate form fields
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      name: '',
      email: '',
      message: '',
    };
    let isValid = true;

    // Validate name
    const nameError = getValidationError('name', formData.name);
    if (nameError) {
      newErrors.name = t(nameError);
      isValid = false;
    }

    // Validate email
    const emailError = getValidationError('email', formData.email);
    if (emailError) {
      newErrors.email = t(emailError);
      isValid = false;
    }

    // Validate message
    const messageError = getValidationError('message', formData.message);
    if (messageError) {
      newErrors.message = t(messageError);
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Clear previous errors
    setErrors({ name: '', email: '', message: '' });
    setErrorMessage('');

    // Validate form
    if (!validateForm()) {
      trackFormInteraction('contact_form', 'validation_error');
      return;
    }

    // Check EmailJS configuration
    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      setStatus('error');
      setErrorMessage(t('contact.form.error') + ' (EmailJS not configured)');
      trackFormInteraction('contact_form', 'config_error');
      setTimeout(() => {
        setStatus('idle');
        setErrorMessage('');
      }, TIMING.ERROR_MESSAGE_DURATION);
      return;
    }

    setStatus('sending');
    trackFormInteraction('contact_form', 'submit_start');

    try {
      // Get reCAPTCHA Enterprise token (if configured and not localhost)
      let recaptchaToken = '';
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      
      // Skip reCAPTCHA on localhost (development only)
      if (RECAPTCHA_SITE_KEY && !isLocalhost) {
        try {
          const windowWithRecaptcha = window as unknown as WindowWithRecaptcha;
          
          // Wait for reCAPTCHA Enterprise to be ready
          if (!windowWithRecaptcha.grecaptcha) {
            console.warn('reCAPTCHA Enterprise not loaded, waiting...');
            await new Promise(resolve => setTimeout(resolve, 1000));
          }

          if (windowWithRecaptcha.grecaptcha) {
            // Use Enterprise ready() to ensure reCAPTCHA is fully loaded
            await new Promise<void>((resolve) => {
              if (windowWithRecaptcha.grecaptcha?.enterprise?.ready) {
                windowWithRecaptcha.grecaptcha.enterprise.ready(() => {
                  resolve();
                });
              } else if (windowWithRecaptcha.grecaptcha?.ready) {
                // Fallback to standard ready if enterprise is not available
                windowWithRecaptcha.grecaptcha.ready(() => {
                  resolve();
                });
              } else {
                resolve();
              }
              // Timeout after 5 seconds
              setTimeout(() => resolve(), 5000);
            });

            // Get reCAPTCHA Enterprise token
            if (windowWithRecaptcha.grecaptcha.enterprise?.execute) {
              recaptchaToken = await windowWithRecaptcha.grecaptcha.enterprise.execute(RECAPTCHA_SITE_KEY, {
                action: 'CONTACT_FORM_SUBMIT'
              });
              console.log('✅ reCAPTCHA Enterprise token alındı');
            } else if (windowWithRecaptcha.grecaptcha.execute) {
              // Fallback to standard execute if enterprise is not available
              recaptchaToken = await windowWithRecaptcha.grecaptcha.execute(RECAPTCHA_SITE_KEY, {
                action: 'CONTACT_FORM_SUBMIT'
              });
              console.log('✅ reCAPTCHA token alındı (fallback)');
            }
          }
        } catch (recaptchaError) {
          console.warn('reCAPTCHA Enterprise error (continuing without token):', recaptchaError);
          // Continue without reCAPTCHA token if it fails
        }
      } else if (isLocalhost) {
        console.log('ℹ️ Localhost - reCAPTCHA Enterprise skipped for development');
      }

      // Dil bilgisini al
      const languageNames: { [key: string]: string } = {
        'tr': 'Türkçe 🇹🇷',
        'en': 'English 🇬🇧',
        'de': 'Deutsch 🇩🇪',
        'az': 'Azərbaycan Türkcəsi 🇦🇿'
      };
      const currentLanguage = languageNames[i18n.language.split('-')[0]] || i18n.language;

      // EmailJS ile email gönder (reCAPTCHA token'ı da ekle)
      const templateParams = {
        from_name: formData.name.trim(),
        from_email: formData.email.trim(),
        message: formData.message.trim(),
        language: currentLanguage,
        to_name: 'Tolga',
        recaptcha_token: recaptchaToken, // reCAPTCHA token'ı template'e ekle
      };

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );

      setStatus('success');
      trackContactSubmission(formData);
      trackFormInteraction('contact_form', 'submit_success');
      setFormData({ name: '', email: '', message: '' });
      setErrors({ name: '', email: '', message: '' });
      
      // Success mesajını kaldır
      setTimeout(() => setStatus('idle'), TIMING.SUCCESS_MESSAGE_DURATION);
    } catch (error: unknown) {
      console.error('Error sending email:', error);
      setStatus('error');
      
      // More detailed error handling
      if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
        setErrorMessage(error.message);
      } else {
        setErrorMessage(t('contact.form.error'));
      }
      
      trackFormInteraction('contact_form', 'submit_error');
      
      // Error mesajını kaldır
      setTimeout(() => {
        setStatus('idle');
        setErrorMessage('');
      }, TIMING.ERROR_MESSAGE_DURATION);
    }
  };

  // Debounced analytics tracking cleanup
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const fieldName = e.target.name;
    const fieldValue = e.target.value;

    setFormData({
      ...formData,
      [fieldName]: fieldValue,
    });

    // Clear error for this field when user starts typing
    if (errors[fieldName as keyof FormErrors]) {
      setErrors({
        ...errors,
        [fieldName]: '',
      });
    }

    // Debounced analytics tracking (only track after delay of inactivity)
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      trackFormInteraction('contact_form', 'field_change', fieldName);
    }, TIMING.ANALYTICS_DEBOUNCE_DELAY);
  };

  // Real-time validation on blur
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const fieldName = e.target.name;
    const fieldValue = e.target.value;

    const newErrors = { ...errors };

    // Use utility function for validation
    if (fieldName === 'name' || fieldName === 'email' || fieldName === 'message') {
      const errorKey = getValidationError(fieldName, fieldValue);
      newErrors[fieldName] = errorKey ? t(errorKey) : '';
    }

    setErrors(newErrors);
  };


  return (
    <section id="contact" className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-tl from-white via-gray-50 to-gray-100 dark:from-gray-800 dark:via-gray-900 dark:to-black text-gray-900 dark:text-white py-20 md:py-24 lg:py-28 px-6 md:px-8 lg:px-12 overflow-hidden">
      {/* Animated Background Circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <h2 className="relative z-10 text-3xl md:text-4xl font-bold mb-6 text-center fade-in-up inline-block group">
        {t('contact.title')}
        <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-teal-400 group-hover:w-full transition-all duration-500"></span>
      </h2>

      <p className="relative z-10 text-lg text-gray-300 mb-10 text-center max-w-2xl">
        {t('contact.description')}
      </p>

      <div className="relative z-10 w-full max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* SEO Destekli Ücretsiz Teklif Bölümü */}
          <div className="card bg-gradient-to-br from-emerald-500/10 to-teal-500/10 backdrop-blur-sm border border-emerald-500/30 shadow-2xl hover:shadow-emerald-500/20 transition-all duration-300 p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full mb-4">
                <svg className="w-8 h-8 text-gray-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-emerald-400 mb-2">{t('contact.freeQuote.title')}</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">{t('contact.freeQuote.description')}</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-gray-900 dark:text-white font-semibold text-sm">{t('contact.freeQuote.siteAnalysis.title')}</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-xs">{t('contact.freeQuote.siteAnalysis.description')}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-gray-900 dark:text-white font-semibold text-sm">{t('contact.freeQuote.performanceReport.title')}</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-xs">{t('contact.freeQuote.performanceReport.description')}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-gray-900 dark:text-white font-semibold text-sm">{t('contact.freeQuote.optimizationSuggestions.title')}</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-xs">{t('contact.freeQuote.optimizationSuggestions.description')}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-gray-900 dark:text-white font-semibold text-sm">{t('contact.freeQuote.competitorAnalysis.title')}</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-xs">{t('contact.freeQuote.competitorAnalysis.description')}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-emerald-400 font-semibold text-sm">{t('contact.freeQuote.completelyFree')}</span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-xs">{t('contact.freeQuote.completelyFreeDescription')}</p>
            </div>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => {
                  // Mesaj kutusuna odaklan
                  const messageTextarea = document.getElementById('message') as HTMLTextAreaElement;
                  if (messageTextarea) {
                    messageTextarea.focus();
                    messageTextarea.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    // Mesaj kutusuna örnek metin ekle
                    const exampleMessage = t('contact.freeQuote.exampleMessage');
                    messageTextarea.value = exampleMessage;
                    // Form state'ini güncelle ve validation'ı temizle
                    setFormData(prev => ({ ...prev, message: exampleMessage }));
                    setErrors(prev => ({ ...prev, message: '' }));
                  }
                }}
                aria-label={t('contact.freeQuote.sendMessageForQuote')}
                className="btn bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 border-none text-white font-semibold py-3 px-6 rounded-lg hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/50 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              >
                {t('contact.freeQuote.sendMessageForQuote')}
              </button>
            </div>
          </div>

          {/* Contact Form */}
          <div id="contact-form" className="card bg-gradient-to-br from-emerald-500/5 to-teal-500/5 backdrop-blur-sm border border-emerald-500/20 shadow-2xl hover:shadow-emerald-500/20 transition-all duration-300 p-8">
            <h3 className="text-2xl font-bold mb-6 text-emerald-400 text-center">{t('contact.form.title')}</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2 text-gray-800 dark:text-gray-200">
                {t('contact.form.name')}
                <span className="text-red-400 ml-1" aria-label="required">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                aria-required="true"
                aria-invalid={errors.name ? 'true' : 'false'}
                aria-describedby={errors.name ? 'name-error' : undefined}
                placeholder={t('contact.form.namePlaceholder')}
                className={`w-full px-4 py-3 bg-white dark:bg-gray-900/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 transition-all duration-300 ${
                  errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-700'
                }`}
              />
              {errors.name && (
                <p id="name-error" className="mt-1 text-sm text-red-400" role="alert">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-800 dark:text-gray-200">
                {t('contact.form.email')}
                <span className="text-red-400 ml-1" aria-label="required">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                aria-required="true"
                aria-invalid={errors.email ? 'true' : 'false'}
                aria-describedby={errors.email ? 'email-error' : undefined}
                placeholder={t('contact.form.emailPlaceholder')}
                className={`w-full px-4 py-3 bg-white dark:bg-gray-900/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 transition-all duration-300 ${
                  errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-700'
                }`}
              />
              {errors.email && (
                <p id="email-error" className="mt-1 text-sm text-red-400" role="alert">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Message Textarea */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2 text-gray-800 dark:text-gray-200">
                {t('contact.form.message')}
                <span className="text-red-400 ml-1" aria-label="required">*</span>
                <span className="text-gray-600 dark:text-gray-400 text-xs font-normal ml-2">
                  ({formData.message.length}/{VALIDATION.MAX_MESSAGE_LENGTH})
                </span>
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                rows={5}
                maxLength={VALIDATION.MAX_MESSAGE_LENGTH}
                aria-required="true"
                aria-invalid={errors.message ? 'true' : 'false'}
                aria-describedby={errors.message ? 'message-error' : undefined}
                placeholder={t('contact.form.messagePlaceholder')}
                className={`w-full px-4 py-3 bg-white dark:bg-gray-900/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 resize-none transition-all duration-300 ${
                  errors.message ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-700'
                }`}
              />
              {errors.message && (
                <p id="message-error" className="mt-1 text-sm text-red-400" role="alert">
                  {errors.message}
                </p>
              )}
            </div>


            {/* Submit Button */}
            <button
              type="submit"
              disabled={status === 'sending'}
              aria-label={status === 'sending' ? t('contact.form.sending') : t('contact.form.send')}
              className="w-full btn btn-primary bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 border-none text-white font-semibold py-3 rounded-lg hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/50 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 flex items-center justify-center gap-2"
            >
              {status === 'sending' && (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              {status === 'sending' ? t('contact.form.sending') : t('contact.form.send')}
            </button>

            {/* Status Messages */}
            {status === 'success' && (
              <div
                className="p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 text-center animate-pulse"
                role="alert"
                aria-live="polite"
              >
                {t('contact.form.success')}
              </div>
            )}
            {status === 'error' && (
              <div
                className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-center animate-pulse"
                role="alert"
                aria-live="assertive"
              >
                {errorMessage || t('contact.form.error')}
              </div>
            )}
          </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
