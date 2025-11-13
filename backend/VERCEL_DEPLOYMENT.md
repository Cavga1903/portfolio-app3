# 🚀 Vercel Deployment Rehberi

Backend API'yi Vercel'de serverless function olarak deploy etme.

## ✅ Vercel Uyumluluğu

Backend API zaten Vercel için hazır:
- ✅ Serverless function export mevcut
- ✅ `vercel.json` yapılandırması mevcut
- ✅ React Email template'leri çalışır
- ✅ Environment variables desteği

## 📦 Adım 1: Vercel CLI Kurulumu (Opsiyonel)

```bash
npm install -g vercel
```

## 🚀 Adım 2: Vercel'e Deploy

### 2.1. Vercel CLI ile Deploy

```bash
cd backend
vercel
```

Vercel size soracak:
- **Set up and deploy?** → `Y`
- **Which scope?** → Hesabınızı seçin
- **Link to existing project?** → `N` (yeni proje)
- **Project name?** → `portfolio-backend-api`
- **Directory?** → `./api` (veya `.`)

### 2.2. Vercel Dashboard ile Deploy

1. [Vercel Dashboard](https://vercel.com/dashboard) → **Add New Project**
2. GitHub repository'nizi bağlayın
3. **Root Directory**: `backend` seçin
4. **Build Command**: Boş bırakın (gerekmez)
5. **Output Directory**: Boş bırakın
6. **Install Command**: `npm install`
7. **Deploy** butonuna tıklayın

## ⚙️ Adım 3: Environment Variables Ayarlama

Vercel Dashboard'da:

1. Projenize gidin
2. **Settings** → **Environment Variables**
3. Aşağıdaki değişkenleri ekleyin:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=contact@cavgalabs.com
SMTP_PASS=your-app-password
CONTACT_EMAIL=contact@cavgalabs.com
RECAPTCHA_SECRET_KEY=your-recaptcha-secret-key
ALLOWED_ORIGIN=https://cavga.dev
```

**Önemli:**
- Her environment için (Production, Preview, Development) ayrı ayrı ekleyin
- `SMTP_PASS`: Google Workspace App Password (boşluksuz)
- `ALLOWED_ORIGIN`: Frontend domain'iniz (CORS için)

## 🔧 Adım 4: Vercel.json Yapılandırması

Mevcut `vercel.json` dosyası yeterli, ancak yeni Vercel yapısı için güncelleyebiliriz:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/contact.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/contact",
      "dest": "/api/contact.js"
    },
    {
      "src": "/api/health",
      "dest": "/api/contact.js"
    }
  ]
}
```

## 📝 Adım 5: Package.json Kontrolü

`backend/package.json` dosyasında `engines` ayarı:

```json
{
  "engines": {
    "node": ">=18.0.0"
  }
}
```

Vercel otomatik olarak Node.js 18+ kullanır.

## 🧪 Adım 6: Test

### 6.1. Health Check

```bash
curl https://your-project.vercel.app/api/health
```

Beklenen yanıt:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 6.2. Contact Form Test

```bash
curl -X POST https://your-project.vercel.app/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "Test mesajı",
    "language": "Turkish",
    "recaptchaToken": "test-token"
  }'
```

## 🔗 Adım 7: Frontend Entegrasyonu

Frontend'de `.env` dosyasına API endpoint'i ekleyin:

```env
VITE_API_ENDPOINT=https://your-project.vercel.app/api/contact
```

Veya `Contact.tsx` dosyasında:

```typescript
const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT || 'https://your-project.vercel.app/api/contact';
```

## ⚠️ Önemli Notlar

### 1. React Email Template'leri

React Email template'leri Vercel'de çalışır, ancak:
- `@react-email/render` paketi serverless function'da çalışır
- Template dosyaları `backend/api/templates/` klasöründe olmalı
- Import path'leri doğru olmalı

### 2. Cold Start

Vercel serverless functions'da ilk istek biraz yavaş olabilir (cold start). Sonraki istekler hızlıdır.

### 3. Timeout

Vercel serverless functions:
- **Hobby plan**: 10 saniye timeout
- **Pro plan**: 60 saniye timeout

Email gönderimi genellikle 1-2 saniye sürer, sorun olmaz.

### 4. Environment Variables

- Production, Preview, Development için ayrı ayrı ayarlayın
- Hassas bilgileri (App Password) güvenli tutun
- `.env` dosyasını git'e eklemeyin

## 🔄 Adım 8: Güncelleme

Kod değişikliklerinden sonra:

```bash
# Vercel CLI ile
vercel --prod

# Veya GitHub'a push yapın, Vercel otomatik deploy eder
git push origin main
```

## 📊 Monitoring

Vercel Dashboard'da:
- **Deployments**: Deploy geçmişi
- **Functions**: Serverless function logları
- **Analytics**: İstek sayıları, hata oranları

## ❌ Sorun Giderme

### "Module not found" Hatası

1. `package.json`'da tüm bağımlılıkların olduğundan emin olun
2. `npm install` çalıştırıldığından emin olun
3. Node.js versiyonunu kontrol edin (18+)

### "Environment variable not found" Hatası

1. Vercel Dashboard'da environment variables'ı kontrol edin
2. Doğru environment'ı seçtiğinizden emin (Production/Preview)
3. Deploy'u yeniden yapın

### "Email gönderilmedi" Sorunu

1. Vercel function loglarını kontrol edin
2. SMTP ayarlarını kontrol edin
3. App Password'ün doğru olduğundan emin olun

## ✅ Vercel Deployment Tamamlandı!

Backend API'niz artık Vercel'de çalışıyor.

## 📚 Ek Kaynaklar

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Serverless Functions](https://vercel.com/docs/functions)
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)

