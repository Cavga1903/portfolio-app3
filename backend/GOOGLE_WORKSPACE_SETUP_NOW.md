# ⚡ Google Workspace SMTP - Hızlı Kurulum

Aktif Google Workspace hesabınızla backend API'yi yapılandırın.

## 🚀 Hızlı Adımlar (5 Dakika)

### 1. App Password Oluştur

1. [App Passwords](https://myaccount.google.com/apppasswords) sayfasına gidin
2. **Select app** → **Mail** seçin
3. **Select device** → **Other (Custom name)** seçin
4. İsim: `Portfolio Backend API`
5. **Generate** → 16 karakterlik şifreyi kopyalayın

⚠️ **Önemli**: Şifreyi bir daha göremezsiniz! Güvenli bir yere kaydedin.

**Örnek:** `abcd efgh ijkl mnop` → Kopyalarken boşluksuz kullanın: `abcdefghijklmnop`

### 2. Backend .env Dosyası Oluştur

```bash
cd backend
nano .env
```

Aşağıdaki içeriği ekleyin (kendi değerlerinizle değiştirin):

```env
# Google Workspace SMTP Ayarları
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=contact@cavga.dev
SMTP_PASS=abcdefghijklmnop
CONTACT_EMAIL=contact@cavga.dev

# Google reCAPTCHA v3 (Opsiyonel)
RECAPTCHA_SECRET_KEY=your-recaptcha-secret-key

# CORS
ALLOWED_ORIGIN=*
```

**Değiştirilecekler:**
- `SMTP_USER`: Google Workspace email adresiniz (örn: `contact@cavga.dev`)
- `SMTP_PASS`: App Password (16 karakter, boşluksuz)
- `CONTACT_EMAIL`: Email alıcı adresi

### 3. Paketleri Yükle

```bash
npm install
```

### 4. Backend'i Başlat

```bash
# Development
npm run dev

# Production
npm start
```

Server `http://localhost:3001` adresinde çalışacak.

### 5. Test Et

```bash
# Health check
curl http://localhost:3001/api/health
```

Beklenen yanıt:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 6. Contact Form Testi

Frontend'den form gönderin veya curl ile:

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

## ✅ Başarılı!

Email'ler artık Google Workspace hesabınızdan (`contact@cavga.dev`) gönderilecek.

## 🔍 Kontrol Listesi

- [ ] App Password oluşturuldu
- [ ] `.env` dosyası oluşturuldu
- [ ] `SMTP_USER` doğru (Google Workspace email)
- [ ] `SMTP_PASS` doğru (App Password, boşluksuz)
- [ ] Backend başlatıldı
- [ ] Health check başarılı
- [ ] Test email gönderildi

## ❌ Sorun Giderme

### "Invalid login" Hatası

1. App Password'ün doğru olduğundan emin olun
2. Boşlukları kaldırın
3. 2-Step Verification'ın açık olduğundan emin olun
4. Yeni App Password oluşturun

### Email Gönderilmedi

1. Backend loglarını kontrol edin
2. `.env` dosyasındaki değerleri kontrol edin
3. Google Workspace email adresinin aktif olduğundan emin olun

## 📚 Daha Fazla Bilgi

Detaylı rehber: `backend/GOOGLE_WORKSPACE_SMTP.md`

