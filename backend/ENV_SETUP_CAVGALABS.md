# ⚙️ Backend .env Yapılandırması - cavgalabs.com

`cavgalabs.com` domain'i için backend yapılandırması.

## 📝 .env Dosyası

Backend klasöründe `.env.example` dosyasını `.env` olarak kopyalayın:

```bash
cd backend
cp .env.example .env
```

`.env` dosyasını düzenleyip gerçek değerleri ekleyin:

```env
# Google Workspace SMTP Ayarları
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=contact@cavgalabs.com
SMTP_PASS=your-app-password-here
CONTACT_EMAIL=contact@cavgalabs.com

# Google reCAPTCHA v3 (Opsiyonel)
RECAPTCHA_SECRET_KEY=your-recaptcha-secret-key

# CORS (Production'da spesifik domain kullanın)
ALLOWED_ORIGIN=*
```

## 🔑 Önemli Notlar

1. **SMTP_USER**: Google Workspace email adresiniz
   - Örnek: `contact@cavgalabs.com`
   - Veya: `info@cavgalabs.com`, `hello@cavgalabs.com`

2. **SMTP_PASS**: Google Workspace App Password
   - 16 karakter, boşluksuz
   - [App Passwords](https://myaccount.google.com/apppasswords) sayfasından oluşturun

3. **CONTACT_EMAIL**: Email alıcı adresi
   - Genellikle `SMTP_USER` ile aynı

## ✅ Kontrol

```bash
cd backend
cat .env
```

Değerlerin doğru olduğundan emin olun.

## 🧪 Test

```bash
cd backend
npm start
```

Sonra frontend'den contact formunu test edin.

