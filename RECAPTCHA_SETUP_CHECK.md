# 🔍 reCAPTCHA Hata Kontrol Listesi

"reCAPTCHA verification is required" hatası için kontrol listesi.

## ✅ Kontrol Listesi

### 1. Frontend - VITE_RECAPTCHA_SITE_KEY

**Vercel Dashboard'da:**
1. Projenize gidin
2. **Settings** → **Environment Variables**
3. Kontrol edin:

```env
VITE_RECAPTCHA_SITE_KEY=your-recaptcha-site-key
```

**Önemli:** 
- Frontend için `VITE_` prefix'i gerekli
- Production, Preview, Development için ayrı ayrı ekleyin

### 2. Backend - RECAPTCHA_SECRET_KEY

**Vercel Dashboard'da:**
1. Projenize gidin
2. **Settings** → **Environment Variables**
3. Kontrol edin:

```env
RECAPTCHA_SECRET_KEY=your-recaptcha-secret-key
```

✅ **Zaten eklemişsiniz** - Bu tamam!

### 3. reCAPTCHA Site Key ve Secret Key Eşleşmesi

**Kontrol:**
- Site Key (frontend) ve Secret Key (backend) aynı reCAPTCHA projesinden olmalı
- İkisi de v3 olmalı (veya ikisi de v2)

### 4. Domain Kontrolü

**reCAPTCHA Console'da:**
1. [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin) → Projenize gidin
2. **Domains** bölümünde `cavga.dev` ekli mi kontrol edin
3. Production domain'iniz ekli olmalı

### 5. Frontend Console Kontrolü

Browser console'da şunları kontrol edin:

```javascript
// reCAPTCHA yüklendi mi?
console.log(window.grecaptcha);

// Site key var mı?
console.log(import.meta.env.VITE_RECAPTCHA_SITE_KEY);
```

### 6. Backend Log Kontrolü

Vercel function loglarında:
- `reCAPTCHA token missing or empty` → Token gönderilmiyor
- `reCAPTCHA verification failed` → Token doğrulanamıyor
- `RECAPTCHA_SECRET_KEY not set` → Secret key eksik

## 🔧 Hızlı Çözüm

### Çözüm 1: VITE_RECAPTCHA_SITE_KEY Ekle

Vercel Dashboard'da frontend projenize:

```env
VITE_RECAPTCHA_SITE_KEY=your-recaptcha-site-key
```

### Çözüm 2: reCAPTCHA'yı Geçici Olarak Devre Dışı Bırak

Test için backend'de `RECAPTCHA_SECRET_KEY`'i geçici olarak kaldırın (production'da tekrar ekleyin).

## 📝 Kontrol Adımları

1. ✅ `RECAPTCHA_SECRET_KEY` Vercel'de var mı? → **Evet, eklemişsiniz**
2. ❓ `VITE_RECAPTCHA_SITE_KEY` Vercel'de var mı? → **Kontrol edin**
3. ❓ Domain `cavga.dev` reCAPTCHA'da ekli mi? → **Kontrol edin**
4. ❓ Site Key ve Secret Key eşleşiyor mu? → **Kontrol edin**

## 🧪 Test

Browser console'da:

```javascript
// reCAPTCHA yüklendi mi?
console.log('grecaptcha:', window.grecaptcha);

// Site key var mı?
console.log('Site Key:', import.meta.env.VITE_RECAPTCHA_SITE_KEY);
```

Eğer `undefined` görürseniz, `VITE_RECAPTCHA_SITE_KEY` eksik demektir.

