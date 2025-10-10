import React, { useState, FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import emailjs from '@emailjs/browser';

const Contact: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');

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
      setFormData({ name: '', email: '', message: '' });
      
      // 3 saniye sonra success mesajını kaldır
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      console.error('Email send error:', error);
      setStatus('error');
      
      // 3 saniye sonra error mesajını kaldır
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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

      <div className="relative z-10 w-full max-w-2xl">
        {/* Contact Form */}
        <div className="card bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 shadow-2xl hover:shadow-teal-500/20 transition-all duration-300 p-8">
          <h3 className="text-2xl font-bold mb-6 text-teal-400 text-center">{t('contact.form.title')}</h3>
          
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
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
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
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300"
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
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-white placeholder-gray-400 resize-none transition-all duration-300"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full btn btn-primary bg-teal-500 hover:bg-teal-600 border-none text-white font-semibold py-3 rounded-lg hover:scale-105 hover:shadow-lg hover:shadow-teal-500/50 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
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
    </section>
  );
};

export default Contact;