# 🧪 Postfix Local Test Rehberi (macOS)

macOS'ta Postfix ile local test yapma rehberi.

## 🎯 macOS'ta Postfix Durumu

macOS'ta Postfix genellikle zaten kurulu gelir ama **gönderim için yapılandırılmamıştır**. Local test için basit bir yapılandırma yapacağız.

## ⚠️ Önemli Not

macOS'ta Postfix'i production gibi kullanmak önerilmez. Bu sadece **test amaçlıdır**. Gerçek email göndermek için:
- Gmail SMTP kullanın (test için)
- Veya Hetzner sunucunuzda Postfix kurun (production için)

## 📦 Adım 1: Postfix Durumunu Kontrol Et

```bash
# Postfix'in kurulu olup olmadığını kontrol et
which postfix

# Postfix durumunu kontrol et
sudo launchctl list | grep postfix
```

## ⚙️ Adım 2: Postfix Yapılandırması (Test İçin)

### 2.1. main.cf Dosyasını Düzenle

```bash
sudo nano /etc/postfix/main.cf
```

Aşağıdaki ayarları ekleyin/düzenleyin:

```conf
# Test için minimal yapılandırma
myhostname = localhost
mydomain = localhost
myorigin = $mydomain

# Sadece localhost'tan gönderim
inet_interfaces = loopback-only
inet_protocols = ipv4

# Relay ayarları (Gmail SMTP kullanacağız)
relayhost = [smtp.gmail.com]:587

# TLS ayarları
smtp_use_tls = yes
smtp_sasl_auth_enable = yes
smtp_sasl_password_maps = hash:/etc/postfix/sasl_passwd
smtp_sasl_security_options = noanonymous
smtp_tls_CAfile = /etc/ssl/cert.pem
```

### 2.2. Gmail SMTP Credentials Oluştur

```bash
# SASL password dosyası oluştur
sudo nano /etc/postfix/sasl_passwd
```

İçine şunu ekleyin (Gmail App Password kullanın):

```
[smtp.gmail.com]:587    your-email@gmail.com:your-app-password
```

**Örnek:**
```
[smtp.gmail.com]:587    tolgacavga@gmail.com:abcdefghijklmnop
```

### 2.3. Password Dosyasını Hash'le

```bash
sudo postmap /etc/postfix/sasl_passwd
sudo chmod 600 /etc/postfix/sasl_passwd
```

### 2.4. Postfix'i Yeniden Başlat

```bash
sudo launchctl stop com.apple.postfix.master
sudo launchctl start com.apple.postfix.master
```

## 🧪 Adım 3: Test Email Gönderme

### 3.1. Basit Test

```bash
# Test email gönder
echo "Test mesajı" | mail -s "Test Email" your-email@gmail.com
```

### 3.2. Detaylı Test

```bash
mail -s "Test Subject" your-email@gmail.com << EOF
Bu bir test email'idir.
Postfix local test başarılı!
EOF
```

### 3.3. Log Kontrolü

```bash
# Postfix loglarını görüntüle
tail -f /var/log/mail.log

# macOS'ta loglar farklı yerde olabilir
sudo log show --predicate 'process == "postfix"' --last 5m
```

## 🔧 Adım 4: Backend API ile Test

### 4.1. Environment Variables

Backend'de `.env` dosyası oluşturun:

```env
# Local test için Gmail SMTP kullanın (daha kolay)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
CONTACT_EMAIL=your-email@gmail.com
```

### 4.2. Backend'i Başlat

```bash
cd backend
npm install
npm start
```

### 4.3. Test Et

Frontend'den contact formunu gönderin veya curl ile:

```bash
curl -X POST http://localhost:3001/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "Local test mesajı",
    "language": "Turkish"
  }'
```

## ⚠️ macOS Postfix Sınırlamaları

1. **Port 25 bloklu**: macOS'ta port 25 genellikle blokludur
2. **Relayhost gerekli**: Direkt gönderim yapamaz, relayhost kullanmalısınız
3. **Production için uygun değil**: Sadece test amaçlıdır

## ✅ Local Test Tamamlandı!

Local test başarılı olduktan sonra, **Hetzner sunucunuzda** gerçek Postfix kurulumuna geçebilirsiniz.

## 🚀 Sonraki Adım: Hetzner Kurulumu

Local test başarılı olduktan sonra `POSTFIX_HETZNER_SETUP.md` dosyasındaki adımları takip edin.

