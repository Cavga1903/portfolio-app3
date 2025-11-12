# 📧 Portfolio Contact Form Backend API

Bağımsız backend API - EmailJS yerine kendi backend'iniz ile e-posta gönderimi.

## 🚀 Kurulum

### 1. Bağımlılıkları Yükleyin

```bash
cd backend
npm install
```

### 2. Environment Variables Ayarlayın

`.env` dosyası oluşturun:

```env
# SMTP Ayarları
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# E-posta Alıcı
CONTACT_EMAIL=your-email@gmail.com

# CORS (Production'da spesifik domain kullanın)
ALLOWED_ORIGIN=https://yourdomain.com
```

### 3. Gmail App Password Oluşturma

1. Google Account → Security
2. 2-Step Verification'ı açın
3. App Passwords → Generate
4. Oluşan şifreyi `SMTP_PASS` olarak kullanın

## 📦 Deployment Seçenekleri

### Vercel (Serverless Functions)

1. `backend/api/contact.js` dosyasını Vercel'e deploy edin
2. Environment variables'ı Vercel dashboard'dan ekleyin
3. API endpoint: `https://your-project.vercel.app/api/contact`

**Vercel için:**
- `backend/api/vercel.json` dosyasını kullanın
- Vercel otomatik olarak serverless function olarak çalıştırır

### Railway / Render (Standalone Server)

1. `backend/package.json` ve `backend/api/contact.js` dosyalarını deploy edin
2. Environment variables'ı platform dashboard'dan ekleyin
3. Port: `3001` (veya `PORT` environment variable)

### Kendi Sunucunuz

```bash
cd backend
npm start
```

Server `http://localhost:3001` adresinde çalışacak.

## 🔧 Frontend Entegrasyonu

`src/components/Contact.tsx` dosyasını güncelleyin:

```typescript
// API endpoint'inizi buraya yazın
const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT || 'https://your-api.vercel.app/api/contact';

// handleSubmit içinde:
const response = await fetch(API_ENDPOINT, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: formData.name.trim(),
    email: formData.email.trim(),
    message: formData.message.trim(),
    language: currentLanguage,
    captchaAnswer: formData.captchaAnswer,
    captchaQuestion: captcha?.question,
  }),
});

if (!response.ok) {
  throw new Error('Failed to send email');
}

const data = await response.json();
```

## 🛡️ Güvenlik

- ✅ Rate limiting (15 dakikada 5 istek)
- ✅ Input validation
- ✅ CAPTCHA doğrulama
- ✅ CORS koruması
- ✅ Email format validation

## 📝 API Endpoints

### POST `/api/contact`

Contact form submission.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello!",
  "language": "English 🇬🇧",
  "captchaAnswer": "8",
  "captchaQuestion": "What is 5 + 3?"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email sent successfully!"
}
```

### GET `/api/health`

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🔍 Troubleshooting

### Email Gönderilemiyor

1. SMTP ayarlarınızı kontrol edin
2. Gmail App Password kullanıyorsanız, normal şifre çalışmaz
3. Firewall/proxy ayarlarınızı kontrol edin

### CORS Hatası

Production'da `ALLOWED_ORIGIN` environment variable'ını spesifik domain olarak ayarlayın:
```env
ALLOWED_ORIGIN=https://yourdomain.com
```

### Rate Limit Hatası

15 dakika bekleyin veya rate limit ayarlarını `express-rate-limit` konfigürasyonunda değiştirin.

