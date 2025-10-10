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

// Dil algılama mantığı: TR -> tr, DE -> de, diğerleri -> en
const languageDetector = new LanguageDetector();
languageDetector.addDetector({
  name: 'customDetector',
  lookup() {
    // localStorage'dan kontrol et
    const storedLang = localStorage.getItem('i18nextLng');
    if (storedLang && ['tr', 'en', 'de'].includes(storedLang)) {
      return storedLang;
    }

    // Tarayıcı dilini al
    const browserLang = navigator.language || (navigator as any).userLanguage;
    const langCode = browserLang.toLowerCase().split('-')[0]; // 'en-US' -> 'en'
    
    // Türkçe ise tr, Almanca ise de, diğerleri en
    if (langCode === 'tr') return 'tr';
    if (langCode === 'de') return 'de';
    return 'en'; // Fallback: Diğer tüm diller İngilizce
  },
  cacheUserLanguage(lng: string) {
    localStorage.setItem('i18nextLng', lng);
  }
});

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en', // Fallback dil İngilizce
    supportedLngs: ['tr', 'en', 'de'],
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['customDetector'],
      caches: ['localStorage'],
    },
  });

export default i18n;

