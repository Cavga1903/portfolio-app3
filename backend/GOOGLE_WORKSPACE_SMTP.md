# 📧 Google Workspace SMTP Kullanımı

Google Workspace ile backend API'nizi yapılandırma rehberi.

## 🎯 Avantajlar

- ✅ Kolay kurulum (Postfix gerekmez)
- ✅ Güvenilir email gönderimi
- ✅ Profesyonel görünüm (kendi domain'inizle)
- ✅ Yüksek gönderim limitleri (2000 email/gün)
- ✅ Spam koruması
- ✅ Ücretsiz deneme süresi

## 📋 Gereksinimler

- Google Workspace hesabı
- Domain adınız (örn: `cavga.dev`)
- 2-Step Verification açık
- App Password oluşturulmuş

## 🔐 Adım 1: Google Workspace Hesabı Oluşturma

### 1.1. Google Workspace'a Kaydol

1. [Google Workspace](https://workspace.google.com/) sayfasına gidin
2. **Get Started** butonuna tıklayın
3. İş bilgilerinizi girin
4. Domain adınızı ekleyin (örn: `cavga.dev`)
5. Email adresinizi oluşturun (örn: `contact@cavga.dev`)

### 1.2. Domain Doğrulama

1. Google Workspace admin panelinde **Domain** bölümüne gidin
2. DNS kayıtlarını ekleyin (Google size verecek)
3. Domain doğrulamasını tamamlayın

## 🔑 Adım 2: App Password Oluşturma

### 2.1. 2-Step Verification'ı Açın

1. [Google Account Security](https://myaccount.google.com/security) sayfasına gidin
2. **2-Step Verification** bölümünü bulun
3. **Get Started** veya **Turn On** butonuna tıklayın
4. Telefon numaranızı doğrulayın

### 2.2. App Password Oluşturun

1. [App Passwords](https://myaccount.google.com/apppasswords) sayfasına gidin
2. **Select app** dropdown'dan **Mail** seçin
3. **Select device** dropdown'dan **Other (Custom name)** seçin
4. İsim verin: `Portfolio Backend API`
5. **Generate** butonuna tıklayın
6. **16 karakterlik şifreyi kopyalayın** (boşluksuz)

⚠️ **Önemli**: Bu şifreyi bir daha göremezsiniz! Güvenli bir yere kaydedin.

**Örnek App Password:** `abcd efgh ijkl mnop` → `abcdefghijklmnop`

## ⚙️ Adım 3: Backend API Yapılandırması

### 3.1. Environment Variables

Backend klasöründe `.env` dosyası oluşturun:

```bash
cd backend
nano .env
```

### 3.2. Google Workspace SMTP Ayarları

```env
# Google Workspace SMTP Ayarları
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=contact@cavga.dev
SMTP_PASS=abcdefghijklmnop

# E-posta Alıcı
CONTACT_EMAIL=contact@cavga.dev

# Google reCAPTCHA v3 (Opsiyonel)
RECAPTCHA_SECRET_KEY=your-recaptcha-secret-key

# CORS (Production'da spesifik domain kullanın)
ALLOWED_ORIGIN=*
```

**Örnek:**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=contact@cavga.dev
SMTP_PASS=abcd efgh ijkl mnop
CONTACT_EMAIL=contact@cavga.dev
```

⚠️ **Not**: 
- `SMTP_USER`: Google Workspace email adresiniz (kendi domain'inizle)
- `SMTP_PASS`: App Password (16 karakter, boşluksuz)
- Port `587` (TLS) veya `465` (SSL) kullanabilirsiniz

### 3.3. Port Seçenekleri

**Port 587 (TLS) - Önerilen:**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
```

**Port 465 (SSL) - Alternatif:**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
```

Backend API'nizde `contact.js` dosyasında `secure` ayarını kontrol edin:
- Port 587 için: `secure: false`
- Port 465 için: `secure: true`

## 📦 Adım 4: Backend Bağımlılıklarını Yükleyin

```bash
cd backend
npm install
```

## 🚀 Adım 5: Backend'i Başlatın

### Development Modu

```bash
npm run dev
```

### Production Modu

```bash
npm start
```

Server `http://localhost:3001` adresinde çalışacak.

## 🧪 Adım 6: Test Etme

### 6.1. Health Check

```bash
curl http://localhost:3001/api/health
```

Beklenen yanıt:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 6.2. Contact Form Testi

Frontend'den form gönderin veya curl ile test edin:

```bash
curl -X POST http://localhost:3001/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "Bu bir test mesajıdır.",
    "language": "Turkish",
    "recaptchaToken": "test-token"
  }'
```

### 6.3. Frontend'den Test

1. Frontend'i başlatın
2. Contact formunu doldurun
3. Gönder butonuna tıklayın
4. Google Workspace inbox'unuzu kontrol edin

## ✅ Başarılı Test İşaretleri

- ✅ Backend server çalışıyor
- ✅ Health check başarılı
- ✅ Email gönderildi (Google Workspace inbox'unda görünüyor)
- ✅ React Email template düzgün render edildi
- ✅ Gönderen adresi: `contact@cavga.dev` (kendi domain'inizle)

## 📊 Google Workspace SMTP Limitleri

- **Günlük limit**: 2000 email/gün (Workspace hesabı için)
- **Saatlik limit**: ~100 email/saat
- **Dakika başına limit**: ~20 email/dakika
- **Gönderen adresi**: Kendi domain'inizle (örn: `contact@cavga.dev`)

## 🔧 Adım 7: Birden Fazla Proje İçin

### 7.1. Her Proje İçin Ayrı Email Adresi

Google Workspace'te birden fazla email adresi oluşturabilirsiniz:

1. Google Workspace admin panelinde **Users** bölümüne gidin
2. Yeni kullanıcı ekleyin veya mevcut kullanıcıya alias ekleyin
3. Her proje için ayrı email adresi:
   - `contact@cavga.dev` → Portfolio
   - `contact@project2.com` → İkinci proje (alias)
   - `contact@project3.com` → Üçüncü proje (alias)

### 7.2. Her Proje İçin Ayrı App Password

Her email adresi için ayrı App Password oluşturun:

1. Her email adresiyle [App Passwords](https://myaccount.google.com/apppasswords) sayfasına gidin
2. Ayrı App Password oluşturun
3. Her proje için ayrı `.env` dosyası kullanın

### 7.3. Backend API Yapılandırması

**Proje 1 (Portfolio):**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=contact@cavga.dev
SMTP_PASS=password1
CONTACT_EMAIL=contact@cavga.dev
```

**Proje 2:**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=contact@project2.com
SMTP_PASS=password2
CONTACT_EMAIL=contact@project2.com
```

## ❌ Sorun Giderme

### "Invalid login" Hatası

**Sorun**: Google Workspace App Password yanlış veya 2-Step Verification kapalı.

**Çözüm**:
1. 2-Step Verification'ın açık olduğundan emin olun
2. Yeni bir App Password oluşturun
3. `.env` dosyasındaki `SMTP_PASS` değerini güncelleyin
4. App Password'de boşluk varsa kaldırın
5. Backend'i yeniden başlatın

### "Connection timeout" Hatası

**Sorun**: Firewall veya network sorunu.

**Çözüm**:
1. Port 587'nin açık olduğundan emin olun
2. VPN kullanıyorsanız kapatın
3. Network bağlantınızı kontrol edin
4. Port 465 (SSL) deneyin

### "Email gönderilmedi" Sorunu

**Sorun**: Backend hatası veya SMTP ayarları yanlış.

**Çözüm**:
1. Backend loglarını kontrol edin
2. `.env` dosyasındaki değerleri kontrol edin:
   - `SMTP_USER`: Google Workspace email adresiniz (örn: `contact@cavga.dev`)
   - `SMTP_PASS`: App Password (16 karakter, boşluksuz)
3. Google Workspace SMTP ayarlarını doğrulayın

### "Sender address rejected" Hatası

**Sorun**: Gönderen adresi Google Workspace'te doğrulanmamış.

**Çözüm**:
1. Google Workspace admin panelinde email adresinizi kontrol edin
2. Email adresinin aktif olduğundan emin olun
3. Domain doğrulamasının tamamlandığından emin olun

## 💰 Google Workspace Fiyatlandırma

- **Business Starter**: $6/kullanıcı/ay (30 GB)
- **Business Standard**: $12/kullanıcı/ay (2 TB)
- **Business Plus**: $18/kullanıcı/ay (5 TB)
- **14 günlük ücretsiz deneme** mevcut

**Not**: Email gönderimi için en az 1 kullanıcı yeterlidir.

## 🔒 Güvenlik Notları

1. **App Password kullanın**: Normal şifre kullanmayın
2. **2-Step Verification açık olmalı**: App Password için zorunlu
3. **Environment variables güvenli tutun**: `.env` dosyasını git'e eklemeyin
4. **Rate limiting**: Backend API'nizde rate limiting aktif

## 📚 Ek Kaynaklar

- [Google Workspace](https://workspace.google.com/)
- [Google Workspace SMTP Settings](https://support.google.com/a/answer/176600)
- [App Passwords](https://support.google.com/accounts/answer/185833)

## ✅ Google Workspace SMTP Yapılandırması Tamamlandı!

Artık backend API'niz Google Workspace SMTP ile çalışıyor. Email'ler kendi domain'inizle (`contact@cavga.dev`) gönderilecek.

## 🆚 Google Workspace vs Postfix

| Özellik | Google Workspace | Postfix |
|---------|------------------|---------|
| Kurulum | ✅ Kolay | ❌ Karmaşık |
| Bakım | ✅ Yok | ❌ Gerekli |
| Güvenilirlik | ✅ Yüksek | ⚠️ Sunucuya bağlı |
| Spam koruması | ✅ Otomatik | ⚠️ Manuel |
| Maliyet | 💰 $6/ay | 💰 Sunucu maliyeti |
| Limit | ✅ 2000/gün | ⚠️ Sunucu kapasitesi |
| Domain | ✅ Kendi domain'inizle | ✅ Kendi domain'inizle |

**Öneri**: Google Workspace daha kolay ve güvenilir. Postfix sadece tam kontrol istiyorsanız veya çok yüksek volume gerekiyorsa tercih edilir.

