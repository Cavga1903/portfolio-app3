# 🔧 Frontend Environment Variables

Frontend için environment variables rehberi.

## 📝 VITE_API_ENDPOINT

### Ne İşe Yarar?

Backend API endpoint'ini belirler. Contact form gönderiminde kullanılır.

### Mevcut Durum

Kodda otomatik algılama var:

```typescript
const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT || 
  (window.location.hostname === 'localhost' 
    ? 'http://localhost:3001/api/contact' 
    : `${window.location.origin}/api/contact`);
```

**Nasıl Çalışır:**
- `VITE_API_ENDPOINT` set edilmişse → Onu kullanır
- Set edilmemişse:
  - Local'de (`localhost`) → `http://localhost:3001/api/contact`
  - Production'da → `https://cavga.dev/api/contact` (aynı domain)

### Ne Zaman Gerekli?

**Şu anda gerekli değil!** Çünkü:
- Backend aynı projede (`api/` klasörü)
- Production'da aynı domain'de çalışacak
- Otomatik algılama yeterli

### Ne Zaman Gerekli Olur?

Eğer backend'i **ayrı bir Vercel projesinde** deploy ederseniz:

```env
VITE_API_ENDPOINT=https://portfolio-backend-api.vercel.app/api/contact
```

### Nasıl Kullanılır?

#### 1. Local Development

`.env` dosyası oluşturun (root'ta):

```env
# Local development için (opsiyonel)
VITE_API_ENDPOINT=http://localhost:3001/api/contact
```

#### 2. Production (Vercel)

Vercel Dashboard'da:
1. Projenize gidin
2. **Settings** → **Environment Variables**
3. Ekleyin:

```env
VITE_API_ENDPOINT=https://cavga.dev/api/contact
```

**Veya** backend ayrı projede ise:

```env
VITE_API_ENDPOINT=https://portfolio-backend-api.vercel.app/api/contact
```

### Örnek .env Dosyası

Root'ta `.env` dosyası oluşturun:

```env
# Backend API Endpoint (Opsiyonel - otomatik algılama var)
# VITE_API_ENDPOINT=https://cavga.dev/api/contact

# Google reCAPTCHA v3 Site Key
VITE_RECAPTCHA_SITE_KEY=your-recaptcha-site-key
```

### Özet

- **Şu anda:** `VITE_API_ENDPOINT` gerekli değil (otomatik algılama var)
- **Backend aynı projede:** Gerek yok
- **Backend ayrı projede:** `VITE_API_ENDPOINT` ekleyin

### Kontrol

Kod zaten akıllı:
- Local'de → `localhost:3001`
- Production'da → Aynı domain (`/api/contact`)

**Sonuç:** Şu anda hiçbir şey yapmanıza gerek yok! 🎉

