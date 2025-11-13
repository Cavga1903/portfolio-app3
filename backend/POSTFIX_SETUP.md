# 📧 Postfix SMTP Sunucusu Kurulum Rehberi

Kendi sunucunuzda Postfix kurarak tamamen bağımsız email gönderimi.

## 🎯 Gereksinimler

- Ubuntu/Debian sunucu (root erişimi)
- Domain adınız (örn: `cavga.dev`)
- DNS erişimi (MX kayıtları eklemek için)

## 📦 Adım 1: Postfix Kurulumu

### Ubuntu/Debian

```bash
# Sistem güncellemesi
sudo apt-get update
sudo apt-get upgrade -y

# Postfix ve gerekli paketleri kur
sudo apt-get install -y postfix mailutils

# Kurulum sırasında sorular sorulacak:
# - General type: "Internet Site" seçin
# - System mail name: domain adınız (örn: cavga.dev)
```

### CentOS/RHEL

```bash
sudo yum install -y postfix mailx
sudo systemctl enable postfix
sudo systemctl start postfix
```

## ⚙️ Adım 2: Postfix Yapılandırması

### Ana Yapılandırma Dosyası

```bash
sudo nano /etc/postfix/main.cf
```

Aşağıdaki ayarları ekleyin/düzenleyin:

```conf
# Domain ayarları
myhostname = mail.cavga.dev
mydomain = cavga.dev
myorigin = $mydomain

# Network ayarları
inet_interfaces = all
inet_protocols = ipv4

# Mailbox ayarları
home_mailbox = Maildir/

# Relay ayarları (gerekirse)
relayhost =

# Güvenlik ayarları
smtpd_banner = $myhostname ESMTP $mail_name
smtpd_helo_required = yes
smtpd_helo_restrictions = permit_mynetworks, permit_sasl_authenticated, reject_invalid_helo_hostname, reject_non_fqdn_helo_hostname

# TLS/SSL ayarları
smtpd_tls_cert_file = /etc/ssl/certs/ssl-cert-snakeoil.pem
smtpd_tls_key_file = /etc/ssl/private/ssl-cert-snakeoil.key
smtpd_use_tls = yes
smtpd_tls_auth_only = yes
smtpd_tls_security_level = may

# SASL ayarları (kimlik doğrulama için)
smtpd_sasl_type = dovecot
smtpd_sasl_path = private/auth
smtpd_sasl_auth_enable = yes
smtpd_sasl_security_options = noanonymous
smtpd_sasl_local_domain = $myhostname

# Relay kısıtlamaları
smtpd_recipient_restrictions = permit_mynetworks, permit_sasl_authenticated, reject_unauth_destination
smtpd_relay_restrictions = permit_mynetworks, permit_sasl_authenticated, defer_unauth_destination

# Gönderim limitleri
message_size_limit = 10240000
mailbox_size_limit = 1073741824
```

### Master Yapılandırması

```bash
sudo nano /etc/postfix/master.cf
```

SMTP submission portunu (587) aktif edin:

```conf
submission inet n       -       y       -       -       smtpd
  -o syslog_name=postfix/submission
  -o smtpd_tls_security_level=encrypt
  -o smtpd_sasl_auth_enable=yes
  -o smtpd_tls_auth_only=yes
  -o smtpd_reject_unlisted_recipient=no
  -o smtpd_client_restrictions=$mua_client_restrictions
  -o smtpd_helo_restrictions=$mua_helo_restrictions
  -o smtpd_sender_restrictions=$mua_sender_restrictions
  -o smtpd_recipient_restrictions=
  -o smtpd_relay_restrictions=permit_sasl_authenticated,reject
  -o milter_macro_daemon_name=ORIGINATING
```

## 🔐 Adım 3: SSL Sertifikası (Let's Encrypt)

```bash
# Certbot kurulumu
sudo apt-get install -y certbot

# SSL sertifikası al
sudo certbot certonly --standalone -d mail.cavga.dev

# Postfix için sertifikaları kopyala
sudo cp /etc/letsencrypt/live/mail.cavga.dev/fullchain.pem /etc/postfix/ssl/fullchain.pem
sudo cp /etc/letsencrypt/live/mail.cavga.dev/privkey.pem /etc/postfix/ssl/privkey.pem

# İzinleri ayarla
sudo chmod 600 /etc/postfix/ssl/privkey.pem
sudo chmod 644 /etc/postfix/ssl/fullchain.pem
```

`main.cf` dosyasını güncelleyin:

```conf
smtpd_tls_cert_file = /etc/postfix/ssl/fullchain.pem
smtpd_tls_key_file = /etc/postfix/ssl/privkey.pem
```

## 🌐 Adım 4: DNS Ayarları

Domain DNS ayarlarınıza şunları ekleyin:

### A Kaydı
```
mail.cavga.dev    A    YOUR_SERVER_IP
```

### MX Kaydı
```
cavga.dev    MX    10    mail.cavga.dev
```

### SPF Kaydı (Spam koruması)
```
cavga.dev    TXT    "v=spf1 mx a:mail.cavga.dev ~all"
```

### DKIM Kaydı (İsteğe bağlı, önerilir)
```bash
# OpenDKIM kurulumu
sudo apt-get install -y opendkim opendkim-tools

# DKIM key oluştur
sudo opendkim-genkey -b 2048 -d cavga.dev -s mail

# DNS'e ekleyeceğiniz TXT kaydı:
# mail._domainkey.cavga.dev    TXT    "v=DKIM1; k=rsa; p=..."
```

### DMARC Kaydı (İsteğe bağlı)
```
_dmarc.cavga.dev    TXT    "v=DMARC1; p=none; rua=mailto:admin@cavga.dev"
```

## 🔄 Adım 5: Postfix'i Yeniden Başlat

```bash
# Yapılandırmayı test et
sudo postfix check

# Postfix'i yeniden başlat
sudo systemctl restart postfix

# Durumu kontrol et
sudo systemctl status postfix
```

## 🧪 Adım 6: Test

### Port Kontrolü

```bash
# SMTP portlarının açık olduğunu kontrol et
sudo netstat -tlnp | grep :25
sudo netstat -tlnp | grep :587
```

### Email Gönderme Testi

```bash
# Basit test
echo "Test mesajı" | mail -s "Test Email" your-email@gmail.com

# Detaylı test
mail -s "Test Subject" your-email@gmail.com << EOF
Test mesajı
Bu bir test email'idir.
EOF
```

### Backend API Testi

Backend API'nizde environment variables:

```env
SMTP_HOST=mail.cavga.dev
SMTP_PORT=587
SMTP_USER=contact@cavga.dev
SMTP_PASS=your-email-password
CONTACT_EMAIL=your-email@cavga.dev
```

## 🔧 Adım 7: Firewall Ayarları

```bash
# UFW kullanıyorsanız
sudo ufw allow 25/tcp
sudo ufw allow 587/tcp
sudo ufw allow 465/tcp
sudo ufw reload

# iptables kullanıyorsanız
sudo iptables -A INPUT -p tcp --dport 25 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 587 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 465 -j ACCEPT
```

## 📊 Adım 8: Log Kontrolü

```bash
# Postfix loglarını görüntüle
sudo tail -f /var/log/mail.log

# Hata logları
sudo grep "error" /var/log/mail.log
```

## 🛡️ Güvenlik İpuçları

1. **Fail2ban kurulumu** (brute force koruması):
```bash
sudo apt-get install -y fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

2. **Güçlü şifreler kullanın**

3. **Düzenli güncellemeler**:
```bash
sudo apt-get update && sudo apt-get upgrade -y
```

4. **SPF, DKIM, DMARC kayıtlarını ekleyin** (spam koruması)

## ❌ Sorun Giderme

### Email Gönderilemiyor

1. **Log kontrolü**:
```bash
sudo tail -f /var/log/mail.log
```

2. **Port kontrolü**:
```bash
sudo netstat -tlnp | grep postfix
```

3. **DNS kontrolü**:
```bash
dig MX cavga.dev
dig A mail.cavga.dev
```

4. **Postfix yapılandırması kontrolü**:
```bash
sudo postfix check
sudo postconf -n
```

### Spam Klasörüne Düşüyor

- SPF kaydını ekleyin
- DKIM imzalama yapılandırın
- DMARC kaydı ekleyin
- IP reputation kontrolü yapın

### Port 587 Çalışmıyor

- `master.cf` dosyasında submission satırının aktif olduğundan emin olun
- Firewall ayarlarını kontrol edin
- Postfix'i yeniden başlatın

## 📚 Ek Kaynaklar

- [Postfix Documentation](http://www.postfix.org/documentation.html)
- [Postfix Configuration](http://www.postfix.org/BASIC_CONFIGURATION_README.html)
- [Let's Encrypt](https://letsencrypt.org/)

## ✅ Kurulum Tamamlandı!

Artık kendi SMTP sunucunuz hazır. Backend API'nizde environment variables'ı ayarlayıp test edebilirsiniz.

