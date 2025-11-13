# 🌐 Postfix Multi-Domain Yapılandırması (Hetzner)

Bir Hetzner sunucusunda birden fazla domain/proje için Postfix kullanımı.

## 🎯 Senaryo

Bir sunucuda birden fazla domain için email gönderme:
- `cavga.dev` → Portfolio projesi
- `project2.com` → İkinci proje
- `project3.com` → Üçüncü proje

## 📋 Gereksinimler

- Hetzner Cloud sunucu
- Birden fazla domain
- Her domain için DNS erişimi

## ⚙️ Adım 1: Postfix Virtual Domains Yapılandırması

### 1.1. main.cf Yapılandırması

```bash
sudo nano /etc/postfix/main.cf
```

Aşağıdaki yapılandırmayı kullanın:

```conf
# Ana domain (ilk domain)
myhostname = mail.cavga.dev
mydomain = cavga.dev
myorigin = $mydomain

# Network ayarları
inet_interfaces = all
inet_protocols = ipv4

# Virtual domains - TÜM domain'leri buraya ekleyin
virtual_mailbox_domains = hash:/etc/postfix/virtual_domains
virtual_mailbox_maps = hash:/etc/postfix/virtual_mailbox
virtual_alias_maps = hash:/etc/postfix/virtual_alias

# Virtual mailbox ayarları
virtual_mailbox_base = /var/mail/vhosts
virtual_minimum_uid = 100
virtual_uid_maps = static:5000
virtual_gid_maps = static:5000

# Relay ayarları
relayhost =

# Güvenlik ayarları
smtpd_banner = $myhostname ESMTP $mail_name
smtpd_helo_required = yes
smtpd_helo_restrictions = permit_mynetworks, permit_sasl_authenticated, reject_invalid_helo_hostname, reject_non_fqdn_helo_hostname

# TLS/SSL ayarları
smtpd_tls_cert_file = /etc/postfix/ssl/fullchain.pem
smtpd_tls_key_file = /etc/postfix/ssl/privkey.pem
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

### 1.2. Virtual Domains Dosyası Oluştur

```bash
sudo nano /etc/postfix/virtual_domains
```

Tüm domain'leri ekleyin:

```
cavga.dev           OK
project2.com        OK
project3.com        OK
```

**Not:** Her satırda bir domain, sonunda `OK` olmalı.

### 1.3. Virtual Mailbox Dosyası Oluştur

```bash
sudo nano /etc/postfix/virtual_mailbox
```

Her domain için email adreslerini tanımlayın:

```
contact@cavga.dev           cavga.dev/contact/
info@cavga.dev              cavga.dev/info/
contact@project2.com        project2.com/contact/
info@project2.com           project2.com/info/
contact@project3.com        project3.com/contact/
```

**Format:** `email@domain.com    domain.com/email/`

### 1.4. Virtual Alias Dosyası (Opsiyonel)

Eğer email'leri başka adreslere yönlendirmek istiyorsanız:

```bash
sudo nano /etc/postfix/virtual_alias
```

```
contact@cavga.dev           your-personal-email@gmail.com
info@cavga.dev              your-personal-email@gmail.com
contact@project2.com         project2-email@gmail.com
```

### 1.5. Dosyaları Hash'le

```bash
sudo postmap /etc/postfix/virtual_domains
sudo postmap /etc/postfix/virtual_mailbox
sudo postmap /etc/postfix/virtual_alias
```

### 1.6. Mailbox Dizinlerini Oluştur

```bash
# Virtual mailbox için grup ve kullanıcı oluştur
sudo groupadd -g 5000 vmail
sudo useradd -g 5000 -u 5000 -d /var/mail/vhosts -s /bin/false vmail

# Dizinleri oluştur
sudo mkdir -p /var/mail/vhosts
sudo chown -R vmail:vmail /var/mail/vhosts
sudo chmod -R 700 /var/mail/vhosts

# Her domain için dizin oluştur
sudo mkdir -p /var/mail/vhosts/cavga.dev/contact
sudo mkdir -p /var/mail/vhosts/cavga.dev/info
sudo mkdir -p /var/mail/vhosts/project2.com/contact
sudo mkdir -p /var/mail/vhosts/project3.com/contact

# İzinleri ayarla
sudo chown -R vmail:vmail /var/mail/vhosts
```

## 🔐 Adım 2: SSL Sertifikaları (Multi-Domain)

### 2.1. SAN Sertifikası (Tüm Domain'ler İçin)

```bash
# Certbot ile multi-domain sertifikası al
certbot certonly --standalone \
  -d mail.cavga.dev \
  -d mail.project2.com \
  -d mail.project3.com
```

### 2.2. Sertifikaları Kopyala

```bash
# İlk domain'in sertifikasını kullan (veya SAN sertifikası)
sudo mkdir -p /etc/postfix/ssl
sudo cp /etc/letsencrypt/live/mail.cavga.dev/fullchain.pem /etc/postfix/ssl/
sudo cp /etc/letsencrypt/live/mail.cavga.dev/privkey.pem /etc/postfix/ssl/
sudo chmod 600 /etc/postfix/ssl/privkey.pem
sudo chmod 644 /etc/postfix/ssl/fullchain.pem
```

## 🌐 Adım 3: DNS Ayarları (Her Domain İçin)

### 3.1. Domain 1: cavga.dev

**A Kaydı:**
```
mail.cavga.dev    A    YOUR_HETZNER_SERVER_IP
```

**MX Kaydı:**
```
cavga.dev    MX    10    mail.cavga.dev
```

**SPF Kaydı:**
```
cavga.dev    TXT    "v=spf1 mx a:mail.cavga.dev ~all"
```

### 3.2. Domain 2: project2.com

**A Kaydı:**
```
mail.project2.com    A    YOUR_HETZNER_SERVER_IP
```

**MX Kaydı:**
```
project2.com    MX    10    mail.project2.com
```

**SPF Kaydı:**
```
project2.com    TXT    "v=spf1 mx a:mail.project2.com ~all"
```

### 3.3. Domain 3: project3.com

Aynı şekilde her domain için DNS kayıtları ekleyin.

## 🔄 Adım 4: Postfix'i Yeniden Başlat

```bash
sudo postfix check
sudo systemctl restart postfix
sudo systemctl status postfix
```

## 🧪 Adım 5: Test

### 5.1. Her Domain İçin Test

```bash
# Domain 1
echo "Test mesajı" | mail -s "Test - cavga.dev" contact@cavga.dev

# Domain 2
echo "Test mesajı" | mail -s "Test - project2.com" contact@project2.com

# Domain 3
echo "Test mesajı" | mail -s "Test - project3.com" contact@project3.com
```

### 5.2. Log Kontrolü

```bash
tail -f /var/log/mail.log
```

## 🔧 Adım 6: Backend API Yapılandırması

### 6.1. Proje 1: Portfolio (cavga.dev)

Backend API `.env`:

```env
SMTP_HOST=mail.cavga.dev
SMTP_PORT=587
SMTP_USER=contact@cavga.dev
SMTP_PASS=your-password
CONTACT_EMAIL=contact@cavga.dev
```

### 6.2. Proje 2: project2.com

Backend API `.env`:

```env
SMTP_HOST=mail.project2.com
SMTP_PORT=587
SMTP_USER=contact@project2.com
SMTP_PASS=your-password
CONTACT_EMAIL=contact@project2.com
```

### 6.3. Proje 3: project3.com

Aynı şekilde her proje için ayrı `.env` dosyası.

## 📊 Adım 7: Yönetim ve Monitoring

### 7.1. Yeni Domain Ekleme

```bash
# 1. virtual_domains dosyasına ekle
sudo nano /etc/postfix/virtual_domains
# Yeni domain ekle: newdomain.com    OK

# 2. virtual_mailbox dosyasına email ekle
sudo nano /etc/postfix/virtual_mailbox
# Yeni email ekle: contact@newdomain.com    newdomain.com/contact/

# 3. Hash'le
sudo postmap /etc/postfix/virtual_domains
sudo postmap /etc/postfix/virtual_mailbox

# 4. Dizin oluştur
sudo mkdir -p /var/mail/vhosts/newdomain.com/contact
sudo chown -R vmail:vmail /var/mail/vhosts/newdomain.com

# 5. Postfix'i yeniden başlat
sudo systemctl restart postfix
```

### 7.2. Email Adresi Ekleme

```bash
# 1. virtual_mailbox dosyasına ekle
sudo nano /etc/postfix/virtual_mailbox
# Yeni email ekle: info@cavga.dev    cavga.dev/info/

# 2. Hash'le
sudo postmap /etc/postfix/virtual_mailbox

# 3. Dizin oluştur
sudo mkdir -p /var/mail/vhosts/cavga.dev/info
sudo chown -R vmail:vmail /var/mail/vhosts/cavga.dev/info

# 4. Postfix'i yeniden başlat
sudo systemctl restart postfix
```

### 7.3. Email Yönlendirme (Alias)

```bash
# 1. virtual_alias dosyasına ekle
sudo nano /etc/postfix/virtual_alias
# Yönlendirme ekle: info@cavga.dev    your-email@gmail.com

# 2. Hash'le
sudo postmap /etc/postfix/virtual_alias

# 3. Postfix'i yeniden başlat
sudo systemctl restart postfix
```

## 🛡️ Adım 8: Güvenlik

### 8.1. Her Domain İçin Ayrı Şifreler

SASL authentication için:

```bash
sudo nano /etc/postfix/sasl_passwd
```

```
[mail.cavga.dev]:587    contact@cavga.dev:password1
[mail.project2.com]:587    contact@project2.com:password2
```

```bash
sudo postmap /etc/postfix/sasl_passwd
sudo chmod 600 /etc/postfix/sasl_passwd
```

### 8.2. Rate Limiting (Domain Bazlı)

`main.cf` dosyasına ekleyin:

```conf
# Domain bazlı rate limiting
smtpd_client_message_rate_limit = 10
smtpd_client_connection_rate_limit = 5
```

## 📝 Örnek: 3 Proje Yapılandırması

### Domain'ler:
- `cavga.dev` → Portfolio
- `project2.com` → İkinci proje
- `project3.com` → Üçüncü proje

### virtual_domains:
```
cavga.dev           OK
project2.com        OK
project3.com        OK
```

### virtual_mailbox:
```
contact@cavga.dev           cavga.dev/contact/
info@cavga.dev              cavga.dev/info/
contact@project2.com        project2.com/contact/
contact@project3.com        project3.com/contact/
```

### virtual_alias (Yönlendirme):
```
contact@cavga.dev           your-email@gmail.com
info@cavga.dev              your-email@gmail.com
contact@project2.com        project2-email@gmail.com
contact@project3.com        project3-email@gmail.com
```

## ❌ Sorun Giderme

### Email Gönderilemiyor

1. **Virtual domain kontrolü:**
```bash
postmap -q cavga.dev /etc/postfix/virtual_domains
# Çıktı: OK olmalı
```

2. **Virtual mailbox kontrolü:**
```bash
postmap -q contact@cavga.dev /etc/postfix/virtual_mailbox
# Çıktı: cavga.dev/contact/ olmalı
```

3. **Dizin izinleri:**
```bash
ls -la /var/mail/vhosts/
# vmail:vmail olmalı
```

### Yeni Domain Çalışmıyor

1. DNS kayıtlarını kontrol edin
2. `virtual_domains` dosyasına eklediğinizden emin olun
3. `postmap` komutunu çalıştırdığınızdan emin olun
4. Postfix'i yeniden başlatın

## ✅ Multi-Domain Yapılandırması Tamamlandı!

Artık bir sunucuda birden fazla domain için email gönderebilirsiniz.

## 📚 Ek Kaynaklar

- [Postfix Virtual Domain](http://www.postfix.org/VIRTUAL_README.html)
- [Postfix Multi-Domain](http://www.postfix.org/MULTI_INSTANCE_README.html)

