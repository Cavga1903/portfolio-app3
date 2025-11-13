# ⚡ Vercel'e Hızlı Deploy

Backend API'yi Vercel'e deploy etme (5 dakika).

## 🚀 Hızlı Adımlar

### 1. Vercel Dashboard'a Git

1. [Vercel Dashboard](https://vercel.com/dashboard) → Giriş yapın
2. **Add New Project** butonuna tıklayın

### 2. GitHub Repository Bağla

1. GitHub repository'nizi seçin (`portfolio-app3`)
2. **Import** butonuna tıklayın

### 3. Yapılandırma

**Root Directory:** `backend` seçin

**Build Settings:**
- **Framework Preset:** Other
- **Build Command:** (boş bırakın)
- **Output Directory:** (boş bırakın)
- **Install Command:** `npm install`

**Environment Variables:** (Şimdilik atlayın, sonra ekleyeceğiz)

**Deploy** butonuna tıklayın

### 4. Environment Variables Ekle

Deploy tamamlandıktan sonra:

1. Projenize gidin
2. **Settings** → **Environment Variables**
3. Aşağıdaki değişkenleri ekleyin:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=contact@cavgalabs.com
SMTP_PASS=your-app-password-here
CONTACT_EMAIL=contact@cavgalabs.com
RECAPTCHA_SECRET_KEY=your-recaptcha-secret-key
ALLOWED_ORIGIN=https://cavga.dev
NODE_ENV=production
```

**Önemli:**
- Her environment için (Production, Preview, Development) ayrı ayrı ekleyin
- `SMTP_PASS`: Google Workspace App Password (boşluksuz)
- `ALLOWED_ORIGIN`: Frontend domain'iniz (`https://cavga.dev`)

### 5. Redeploy

Environment variables ekledikten sonra:
1. **Deployments** sekmesine gidin
2. Son deployment'ın yanındaki **⋯** → **Redeploy**

## 🔗 API Endpoint

Deploy tamamlandıktan sonra API endpoint'iniz:
```
https://your-project-name.vercel.app/api/contact
```

## 🔧 Frontend Yapılandırması

Frontend'de `.env` dosyasına ekleyin:

```env
VITE_API_ENDPOINT=https://your-project-name.vercel.app/api/contact
```

Veya `Contact.tsx` dosyasında:

```typescript
const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT || 'https://your-project-name.vercel.app/api/contact';
```

## ✅ Test

```bash
# Health check
curl https://your-project-name.vercel.app/api/health

# Contact form test
curl -X POST https://your-project-name.vercel.app/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "email": "test@example.com",
    "message": "Test mesajı",
    "language": "Turkish"
  }'
```

## 📚 Detaylı Rehber

Daha fazla bilgi için: `backend/VERCEL_DEPLOYMENT.md`

