/**
 * Translation Service for Blog Posts
 * Uses Google Translate API (free tier) or DeepL API for automatic translations
 */

// Supported languages for translation
export const SUPPORTED_LANGUAGES = [
  { code: 'tr', name: 'Turkish' },
  { code: 'en', name: 'English' },
  { code: 'de', name: 'German' },
  { code: 'az', name: 'Azerbaijani' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'it', name: 'Italian' },
  { code: 'pl', name: 'Polish' },
  { code: 'uk', name: 'Ukrainian' },
  { code: 'el', name: 'Greek' },
  { code: 'ja', name: 'Japanese' },
  { code: 'sv', name: 'Swedish' },
  { code: 'no', name: 'Norwegian' },
];

interface TranslationResult {
  translatedText: string;
}

/**
 * Translate text using Google Translate API (free tier via RapidAPI or direct)
 * Note: For production, you should use a backend API to hide your API key
 */
export const translateText = async (
  text: string,
  targetLanguage: string,
  sourceLanguage: string = 'tr'
): Promise<string> => {
  try {
    // Option 1: Use Google Translate API via RapidAPI (free tier available)
    // You'll need to sign up at https://rapidapi.com/googlecloud/api/google-translate1
    const apiKey = import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY;
    
    if (!apiKey) {
      console.warn('Google Translate API key not found. Using fallback translation.');
      // Fallback: Return original text if no API key
      return text;
    }

    // Using Google Translate API v2 (free tier: 500,000 characters/month)
    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          target: targetLanguage,
          source: sourceLanguage,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Translation API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data.translations[0].translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    // Fallback: Return original text if translation fails
    return text;
  }
};

/**
 * Translate a blog post to all supported languages
 */
export const translateBlogPost = async (
  title: string,
  content: string,
  excerpt: string,
  sourceLanguage: string = 'tr'
): Promise<Record<string, { title: string; content: string; excerpt: string }>> => {
  const translations: Record<string, { title: string; content: string; excerpt: string }> = {};

  // Translate to all supported languages except the source language
  const targetLanguages = SUPPORTED_LANGUAGES
    .map((lang) => lang.code)
    .filter((code) => code !== sourceLanguage);

  // Translate in parallel (but be mindful of API rate limits)
  const translationPromises = targetLanguages.map(async (targetLang) => {
    try {
      const [translatedTitle, translatedContent, translatedExcerpt] = await Promise.all([
        translateText(title, targetLang, sourceLanguage),
        translateText(content, targetLang, sourceLanguage),
        translateText(excerpt, targetLang, sourceLanguage),
      ]);

      return {
        lang: targetLang,
        translation: {
          title: translatedTitle,
          content: translatedContent,
          excerpt: translatedExcerpt,
        },
      };
    } catch (error) {
      console.error(`Failed to translate to ${targetLang}:`, error);
      return null;
    }
  });

  const results = await Promise.all(translationPromises);

  // Build translations object
  results.forEach((result) => {
    if (result) {
      translations[result.lang] = result.translation;
    }
  });

  return translations;
};

/**
 * Alternative: Use DeepL API (more accurate, but paid after free tier)
 * Sign up at https://www.deepl.com/pro-api
 */
export const translateWithDeepL = async (
  text: string,
  targetLanguage: string,
  sourceLanguage: string = 'tr'
): Promise<string> => {
  try {
    const apiKey = import.meta.env.VITE_DEEPL_API_KEY;
    
    if (!apiKey) {
      console.warn('DeepL API key not found. Using fallback translation.');
      return text;
    }

    // DeepL API endpoint
    const response = await fetch('https://api-free.deepl.com/v2/translate', {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${apiKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        text,
        target_lang: targetLanguage.toUpperCase(),
        source_lang: sourceLanguage.toUpperCase(),
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepL API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.translations[0].text;
  } catch (error) {
    console.error('DeepL translation error:', error);
    return text;
  }
};

