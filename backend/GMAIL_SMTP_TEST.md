# 📧 Gmail SMTP ile Hızlı Test Rehberi

Backend API'nizi Gmail SMTP ile test etmek için hızlı kurulum.

## 🎯 Gereksinimler

- Gmail hesabı
- 2-Step Verification açık
- App Password oluşturulmuş

## 🔐 Adım 1: Gmail App Password Oluşturma

### 1.1. 2-Step Verification'ı Açın

1. [Google Account Security](https://myaccount.google.com/security) sayfasına gidin
2. **2-Step Verification** bölümünü bulun
3. **Get Started** veya **Turn On** butonuna tıklayın
4. Telefon numaranızı doğrulayın

### 1.2. App Password Oluşturun

1. [App Passwords](https://myaccount.google.com/apppasswords) sayfasına gidin
2. **Select app** dropdown'dan **Mail** seçin
3. **Select device** dropdown'dan **Other (Custom name)** seçin
4. İsim verin: `Portfolio Backend API`
5. **Generate** butonuna tıklayın
6. **16 karakterlik şifreyi kopyalayın** (boşluksuz, örnek: `abcd efgh ijkl mnop` → `abcdefghijklmnop`)

⚠️ **Önemli**: Bu şifreyi bir daha göremezsiniz! Güvenli bir yere kaydedin.

## ⚙️ Adım 2: Environment Variables Ayarlama

### 2.1. Backend Klasöründe `.env` Dosyası Oluşturun

```bash
cd backend
nano .env
```

### 2.2. Gmail SMTP Ayarlarını Ekleyin

```env
# Gmail SMTP Ayarları
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=abcdefghijklmnop

# E-posta Alıcı (genellikle aynı email)
CONTACT_EMAIL=your-email@gmail.com

# Google reCAPTCHA v3 (Opsiyonel)
RECAPTCHA_SECRET_KEY=your-recaptcha-secret-key

# CORS (Production'da spesifik domain kullanın)
ALLOWED_ORIGIN=*
```

**Örnek:**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tolgacavga@gmail.com
SMTP_PASS=abcd efgh ijkl mnop
CONTACT_EMAIL=tolgacavga@gmail.com
```

⚠️ **Not**: `SMTP_PASS` değerinde boşluk varsa kaldırın veya tırnak içine alın.

## 📦 Adım 3: Backend Bağımlılıklarını Yükleyin

```bash
cd backend
npm install
```

## 🚀 Adım 4: Backend'i Başlatın

### Development Modu

```bash
npm run dev
```

### Production Modu

```bash
npm start
```

Server `http://localhost:3001` adresinde çalışacak.

## 🧪 Adım 5: Test Etme

### 5.1. Health Check

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

### 5.2. Contact Form Testi

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

⚠️ **Not**: reCAPTCHA token'ı geçerli olmalı. Test için `RECAPTCHA_SECRET_KEY`'i geçici olarak boş bırakabilirsiniz (production'da kullanmayın).

### 5.3. Frontend'den Test

1. Frontend'i başlatın
2. Contact formunu doldurun
3. Gönder butonuna tıklayın
4. Gmail inbox'unuzu kontrol edin

## ✅ Başarılı Test İşaretleri

- ✅ Backend server çalışıyor
- ✅ Health check başarılı
- ✅ Email gönderildi (Gmail inbox'unda görünüyor)
- ✅ React Email template düzgün render edildi

## ❌ Sorun Giderme

### "Invalid login" Hatası

**Sorun**: Gmail App Password yanlış veya 2-Step Verification kapalı.

**Çözüm**:
1. 2-Step Verification'ın açık olduğundan emin olun
2. Yeni bir App Password oluşturun
3. `.env` dosyasındaki `SMTP_PASS` değerini güncelleyin
4. Backend'i yeniden başlatın

### "Connection timeout" Hatası

**Sorun**: Firewall veya network sorunu.

**Çözüm**:
1. Port 587'nin açık olduğundan emin olun
2. VPN kullanıyorsanız kapatın
3. Network bağlantınızı kontrol edin

### "Email gönderilmedi" Sorunu

**Sorun**: Backend hatası veya SMTP ayarları yanlış.

**Çözüm**:
1. Backend loglarını kontrol edin:
```bash
# Terminal'de hata mesajlarını görün
```

2. `.env` dosyasındaki değerleri kontrol edin:
```bash
cat backend/.env
```

3. Gmail SMTP ayarlarını doğrulayın:
   - `SMTP_HOST=smtp.gmail.com`
   - `SMTP_PORT=587`
   - `SMTP_USER` = Gmail adresiniz
   - `SMTP_PASS` = App Password (16 karakter, boşluksuz)

### "reCAPTCHA verification failed" Hatası

**Sorun**: reCAPTCHA token geçersiz veya secret key yanlış.

**Çözüm**:
1. Test için `RECAPTCHA_SECRET_KEY`'i geçici olarak boş bırakın
2. Production'da geçerli bir secret key kullanın
3. Frontend'de site key'in doğru olduğundan emin olun

## 🔒 Güvenlik Notları

⚠️ **Önemli**: Gmail SMTP sadece test için kullanılmalıdır!

**Neden?**
- Günlük gönderim limiti var (500 email/gün)
- Spam riski
- Production için önerilmez

**Production için:**
- Kendi SMTP sunucunuzu kullanın (Postfix)
- Veya profesyonel email servisi (SendGrid, Mailgun, vb.)

## 📊 Gmail SMTP Limitleri

- **Günlük limit**: 500 email/gün
- **Saatlik limit**: ~100 email/saat
- **Dakika başına limit**: ~20 email/dakika

## 🎯 Sonraki Adımlar

Test başarılı olduktan sonra:

1. ✅ Kendi SMTP sunucunuzu kurun (Postfix)
2. ✅ Environment variables'ı production değerleriyle güncelleyin
3. ✅ reCAPTCHA secret key'i ekleyin
4. ✅ CORS ayarlarını production domain'inize göre yapın

## 📚 Ek Kaynaklar

- [Gmail App Passwords](https://support.google.com/accounts/answer/185833)
- [Gmail SMTP Settings](https://support.google.com/mail/answer/7126229)
- [Postfix Setup Guide](./POSTFIX_SETUP.md)

## ✅ Test Tamamlandı!

Artık backend API'niz Gmail SMTP ile çalışıyor. Production'a geçmeden önce kendi SMTP sunucunuzu kurmanız önerilir.

