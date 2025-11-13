# 🚀 Postfix Kurulumu - Hetzner Cloud

Hetzner Cloud sunucusunda Postfix SMTP sunucusu kurulum rehberi.

## 🎯 Gereksinimler

- Hetzner Cloud sunucu (Ubuntu 22.04 veya 20.04 önerilir)
- Root/Sudo erişimi
- Domain adınız (örn: `cavga.dev`)
- DNS erişimi (Hetzner DNS veya başka bir DNS sağlayıcı)

## 📦 Adım 1: Hetzner Sunucuya Bağlanma

### 1.1. SSH ile Bağlan

```bash
ssh root@your-hetzner-ip
# veya
ssh root@your-hetzner-hostname
```

### 1.2. İlk Kurulum (Opsiyonel)

```bash
# Sistem güncellemesi
apt-get update && apt-get upgrade -y

# Güvenlik için fail2ban kur (önerilir)
apt-get install -y fail2ban ufw

# Temel firewall ayarları
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw allow 25/tcp    # SMTP
ufw allow 587/tcp   # SMTP Submission
ufw allow 465/tcp   # SMTPS
ufw enable
```

## 📧 Adım 2: Postfix Kurulumu

### 2.1. Otomatik Kurulum (Önerilen)

Script'i sunucuya kopyalayın ve çalıştırın:

```bash
# Script'i sunucuya kopyala (local'den)
scp backend/POSTFIX_QUICK_START.sh root@your-hetzner-ip:/tmp/

# Sunucuya bağlan
ssh root@your-hetzner-ip

# Script'i çalıştır
bash /tmp/POSTFIX_QUICK_START.sh
```

Script domain adınızı soracak, örn: `cavga.dev`

### 2.2. Manuel Kurulum

```bash
# Sistem güncellemesi
apt-get update && apt-get upgrade -y

# Postfix ve gerekli paketleri kur
export DEBIAN_FRONTEND=noninteractive
debconf-set-selections <<EOF
postfix postfix/mailname string cavga.dev
postfix postfix/main_mailer_type string 'Internet Site'
EOF

apt-get install -y postfix mailutils opendkim opendkim-tools
```

## ⚙️ Adım 3: Postfix Yapılandırması

### 3.1. main.cf Yapılandırması

```bash
sudo nano /etc/postfix/main.cf
```

Aşağıdaki yapılandırmayı kullanın (domain'inizi değiştirin):

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

# Relay ayarları
relayhost =

# Güvenlik ayarları
smtpd_banner = $myhostname ESMTP $mail_name
smtpd_helo_required = yes
smtpd_helo_restrictions = permit_mynetworks, permit_sasl_authenticated, reject_invalid_helo_hostname, reject_non_fqdn_helo_hostname

# TLS/SSL ayarları (Let's Encrypt ile güncellenecek)
smtpd_tls_cert_file = /etc/ssl/certs/ssl-cert-snakeoil.pem
smtpd_tls_key_file = /etc/ssl/private/ssl-cert-snakeoil.key
smtpd_use_tls = yes
smtpd_tls_auth_only = yes
smtpd_tls_security_level = may

# Relay kısıtlamaları
smtpd_recipient_restrictions = permit_mynetworks, permit_sasl_authenticated, reject_unauth_destination
smtpd_relay_restrictions = permit_mynetworks, permit_sasl_authenticated, defer_unauth_destination

# Gönderim limitleri
message_size_limit = 10240000
mailbox_size_limit = 1073741824
```

### 3.2. master.cf - Submission Port (587)

```bash
sudo nano /etc/postfix/master.cf
```

Dosyanın sonuna ekleyin:

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

### 3.3. Yapılandırmayı Kontrol Et

```bash
sudo postfix check
```

### 3.4. Postfix'i Başlat

```bash
sudo systemctl enable postfix
sudo systemctl restart postfix
sudo systemctl status postfix
```

## 🔐 Adım 4: SSL Sertifikası (Let's Encrypt)

### 4.1. Certbot Kurulumu

```bash
apt-get install -y certbot
```

### 4.2. SSL Sertifikası Al

```bash
# Önce DNS kayıtlarınızın hazır olduğundan emin olun
# mail.cavga.dev A kaydı sunucu IP'nize işaret etmeli

certbot certonly --standalone -d mail.cavga.dev
```

### 4.3. Postfix için Sertifikaları Kopyala

```bash
mkdir -p /etc/postfix/ssl
cp /etc/letsencrypt/live/mail.cavga.dev/fullchain.pem /etc/postfix/ssl/
cp /etc/letsencrypt/live/mail.cavga.dev/privkey.pem /etc/postfix/ssl/
chmod 600 /etc/postfix/ssl/privkey.pem
chmod 644 /etc/postfix/ssl/fullchain.pem
```

### 4.4. main.cf'yi Güncelle

```bash
sudo nano /etc/postfix/main.cf
```

SSL satırlarını güncelleyin:

```conf
smtpd_tls_cert_file = /etc/postfix/ssl/fullchain.pem
smtpd_tls_key_file = /etc/postfix/ssl/privkey.pem
```

### 4.5. Otomatik Yenileme

```bash
# Certbot otomatik yenileme için systemd timer ekle
cat > /etc/systemd/system/certbot-postfix.service <<EOF
[Unit]
Description=Certbot renewal for Postfix
After=certbot.service

[Service]
Type=oneshot
ExecStart=/bin/bash -c 'cp /etc/letsencrypt/live/mail.cavga.dev/fullchain.pem /etc/postfix/ssl/ && cp /etc/letsencrypt/live/mail.cavga.dev/privkey.pem /etc/postfix/ssl/ && systemctl reload postfix'
EOF

systemctl daemon-reload
```

## 🌐 Adım 5: DNS Ayarları

### 5.1. Hetzner DNS Console

1. [Hetzner DNS Console](https://dns.hetzner.com/) giriş yapın
2. Domain'inizi seçin (veya yeni ekleyin)

### 5.2. A Kaydı

```
Type: A
Name: mail
Value: YOUR_HETZNER_SERVER_IP
TTL: 3600
```

### 5.3. MX Kaydı

```
Type: MX
Name: @ (veya boş)
Value: mail.cavga.dev
Priority: 10
TTL: 3600
```

### 5.4. SPF Kaydı

```
Type: TXT
Name: @ (veya boş)
Value: v=spf1 mx a:mail.cavga.dev ~all
TTL: 3600
```

### 5.5. DKIM Kaydı (İsteğe bağlı, önerilir)

```bash
# OpenDKIM key oluştur
opendkim-genkey -b 2048 -d cavga.dev -s mail
cat /etc/dkim/mail.txt
```

DNS'e ekleyin:

```
Type: TXT
Name: mail._domainkey
Value: (mail.txt dosyasındaki değer)
TTL: 3600
```

### 5.6. DMARC Kaydı (İsteğe bağlı)

```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:admin@cavga.dev
TTL: 3600
```

## 🔄 Adım 6: Postfix'i Yeniden Başlat

```bash
sudo systemctl restart postfix
sudo systemctl status postfix
```

## 🧪 Adım 7: Test

### 7.1. Port Kontrolü

```bash
netstat -tlnp | grep :25
netstat -tlnp | grep :587
```

### 7.2. Email Gönderme Testi

```bash
# Basit test
echo "Test mesajı" | mail -s "Test Email" your-email@gmail.com

# Log kontrolü
tail -f /var/log/mail.log
```

### 7.3. DNS Kontrolü

```bash
# MX kaydı kontrolü
dig MX cavga.dev

# A kaydı kontrolü
dig A mail.cavga.dev

# SPF kaydı kontrolü
dig TXT cavga.dev
```

## 🔧 Adım 8: Backend API Yapılandırması

Backend API'nizde `.env` dosyası:

```env
SMTP_HOST=mail.cavga.dev
SMTP_PORT=587
SMTP_USER=contact@cavga.dev
SMTP_PASS=your-email-password
CONTACT_EMAIL=your-email@cavga.dev
```

## 🛡️ Adım 9: Güvenlik (Önerilir)

### 9.1. Fail2ban Kurulumu

```bash
apt-get install -y fail2ban

# Postfix için jail oluştur
cat > /etc/fail2ban/jail.d/postfix.conf <<EOF
[postfix]
enabled = true
port = smtp,465,submission
filter = postfix
logpath = /var/log/mail.log
maxretry = 3
bantime = 3600
EOF

systemctl restart fail2ban
```

### 9.2. Firewall Kontrolü

```bash
ufw status
# Port 25, 587, 465 açık olmalı
```

## 📊 Adım 10: Monitoring

### 10.1. Log İzleme

```bash
# Canlı log izleme
tail -f /var/log/mail.log

# Hata logları
grep "error" /var/log/mail.log
```

### 10.2. Postfix Durumu

```bash
# Postfix durumu
systemctl status postfix

# Postfix queue kontrolü
mailq
```

## ❌ Sorun Giderme

### Email Gönderilemiyor

1. **Log kontrolü**: `tail -f /var/log/mail.log`
2. **Port kontrolü**: `netstat -tlnp | grep postfix`
3. **DNS kontrolü**: `dig MX cavga.dev`
4. **Postfix yapılandırması**: `postfix check`

### Spam Klasörüne Düşüyor

- SPF kaydını ekleyin
- DKIM imzalama yapılandırın
- DMARC kaydı ekleyin
- IP reputation kontrolü yapın

### Port 587 Çalışmıyor

- `master.cf` dosyasında submission satırının aktif olduğundan emin olun
- Firewall ayarlarını kontrol edin: `ufw status`
- Postfix'i yeniden başlatın: `systemctl restart postfix`

## ✅ Kurulum Tamamlandı!

Artık Hetzner sunucunuzda Postfix SMTP sunucunuz hazır. Backend API'nizden email gönderebilirsiniz.

## 📚 Ek Kaynaklar

- [Hetzner DNS Documentation](https://docs.hetzner.com/dns-console/)
- [Postfix Documentation](http://www.postfix.org/documentation.html)
- [Let's Encrypt](https://letsencrypt.org/)

