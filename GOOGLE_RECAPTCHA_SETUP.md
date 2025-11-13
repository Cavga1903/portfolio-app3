# 🔒 Google reCAPTCHA v3 Kurulum Rehberi

## 📋 Adımlar

### 1. Google reCAPTCHA Site Key ve Secret Key Alma

1. https://www.google.com/recaptcha/admin/create adresine gidin
2. Google hesabınızla giriş yapın
3. Yeni bir site oluşturun:
   - **Label**: Portfolio Contact Form (veya istediğiniz isim)
   - **reCAPTCHA type**: reCAPTCHA v3 (Score-based)
   - **Domains**: 
     - `localhost` (development için)
     - `tolgacavga.com` (production için)
     - `www.tolgacavga.com` (opsiyonel)
   - **Owners**: Email adresiniz
4. "Submit" butonuna tıklayın
5. **Site Key** ve **Secret Key**'i kopyalayın

### 2. Environment Variables

#### Frontend (.env)
```env
VITE_RECAPTCHA_SITE_KEY=your_site_key_here
```

#### Backend (Vercel Environment Variables)
```env
RECAPTCHA_SECRET_KEY=your_secret_key_here
```

### 3. Kullanım

- reCAPTCHA v3 görünmez, arka planda çalışır
- Form submit edilirken otomatik olarak token alınır
- Backend'de token doğrulaması ve score kontrolü yapılacak (score < 0.5 ise reddedilir)
- Spam koruması sağlanacak

## 🔐 Güvenlik Notları

- **Site Key**: Frontend'de kullanılır, public olabilir
- **Secret Key**: Sadece backend'de kullanılır, ASLA frontend'e eklenmemeli
- Secret Key'i environment variable olarak saklayın
- Production'da domain'leri doğru ayarlayın

