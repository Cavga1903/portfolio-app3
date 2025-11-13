#!/bin/bash

# Postfix Multi-Domain Quick Setup Script
# Bir sunucuda birden fazla domain için Postfix yapılandırması
# Kullanım: sudo bash POSTFIX_MULTI_DOMAIN_QUICK.sh

set -e

echo "🌐 Postfix Multi-Domain Yapılandırması Başlıyor..."
echo ""

# Renk kodları
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Domain'leri al
echo -e "${YELLOW}Domain'leri girin (virgülle ayırın, örn: cavga.dev,project2.com,project3.com):${NC}"
read -p "Domain'ler: " DOMAINS_INPUT

if [ -z "$DOMAINS_INPUT" ]; then
    echo -e "${RED}Domain listesi boş olamaz!${NC}"
    exit 1
fi

# Domain'leri array'e çevir
IFS=',' read -ra DOMAIN_ARRAY <<< "$DOMAINS_INPUT"
FIRST_DOMAIN=${DOMAIN_ARRAY[0]}
MAIL_HOST="mail.${FIRST_DOMAIN}"

echo ""
echo -e "${GREEN}İlk Domain (Ana): ${FIRST_DOMAIN}${NC}"
echo -e "${GREEN}Mail Hostname: ${MAIL_HOST}${NC}"
echo -e "${GREEN}Toplam Domain Sayısı: ${#DOMAIN_ARRAY[@]}${NC}"
echo ""

# Vmail kullanıcısı oluştur
echo "👤 Vmail kullanıcısı oluşturuluyor..."
if ! id -u vmail > /dev/null 2>&1; then
    groupadd -g 5000 vmail
    useradd -g 5000 -u 5000 -d /var/mail/vhosts -s /bin/false vmail
    echo -e "${GREEN}✅ Vmail kullanıcısı oluşturuldu${NC}"
else
    echo -e "${YELLOW}⚠️ Vmail kullanıcısı zaten var${NC}"
fi

# Dizinleri oluştur
echo "📁 Dizinler oluşturuluyor..."
mkdir -p /var/mail/vhosts
chown -R vmail:vmail /var/mail/vhosts
chmod -R 700 /var/mail/vhosts

# Virtual domains dosyası oluştur
echo "📝 Virtual domains dosyası oluşturuluyor..."
cat > /etc/postfix/virtual_domains <<EOF
# Virtual Domains
EOF

for domain in "${DOMAIN_ARRAY[@]}"; do
    echo "${domain}           OK" >> /etc/postfix/virtual_domains
    echo -e "${GREEN}  ✅ ${domain} eklendi${NC}"
done

# Virtual mailbox dosyası oluştur
echo ""
echo "📝 Virtual mailbox dosyası oluşturuluyor..."
cat > /etc/postfix/virtual_mailbox <<EOF
# Virtual Mailbox
EOF

for domain in "${DOMAIN_ARRAY[@]}"; do
    echo "contact@${domain}           ${domain}/contact/" >> /etc/postfix/virtual_mailbox
    echo "info@${domain}              ${domain}/info/" >> /etc/postfix/virtual_mailbox
    
    # Dizinleri oluştur
    mkdir -p /var/mail/vhosts/${domain}/contact
    mkdir -p /var/mail/vhosts/${domain}/info
    chown -R vmail:vmail /var/mail/vhosts/${domain}
    
    echo -e "${GREEN}  ✅ ${domain} için contact@ ve info@ eklendi${NC}"
done

# Virtual alias dosyası oluştur (boş)
echo ""
echo "📝 Virtual alias dosyası oluşturuluyor..."
cat > /etc/postfix/virtual_alias <<EOF
# Virtual Alias (Email yönlendirmeleri için)
# Format: email@domain.com    target-email@gmail.com
EOF

# Dosyaları hash'le
echo ""
echo "🔐 Dosyalar hash'leniyor..."
postmap /etc/postfix/virtual_domains
postmap /etc/postfix/virtual_mailbox
postmap /etc/postfix/virtual_alias

# main.cf yedekle
echo ""
echo "💾 main.cf yedekleniyor..."
cp /etc/postfix/main.cf /etc/postfix/main.cf.backup.$(date +%Y%m%d_%H%M%S)

# main.cf'yi güncelle
echo "⚙️ main.cf güncelleniyor..."

# Virtual domain ayarlarını ekle
if ! grep -q "virtual_mailbox_domains" /etc/postfix/main.cf; then
    cat >> /etc/postfix/main.cf <<EOF

# Virtual Domains (Multi-Domain)
virtual_mailbox_domains = hash:/etc/postfix/virtual_domains
virtual_mailbox_maps = hash:/etc/postfix/virtual_mailbox
virtual_alias_maps = hash:/etc/postfix/virtual_alias
virtual_mailbox_base = /var/mail/vhosts
virtual_minimum_uid = 100
virtual_uid_maps = static:5000
virtual_gid_maps = static:5000
EOF
fi

# myhostname ve mydomain'i güncelle
sed -i "s/^myhostname = .*/myhostname = ${MAIL_HOST}/" /etc/postfix/main.cf
sed -i "s/^mydomain = .*/mydomain = ${FIRST_DOMAIN}/" /etc/postfix/main.cf

# Yapılandırmayı kontrol et
echo ""
echo "🔍 Yapılandırma kontrol ediliyor..."
postfix check

# Postfix'i yeniden başlat
echo ""
echo "🚀 Postfix yeniden başlatılıyor..."
systemctl restart postfix

# Durum kontrolü
if systemctl is-active --quiet postfix; then
    echo -e "${GREEN}✅ Postfix başarıyla başlatıldı!${NC}"
else
    echo -e "${RED}❌ Postfix başlatılamadı! Logları kontrol edin: tail -f /var/log/mail.log${NC}"
    exit 1
fi

# Özet
echo ""
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ Multi-Domain Yapılandırması Tamamlandı!${NC}"
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo ""
echo -e "${YELLOW}📋 Yapılandırılan Domain'ler:${NC}"
for domain in "${DOMAIN_ARRAY[@]}"; do
    echo -e "  • ${domain}"
done
echo ""
echo -e "${YELLOW}📧 Oluşturulan Email Adresleri:${NC}"
for domain in "${DOMAIN_ARRAY[@]}"; do
    echo -e "  • contact@${domain}"
    echo -e "  • info@${domain}"
done
echo ""
echo -e "${YELLOW}🌐 DNS Ayarları:${NC}"
for domain in "${DOMAIN_ARRAY[@]}"; do
    echo ""
    echo -e "${GREEN}${domain}:${NC}"
    echo "  A Kaydı: mail.${domain}    A    $(curl -s ifconfig.me)"
    echo "  MX Kaydı: ${domain}    MX    10    mail.${domain}"
    echo "  SPF Kaydı: ${domain}    TXT    \"v=spf1 mx a:mail.${domain} ~all\""
done
echo ""
echo -e "${YELLOW}🔧 Backend API Environment Variables:${NC}"
for domain in "${DOMAIN_ARRAY[@]}"; do
    echo ""
    echo -e "${GREEN}# ${domain}${NC}"
    echo "SMTP_HOST=mail.${domain}"
    echo "SMTP_PORT=587"
    echo "SMTP_USER=contact@${domain}"
    echo "SMTP_PASS=your-password"
    echo "CONTACT_EMAIL=contact@${domain}"
done
echo ""
echo -e "${YELLOW}📝 Yeni Email Adresi Ekleme:${NC}"
echo "1. sudo nano /etc/postfix/virtual_mailbox"
echo "2. Yeni satır ekle: newemail@domain.com    domain.com/newemail/"
echo "3. sudo postmap /etc/postfix/virtual_mailbox"
echo "4. sudo mkdir -p /var/mail/vhosts/domain.com/newemail"
echo "5. sudo chown -R vmail:vmail /var/mail/vhosts/domain.com/newemail"
echo "6. sudo systemctl restart postfix"
echo ""
echo -e "${GREEN}✅ Kurulum tamamlandı!${NC}"
echo ""

