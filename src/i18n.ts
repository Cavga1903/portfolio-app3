import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Çeviri dosyaları
import translationTR from './locales/tr/translation.json';
import translationEN from './locales/en/translation.json';
import translationDE from './locales/de/translation.json';

const resources = {
  tr: {
    translation: translationTR,
  },
  en: {
    translation: translationEN,
  },
  de: {
    translation: translationDE,
  },
};

i18n
  .use(LanguageDetector) // Tarayıcı dilini otomatik algıla
  .use(initReactI18next) // React i18next'e bağla
  .init({
    resources,
    fallbackLng: 'tr', // Varsayılan dil Türkçe
    debug: false,
    interpolation: {
      escapeValue: false, // React zaten XSS koruması yapıyor
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;

