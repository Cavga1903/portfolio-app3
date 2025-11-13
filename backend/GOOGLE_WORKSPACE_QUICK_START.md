# 🚀 Google Workspace SMTP - Hızlı Başlangıç

5 dakikada Google Workspace SMTP'yi backend API'nize entegre edin.

## ⚡ Hızlı Adımlar

### 1. Google Workspace App Password Oluştur

1. [App Passwords](https://myaccount.google.com/apppasswords) sayfasına gidin
2. **Mail** → **Other (Custom name)** → `Portfolio Backend API`
3. **Generate** → Şifreyi kopyalayın (16 karakter, boşluksuz)

### 2. Backend .env Dosyası Oluştur

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

**Önemli**: 
- `SMTP_USER`: Google Workspace email adresiniz (kendi domain'inizle)
- `SMTP_PASS`: App Password (boşluksuz, 16 karakter)

### 3. Paketleri Yükle ve Başlat

```bash
npm install
npm start
```

### 4. Test Et

```bash
# Health check
curl http://localhost:3001/api/health

# Contact form test
curl -X POST http://localhost:3001/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "email": "test@example.com",
    "message": "Test mesajı",
    "language": "Turkish"
  }'
```

## ✅ Tamamlandı!

Email'ler artık `contact@cavga.dev` adresinden gönderilecek.

## 📚 Detaylı Rehber

Daha fazla bilgi için: `backend/GOOGLE_WORKSPACE_SMTP.md`

