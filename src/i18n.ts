import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Çeviri dosyaları
import translationTR from './locales/tr/translation.json';
import translationEN from './locales/en/translation.json';
import translationDE from './locales/de/translation.json';
import translationAZ from './locales/az/translation.json';
import translationFR from './locales/fr/translation.json';
import translationSV from './locales/sv/translation.json';
import translationNO from './locales/no/translation.json';
import translationEL from './locales/el/translation.json';
import translationUK from './locales/uk/translation.json';
import translationIT from './locales/it/translation.json';
import translationJA from './locales/ja/translation.json';
import translationPL from './locales/pl/translation.json';
import translationES from './locales/es/translation.json';

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
  az: {
    translation: translationAZ,
  },
  fr: {
    translation: translationFR,
  },
  sv: {
    translation: translationSV,
  },
  no: {
    translation: translationNO,
  },
  el: {
    translation: translationEL,
  },
  uk: {
    translation: translationUK,
  },
  it: {
    translation: translationIT,
  },
  ja: {
    translation: translationJA,
  },
  pl: {
    translation: translationPL,
  },
  es: {
    translation: translationES,
  },
};

// Dil algılama mantığı: TR -> tr, DE -> de, AZ -> az, diğerleri -> en
const languageDetector = new LanguageDetector();
languageDetector.addDetector({
  name: 'customDetector',
  lookup() {
    // Safari uyumluluğu için kontrol
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return 'en'; // SSR fallback
    }

    // localStorage'dan kontrol et
    try {
      const storedLang = localStorage.getItem('i18nextLng');
      const supportedLangs = ['tr', 'en', 'de', 'az', 'fr', 'sv', 'no', 'el', 'uk', 'it', 'ja', 'pl', 'es'];
      if (storedLang && supportedLangs.includes(storedLang)) {
        return storedLang;
      }
    } catch (e) {
      // localStorage erişim hatası (Safari private mode gibi)
      console.warn('localStorage access failed:', e);
    }

    // Tarayıcı dilini al
    if (typeof navigator !== 'undefined' && navigator.language) {
      const browserLang = navigator.language || (navigator as any).userLanguage;
      const langCode = browserLang.toLowerCase().split('-')[0]; // 'en-US' -> 'en'
      
      // Desteklenen dilleri kontrol et
      const langMap: { [key: string]: string } = {
        'tr': 'tr',
        'de': 'de',
        'az': 'az',
        'fr': 'fr',
        'sv': 'sv',
        'no': 'no',
        'nb': 'no', // Norwegian Bokmål
        'nn': 'no', // Norwegian Nynorsk
        'el': 'el',
        'uk': 'uk',
        'it': 'it',
        'ja': 'ja',
        'pl': 'pl',
        'es': 'es'
      };
      
      if (langMap[langCode]) {
        return langMap[langCode];
      }
    }
    
    return 'en'; // Fallback: Diğer tüm diller İngilizce
  },
  cacheUserLanguage(lng: string) {
    // Safari uyumluluğu için kontrol
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return;
    }
    
    try {
      localStorage.setItem('i18nextLng', lng);
    } catch (e) {
      // localStorage erişim hatası (Safari private mode gibi)
      console.warn('localStorage setItem failed:', e);
    }
  }
});

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en', // Fallback dil İngilizce
    supportedLngs: ['tr', 'en', 'de', 'az', 'fr', 'sv', 'no', 'el', 'uk', 'it', 'ja', 'pl', 'es'],
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

