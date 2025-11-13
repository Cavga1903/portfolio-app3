# 🔧 Backend Hata Ayıklama Rehberi

500 Internal Server Error çözümü.

## ❌ Hata: 500 Internal Server Error

Backend'de bir sorun var. Olası nedenler:

### 1. Environment Variables Eksik

**Kontrol:**
```bash
cd backend
cat .env
```

**Gerekli değişkenler:**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=contact@cavga.dev
SMTP_PASS=your-app-password
CONTACT_EMAIL=contact@cavga.dev
```

**Çözüm:**
```bash
# .env dosyası oluştur
cd backend
nano .env
```

Yukarıdaki değişkenleri ekleyin.

### 2. SMTP Bağlantı Hatası

**Kontrol:**
Backend loglarını kontrol edin:
```bash
cd backend
npm start
# veya
npm run dev
```

Terminal'de hata mesajını görün.

**Olası hatalar:**
- `Invalid login` → App Password yanlış
- `Connection timeout` → Port/firewall sorunu
- `Authentication failed` → SMTP_USER veya SMTP_PASS yanlış

**Çözüm:**
1. Google Workspace App Password'ü kontrol edin
2. `.env` dosyasındaki değerleri kontrol edin
3. Boşlukları kaldırın (App Password'de)

### 3. React Email Render Hatası

**Kontrol:**
Backend loglarında şu hatayı görüyor musunuz?
```
Error: Cannot find module '@react-email/render'
```

**Çözüm:**
```bash
cd backend
npm install
```

### 4. Module Import Hatası

**Kontrol:**
Backend loglarında:
```
Error: Cannot find module './templates/ContactEmail'
```

**Çözüm:**
1. `backend/api/templates/ContactEmail.js` dosyasının var olduğundan emin olun
2. Import path'i kontrol edin: `require('./templates/ContactEmail')`

## 🔍 Adım Adım Hata Ayıklama

### Adım 1: Backend Loglarını Kontrol Et

```bash
cd backend
npm start
```

Terminal'de tam hata mesajını görün.

### Adım 2: Environment Variables Kontrolü

```bash
cd backend
# .env dosyası var mı?
ls -la .env

# İçeriğini kontrol et (şifreleri gizle)
cat .env | grep -v PASS
```

### Adım 3: SMTP Bağlantı Testi

```bash
# Node.js ile test
node -e "
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'YOUR_EMAIL@cavga.dev',
    pass: 'YOUR_APP_PASSWORD'
  }
});
transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP Error:', error);
  } else {
    console.log('SMTP OK!');
  }
});
"
```

### Adım 4: React Email Testi

```bash
cd backend
node -e "
const { render } = require('@react-email/render');
const ContactEmail = require('./api/templates/ContactEmail');
const html = render(ContactEmail({
  name: 'Test',
  email: 'test@example.com',
  message: 'Test',
  language: 'Turkish',
  timestamp: new Date().toLocaleString()
}));
console.log('React Email OK!');
"
```

## 🛠️ Hızlı Çözümler

### Çözüm 1: .env Dosyası Eksik

```bash
cd backend
cat > .env <<EOF
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=contact@cavga.dev
SMTP_PASS=your-app-password-here
CONTACT_EMAIL=contact@cavga.dev
EOF
```

### Çözüm 2: Paketleri Yeniden Yükle

```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

### Çözüm 3: Backend'i Yeniden Başlat

```bash
cd backend
# Ctrl+C ile durdur
npm start
```

## 📋 Kontrol Listesi

- [ ] `.env` dosyası var mı?
- [ ] `SMTP_USER` doğru mu? (Google Workspace email)
- [ ] `SMTP_PASS` doğru mu? (App Password, boşluksuz)
- [ ] `npm install` çalıştırıldı mı?
- [ ] Backend server çalışıyor mu? (`npm start`)
- [ ] Port 3001 açık mı?
- [ ] Backend loglarında hata var mı?

## 🔍 Backend Loglarını İnceleme

Backend'i çalıştırın ve terminal'deki hata mesajını paylaşın:

```bash
cd backend
npm start
```

Sonra frontend'den form gönderin ve backend terminal'deki hata mesajını görün.

## 💡 Yaygın Hatalar ve Çözümleri

### "Invalid login: 535-5.7.8"

**Neden:** App Password yanlış veya 2-Step Verification kapalı

**Çözüm:**
1. Yeni App Password oluşturun
2. `.env` dosyasını güncelleyin
3. Backend'i yeniden başlatın

### "Cannot find module '@react-email/render'"

**Neden:** Paketler yüklenmemiş

**Çözüm:**
```bash
cd backend
npm install
```

### "ECONNREFUSED"

**Neden:** Backend server çalışmıyor

**Çözüm:**
```bash
cd backend
npm start
```

## 📞 Yardım

Hata mesajını backend terminal'den kopyalayıp paylaşın, daha spesifik yardım edebilirim.

