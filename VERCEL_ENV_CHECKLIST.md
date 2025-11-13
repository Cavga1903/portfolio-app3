# ✅ Vercel Environment Variables Kontrol Listesi

Production için gerekli environment variables.

## 🔧 Backend API (api/ klasörü)

Vercel Dashboard'da **Settings** → **Environment Variables**:

### Zorunlu:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=contact@cavgalabs.com
SMTP_PASS=your-app-password-here
CONTACT_EMAIL=contact@cavgalabs.com
RECAPTCHA_SECRET_KEY=your-recaptcha-secret-key
NODE_ENV=production
```

### Opsiyonel:
```env
ALLOWED_ORIGIN=https://cavga.dev
```

## 🎨 Frontend (Root)

Vercel Dashboard'da **Settings** → **Environment Variables**:

### Zorunlu:
```env
VITE_RECAPTCHA_SITE_KEY=your-recaptcha-site-key
```

### Opsiyonel:
```env
VITE_API_ENDPOINT=https://cavga.dev/api/contact
```

## ✅ Kontrol

### 1. RECAPTCHA_SECRET_KEY
- ✅ **Zaten eklemişsiniz** (görüntüden görüyorum)
- Backend'de kullanılıyor

### 2. VITE_RECAPTCHA_SITE_KEY
- ❓ **Kontrol edin** - Frontend'de gerekli
- Eğer yoksa ekleyin

### 3. SMTP Ayarları
- ❓ **Kontrol edin** - Email gönderimi için gerekli

## 🔍 Hata Ayıklama

### "reCAPTCHA verification is required" Hatası

**Neden:**
- Frontend'de `VITE_RECAPTCHA_SITE_KEY` eksik
- reCAPTCHA script yüklenemiyor
- Token alınamıyor

**Çözüm:**
1. Vercel Dashboard'da `VITE_RECAPTCHA_SITE_KEY` ekleyin
2. Redeploy yapın
3. Browser console'da kontrol edin:
   ```javascript
   console.log('Site Key:', import.meta.env.VITE_RECAPTCHA_SITE_KEY);
   ```

### Backend Log Kontrolü

Vercel function loglarında şunları görürsünüz:
- `reCAPTCHA token missing` → Frontend'de token alınamıyor
- `reCAPTCHA verification failed` → Token doğrulanamıyor
- `RECAPTCHA_SECRET_KEY not set` → Secret key eksik (ama sizde var)

## 📝 Hızlı Kontrol

Vercel Dashboard'da:
1. Projenize gidin
2. **Settings** → **Environment Variables**
3. Şunların olduğundan emin olun:
   - ✅ `RECAPTCHA_SECRET_KEY` (var)
   - ❓ `VITE_RECAPTCHA_SITE_KEY` (kontrol edin)
   - ❓ `SMTP_USER`, `SMTP_PASS`, `CONTACT_EMAIL` (kontrol edin)

## 🎯 Sonraki Adım

`VITE_RECAPTCHA_SITE_KEY`'i Vercel'e ekleyin ve redeploy yapın.

