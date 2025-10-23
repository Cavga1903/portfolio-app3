import React, { useState, FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import emailjs from '@emailjs/browser';
import { useAnalytics } from '../hooks/useAnalytics';

const Contact: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { trackContactSubmission, trackFormInteraction } = useAnalytics();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');
    trackFormInteraction('contact_form', 'submit_start');

    try {
      // EmailJS ile e-posta gönder
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_bc4c1qr';
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_ow0vkmg';
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'EaLO_KojjN4ucFgXf';

      // Dil bilgisini al
      const languageNames: { [key: string]: string } = {
        'tr': 'Türkçe 🇹🇷',
        'en': 'English 🇬🇧',
        'de': 'Deutsch 🇩🇪',
        'az': 'Azərbaycan Türkcəsi 🇦🇿'
      };
      const currentLanguage = languageNames[i18n.language.split('-')[0]] || i18n.language;

      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
          language: currentLanguage,
          time: new Date().toLocaleString('tr-TR', { 
            dateStyle: 'full', 
            timeStyle: 'short' 
          }),
        },
        publicKey
      );

      setStatus('success');
      trackContactSubmission(formData);
      trackFormInteraction('contact_form', 'submit_success');
      setFormData({ name: '', email: '', message: '' });
      
      // 3 saniye sonra success mesajını kaldır
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      console.error('Email send error:', error);
      setStatus('error');
      trackFormInteraction('contact_form', 'submit_error');
      
      // 3 saniye sonra error mesajını kaldır
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    trackFormInteraction('contact_form', 'field_change', e.target.name);
  };

  return (
    <section id="contact" className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-tl from-gray-800 via-gray-900 to-black text-white p-6 overflow-hidden">
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
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-emerald-400 mb-2">Ücretsiz Teklif Al</h3>
              <p className="text-gray-300 text-sm">Web sitenizi analiz edip, performansınızı artıracak öneriler sunuyorum</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-semibold text-sm">Site Analizi</h4>
                  <p className="text-gray-400 text-xs">Web sitenizin mevcut SEO durumunu detaylı analiz ederim</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-semibold text-sm">Performans Raporu</h4>
                  <p className="text-gray-400 text-xs">Google PageSpeed, Core Web Vitals ve teknik SEO analizi</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-semibold text-sm">Optimizasyon Önerileri</h4>
                  <p className="text-gray-400 text-xs">Arama motorlarında üst sıralara çıkmanız için somut öneriler</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-semibold text-sm">Rekabet Analizi</h4>
                  <p className="text-gray-400 text-xs">Rakiplerinizi analiz edip stratejik avantajlar öneririm</p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-emerald-400 font-semibold text-sm">Tamamen Ücretsiz</span>
              </div>
              <p className="text-gray-300 text-xs">Bu analiz ve öneriler tamamen ücretsizdir. Hiçbir yükümlülük altına girmezsiniz.</p>
            </div>

            <div className="mt-4 text-center">
              <button 
                onClick={() => {
                  // Mesaj kutusuna odaklan
                  const messageTextarea = document.getElementById('message') as HTMLTextAreaElement;
                  if (messageTextarea) {
                    messageTextarea.focus();
                    messageTextarea.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    // Mesaj kutusuna örnek metin ekle
                    messageTextarea.value = 'Merhaba! Web sitem için ücretsiz destek almak istiyorum. Lütfen detaylı analiz yapabilir misiniz?';
                    // Form state'ini güncelle
                    setFormData(prev => ({ ...prev, message: messageTextarea.value }));
                  }
                }}
                className="btn bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 border-none text-white font-semibold py-3 px-6 rounded-lg hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/50 active:scale-95 transition-all duration-300"
              >
                Destek almak için mesaj gönderin
              </button>
            </div>
          </div>

          {/* Contact Form */}
          <div id="contact-form" className="card bg-gradient-to-br from-emerald-500/5 to-teal-500/5 backdrop-blur-sm border border-emerald-500/20 shadow-2xl hover:shadow-emerald-500/20 transition-all duration-300 p-8">
            <h3 className="text-2xl font-bold mb-6 text-emerald-400 text-center">{t('contact.form.title')}</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2 text-gray-200">
                {t('contact.form.name')}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder={t('contact.form.namePlaceholder')}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
              />
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-200">
                {t('contact.form.email')}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder={t('contact.form.emailPlaceholder')}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
              />
            </div>

            {/* Message Textarea */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2 text-gray-200">
                {t('contact.form.message')}
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                placeholder={t('contact.form.messagePlaceholder')}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-gray-400 resize-none transition-all duration-300"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full btn btn-primary bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 border-none text-white font-semibold py-3 rounded-lg hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/50 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
              {status === 'sending' ? t('contact.form.sending') : t('contact.form.send')}
            </button>

            {/* Status Messages */}
            {status === 'success' && (
              <div className="p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 text-center animate-pulse">
                {t('contact.form.success')}
              </div>
            )}
            {status === 'error' && (
              <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-center animate-pulse">
                {t('contact.form.error')}
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