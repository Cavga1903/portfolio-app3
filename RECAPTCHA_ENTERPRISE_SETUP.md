# 🔐 reCAPTCHA Enterprise Kurulum Rehberi

reCAPTCHA Enterprise için Google Cloud Console yapılandırması.

## ✅ Credential Type Seçimi

### "Application data" Seçin ✅

**Neden?**
- Backend'de token doğrulaması yapıyoruz (server-side)
- Kullanıcı verisi değil, uygulama verisi
- Service account oluşturur
- Backend API için uygun

### "User data" Seçmeyin ❌

**Neden?**
- OAuth client oluşturur
- Kullanıcı consent gerektirir
- Frontend/client-side için uygun
- Bizim kullanım senaryomuz için değil

## 📋 Adım Adım Kurulum

### 1. Google Cloud Console'da

1. **Credential Type** sayfasında:
   - **Which API are you using?** → `reCAPTCHA Enterprise API` ✅
   - **What data will you be accessing?** → **"Application data"** ✅ (seçin)
   - **Next** butonuna tıklayın

2. **Your Credentials** sayfasında:
   - Service account oluşturulacak
   - JSON key dosyası indirilecek

### 2. Backend Yapılandırması

İki seçenek var:

#### Seçenek A: Basit Siteverify Endpoint (Mevcut - Önerilen) ✅

Backend'de zaten kullanıyoruz, çalışıyor:

```javascript
const verifyResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
  method: 'POST',
  body: `secret=${recaptchaSecretKey}&response=${recaptchaToken}`
});
```

**Avantajlar:**
- ✅ Basit
- ✅ Çalışıyor
- ✅ Ekstra dependency yok
- ✅ Service account gerekmez

#### Seçenek B: Google Cloud SDK (Gelişmiş)

Google Cloud SDK kullanmak isterseniz:

1. Service account JSON key'i indirin
2. Backend'e ekleyin
3. `@google-cloud/recaptcha-enterprise` paketi kurun

**Avantajlar:**
- ✅ Daha gelişmiş özellikler
- ✅ Risk analizi
- ✅ Detaylı loglar

**Dezavantajlar:**
- ❌ Daha karmaşık
- ❌ Service account yönetimi
- ❌ Ekstra dependency

## 🎯 Öneri

**Şu anki durum için:** Seçenek A (Basit Siteverify) yeterli ve çalışıyor.

**Gelecekte:** Daha gelişmiş özellikler isterseniz Seçenek B'ye geçebilirsiniz.

## ✅ Sonuç

1. **"Application data" seçin** ✅
2. Service account oluşturun
3. Mevcut backend kodu çalışıyor (siteverify endpoint)
4. Gerekirse gelecekte Google Cloud SDK'ya geçebilirsiniz

## 📝 Not

Backend'deki mevcut kod zaten reCAPTCHA Enterprise token'larını doğrulayabilir. Siteverify endpoint'i hem normal hem Enterprise token'ları için çalışır.

