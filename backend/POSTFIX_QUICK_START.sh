#!/bin/bash

# Postfix Quick Start Script
# Bu script Postfix kurulumunu otomatikleştirir
# Kullanım: sudo bash POSTFIX_QUICK_START.sh

set -e

echo "📧 Postfix SMTP Sunucusu Kurulumu Başlıyor..."
echo ""

# Renk kodları
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Domain bilgisi al
read -p "Domain adınızı girin (örn: cavga.dev): " DOMAIN
if [ -z "$DOMAIN" ]; then
    echo -e "${RED}Domain adı boş olamaz!${NC}"
    exit 1
fi

# Mail hostname
MAIL_HOST="mail.${DOMAIN}"

echo ""
echo -e "${GREEN}Domain: ${DOMAIN}${NC}"
echo -e "${GREEN}Mail Hostname: ${MAIL_HOST}${NC}"
echo ""

# Sistem güncellemesi
echo "📦 Sistem güncelleniyor..."
apt-get update -qq
apt-get upgrade -y -qq

# Postfix ve gerekli paketleri kur
echo "📦 Postfix kuruluyor..."
export DEBIAN_FRONTEND=noninteractive
debconf-set-selections <<EOF
postfix postfix/mailname string ${DOMAIN}
postfix postfix/main_mailer_type string 'Internet Site'
EOF

apt-get install -y postfix mailutils opendkim opendkim-tools

# Postfix yapılandırması
echo "⚙️ Postfix yapılandırılıyor..."

# main.cf yedekle
cp /etc/postfix/main.cf /etc/postfix/main.cf.backup

# main.cf yapılandırması
cat > /etc/postfix/main.cf <<EOF
# Domain ayarları
myhostname = ${MAIL_HOST}
mydomain = ${DOMAIN}
myorigin = \$mydomain

# Network ayarları
inet_interfaces = all
inet_protocols = ipv4

# Mailbox ayarları
home_mailbox = Maildir/

# Relay ayarları
relayhost =

# Güvenlik ayarları
smtpd_banner = \$myhostname ESMTP \$mail_name
smtpd_helo_required = yes
smtpd_helo_restrictions = permit_mynetworks, permit_sasl_authenticated, reject_invalid_helo_hostname, reject_non_fqdn_helo_hostname

# TLS/SSL ayarları (geçici olarak self-signed)
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
EOF

# master.cf'de submission portunu aktif et
if ! grep -q "^submission" /etc/postfix/master.cf; then
    cat >> /etc/postfix/master.cf <<EOF

submission inet n       -       y       -       -       smtpd
  -o syslog_name=postfix/submission
  -o smtpd_tls_security_level=encrypt
  -o smtpd_sasl_auth_enable=yes
  -o smtpd_tls_auth_only=yes
  -o smtpd_reject_unlisted_recipient=no
  -o smtpd_client_restrictions=\$mua_client_restrictions
  -o smtpd_helo_restrictions=\$mua_helo_restrictions
  -o smtpd_sender_restrictions=\$mua_sender_restrictions
  -o smtpd_recipient_restrictions=
  -o smtpd_relay_restrictions=permit_sasl_authenticated,reject
  -o milter_macro_daemon_name=ORIGINATING
EOF
fi

# Postfix yapılandırmasını kontrol et
echo "🔍 Yapılandırma kontrol ediliyor..."
postfix check

# Postfix'i başlat
echo "🚀 Postfix başlatılıyor..."
systemctl enable postfix
systemctl restart postfix

# Durum kontrolü
if systemctl is-active --quiet postfix; then
    echo -e "${GREEN}✅ Postfix başarıyla başlatıldı!${NC}"
else
    echo -e "${RED}❌ Postfix başlatılamadı! Logları kontrol edin: tail -f /var/log/mail.log${NC}"
    exit 1
fi

# Port kontrolü
echo ""
echo "🔍 Port kontrolü yapılıyor..."
if netstat -tlnp 2>/dev/null | grep -q ":25 "; then
    echo -e "${GREEN}✅ Port 25 (SMTP) açık${NC}"
else
    echo -e "${YELLOW}⚠️ Port 25 kontrol edilemedi${NC}"
fi

if netstat -tlnp 2>/dev/null | grep -q ":587 "; then
    echo -e "${GREEN}✅ Port 587 (Submission) açık${NC}"
else
    echo -e "${YELLOW}⚠️ Port 587 kontrol edilemedi${NC}"
fi

# Firewall uyarısı
echo ""
echo -e "${YELLOW}⚠️ Firewall Ayarları:${NC}"
echo "Aşağıdaki portları açmanız gerekiyor:"
echo "  sudo ufw allow 25/tcp"
echo "  sudo ufw allow 587/tcp"
echo "  sudo ufw allow 465/tcp"
echo ""

# DNS uyarısı
echo -e "${YELLOW}⚠️ DNS Ayarları:${NC}"
echo "Domain DNS ayarlarınıza şunları ekleyin:"
echo ""
echo "A Kaydı:"
echo "  ${MAIL_HOST}    A    $(curl -s ifconfig.me)"
echo ""
echo "MX Kaydı:"
echo "  ${DOMAIN}    MX    10    ${MAIL_HOST}"
echo ""
echo "SPF Kaydı:"
echo "  ${DOMAIN}    TXT    \"v=spf1 mx a:${MAIL_HOST} ~all\""
echo ""

# Test email komutu
echo -e "${GREEN}📧 Test Email Gönderme:${NC}"
echo "Test email göndermek için:"
echo "  echo 'Test mesajı' | mail -s 'Test Email' your-email@gmail.com"
echo ""

# Backend API için environment variables
echo -e "${GREEN}🔧 Backend API Environment Variables:${NC}"
echo "Backend API'nizde .env dosyasına şunları ekleyin:"
echo ""
echo "SMTP_HOST=${MAIL_HOST}"
echo "SMTP_PORT=587"
echo "SMTP_USER=contact@${DOMAIN}"
echo "SMTP_PASS=your-email-password"
echo "CONTACT_EMAIL=your-email@${DOMAIN}"
echo ""

echo -e "${GREEN}✅ Postfix kurulumu tamamlandı!${NC}"
echo ""
echo "📚 Detaylı bilgi için: backend/POSTFIX_SETUP.md"
echo ""

