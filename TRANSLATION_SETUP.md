# Blog Translation Setup Guide

## Overview
The blog system now supports automatic translation to multiple languages. When you create a blog post, you can automatically translate it to all supported languages using Google Translate API.

## Supported Languages
- Turkish (tr) - Default source language
- English (en)
- German (de)
- Azerbaijani (az)
- Spanish (es)
- French (fr)
- Italian (it)
- Polish (pl)
- Ukrainian (uk)
- Greek (el)
- Japanese (ja)
- Swedish (sv)
- Norwegian (no)

## Setup Instructions

### Option 1: Google Translate API (Recommended)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the "Cloud Translation API"
4. Create credentials (API Key)
5. Add the API key to your `.env` file:
   ```
   VITE_GOOGLE_TRANSLATE_API_KEY=your_api_key_here
   ```
6. Add the same key to Vercel environment variables

**Free Tier:** 500,000 characters/month

### Option 2: DeepL API (More Accurate, Paid)
1. Sign up at [DeepL API](https://www.deepl.com/pro-api)
2. Get your API key
3. Add to `.env`:
   ```
   VITE_DEEPL_API_KEY=your_api_key_here
   ```
4. Update `translationService.ts` to use `translateWithDeepL` instead of `translateText`

**Free Tier:** 500,000 characters/month (then paid)

## How It Works

1. **Create a Blog Post:**
   - Fill in title, content, and excerpt in your source language (default: Turkish)
   - Click "Translate to All Languages" button
   - The system will translate to all supported languages
   - Translations are saved in the `translations` field in Firestore

2. **Viewing Posts:**
   - When a user views a blog post, the system automatically shows the translation for their current language
   - If no translation exists, it falls back to the original language

3. **Data Structure:**
   ```typescript
   {
     title: "Original Title",
     content: "Original Content",
     excerpt: "Original Excerpt",
     translations: {
       en: {
         title: "Translated Title",
         content: "Translated Content",
         excerpt: "Translated Excerpt"
       },
       de: { ... },
       // ... other languages
     }
   }
   ```

## Usage in Code

### Translating a Blog Post
```typescript
import { translateBlogPost } from '@/features/blog/services/translationService';

const translations = await translateBlogPost(
  title,
  content,
  excerpt,
  'tr' // source language
);
```

### Getting Translated Post
The `blogService.getPosts()` and `blogService.getPost()` functions automatically use the current language from `i18n.language`:

```typescript
// Automatically uses current language
const posts = await blogService.getPosts(i18n.language);
const post = await blogService.getPost(slug, i18n.language);
```

## Notes

- Translations are stored in Firestore, so they persist across sessions
- If translation fails, the original text is used as fallback
- You can manually edit translations in Firestore if needed
- The translation button is only enabled when title, content, and excerpt are filled

## Troubleshooting

1. **Translation not working:**
   - Check if API key is set in environment variables
   - Verify API key is valid and has quota remaining
   - Check browser console for errors

2. **Translations not showing:**
   - Ensure translations were saved to Firestore
   - Check that `i18n.language` matches the translation key (e.g., 'en', 'tr')
   - Verify the blog post has a `translations` field

3. **API Rate Limits:**
   - Google Translate: 500,000 characters/month (free)
   - DeepL: 500,000 characters/month (free), then paid
   - Consider caching translations to reduce API calls

