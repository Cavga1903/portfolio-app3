# 📧 EmailJS Kurulum Rehberi

Bu portfolyo sitesinde iletişim formundan gelen mesajların e-posta olarak gönderilmesi için **EmailJS** servisi kullanılmaktadır.

## 🚀 Kurulum Adımları

### 1. EmailJS Hesabı Oluşturma

1. [EmailJS](https://www.emailjs.com/) sitesine gidin
2. **Sign Up** butonuna tıklayarak ücretsiz bir hesap oluşturun
3. E-posta adresinizi doğrulayın

### 2. Email Servisi Ekleme

1. Dashboard'da **Add New Service** butonuna tıklayın
2. Gmail servisini seçin (veya istediğiniz başka bir e-posta servisini)
3. Gmail hesabınızla bağlantı kurun
4. Service'e bir isim verin (örn: `service_portfolio`)
5. **Service ID**'yi kopyalayın ve saklayın

### 3. Email Template Oluşturma

1. Dashboard'da **Email Templates** sekmesine gidin
2. **Create New Template** butonuna tıklayın
3. Template'e bir isim verin (örn: `template_contact`)
4. Aşağıdaki template'i kullanabilirsiniz:

```
Subject: 📬 Portfolyo'dan Yeni Mesaj - {{from_name}}

Merhaba Tolga,

Portfolyo sitenizden yeni bir mesaj aldınız!

👤 Gönderen: {{from_name}}
📧 E-posta: {{from_email}}

💬 Mesaj:
{{message}}

---
Bu mesaj www.tolgacavga.com adresinden gönderilmiştir.
```

5. **Save** butonuna tıklayın
6. **Template ID**'yi kopyalayın ve saklayın

### 4. Public Key Alma

1. Dashboard'da **Account** sekmesine gidin
2. **General** tab'ında **Public Key** bölümünü bulun
3. Public Key'i kopyalayın

### 5. Environment Variables Ayarlama

1. Proje kök dizininde `.env` dosyasını açın
2. Aldığınız değerleri aşağıdaki gibi ekleyin:

```env
VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxxxxx
```

3. Dosyayı kaydedin

### 6. Kodu Güncelleme

`src/components/Contact.tsx` dosyasında aşağıdaki satırları bulun ve güncelleyin:

```typescript
await emailjs.send(
  import.meta.env.VITE_EMAILJS_SERVICE_ID,
  import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  {
    from_name: formData.name,
    from_email: formData.email,
    message: formData.message,
  },
  import.meta.env.VITE_EMAILJS_PUBLIC_KEY
);
```

### 7. Test Etme

1. Development server'ı yeniden başlatın:
   ```bash
   npm run dev
   ```

2. İletişim formunu doldurun ve "Gönder" butonuna tıklayın
3. E-posta kutunuzu kontrol edin

## 📝 Notlar

- EmailJS ücretsiz planında **ayda 200 e-posta** gönderme limiti vardır
- Daha fazla e-posta göndermeniz gerekiyorsa [ücretli planlara](https://www.emailjs.com/pricing/) göz atabilirsiniz
- `.env` dosyası `.gitignore`'da olduğu için GitHub'a yüklenmeyecektir
- Production'a deploy ederken environment variables'ları hosting platformunuzda (Vercel, Netlify, vb.) ayarlamayı unutmayın

## 🔒 Güvenlik

- Public Key'inizi paylaşmaktan çekinmeyin, zaten public'tir
- Ancak Service ID ve Template ID'yi paylaşmamaya özen gösterin
- EmailJS dashboard'unda "Auto-Reply" ve "CAPTCHA" özelliklerini aktif edebilirsiniz

## 🆘 Sorun Giderme

**Form gönderilmiyor:**
- Console'da hata mesajlarını kontrol edin
- Environment variables'ların doğru yazıldığından emin olun
- EmailJS dashboard'unda servis ve template'in aktif olduğunu kontrol edin

**E-posta gelmiyor:**
- Spam klasörünü kontrol edin
- EmailJS dashboard'unda Activity Log'u kontrol edin
- Template'deki değişken isimlerinin kodla eşleştiğinden emin olun

## 📚 Kaynaklar

- [EmailJS Dökümantasyonu](https://www.emailjs.com/docs/)
- [React ile EmailJS Kullanımı](https://www.emailjs.com/docs/examples/reactjs/)

