# 🔧 OAuth Client Yapılandırması

## ❌ Sorun
Google Cloud Console'da "You haven't configured any OAuth clients for this project yet" mesajı görünüyor.

## ⚠️ ÖNEMLİ: Proje Kontrolü

**Firebase Projesi:** `myportfolio-1e13b`  
**Google Cloud Console'da görünen:** `my-portfolio-478020`

Bu farklı projeler olabilir! Doğru projeyi seçtiğinden emin ol.

## ✅ Çözüm: Doğru Projeyi Seç

### 1. Google Cloud Console'da Proje Seçici

1. Üst kısımdaki proje seçiciye tıkla (şu an "my-portfolio" görünüyor)
2. **Tüm projeleri göster**
3. `myportfolio-1e13b` projesini ara ve seç
4. Eğer listede yoksa:
   - Firebase Console'dan proje ID'sini kontrol et
   - Google Cloud Console'da aynı projeyi seç

### 2. Firebase Console'dan Proje ID Kontrolü

Firebase Console > Project Settings > General:
- **Project ID:** `myportfolio-1e13b`
- **Project number:** `419940030464`

Google Cloud Console'da bu projeyi seç.

## 🔍 OAuth Client Kontrolü

### Firebase Console'da Web Client ID Kontrolü

1. Firebase Console > **Authentication** > **Sign-in method** > **Google**
2. **Web SDK configuration** bölümünde:
   - **Web client ID:** `419940030464-4l5ii3fmfhd77dc2vj1isc2rtl2suasm.apps.googleusercontent.com`
   - Bu ID var mı? ✅ (Daha önce gördük)

### Google Cloud Console'da OAuth Client Kontrolü

1. Google Cloud Console > Doğru projeyi seç (`myportfolio-1e13b`)
2. **APIs & Services** > **Credentials**
3. **OAuth 2.0 Client IDs** bölümünde:
   - Web client ID var mı?
   - Client ID: `419940030464-4l5ii3fmfhd77dc2vj1isc2rtl2suasm.apps.googleusercontent.com` var mı?

## 🚀 Eğer OAuth Client Yoksa

### Firebase Console'dan Otomatik Oluşturma

Firebase Console'da Google provider'ını enable ettiğinde, Firebase otomatik olarak Google Cloud Console'da OAuth client oluşturur.

**Kontrol:**
1. Firebase Console > Authentication > Sign-in method > Google
2. **Save** butonuna bas (eğer değişiklik yaptıysan)
3. Birkaç dakika bekle
4. Google Cloud Console'da tekrar kontrol et

### Manuel Oluşturma (Gerekirse)

Eğer otomatik oluşturulmadıysa:

1. Google Cloud Console > Doğru projeyi seç (`myportfolio-1e13b`)
2. **APIs & Services** > **Credentials**
3. **+ CREATE CREDENTIALS** > **OAuth client ID**
4. **Application type:** Web application ✅ (zaten seçili)
5. **Name:** `Firebase Web Client` (veya istediğin isim)
6. **Authorized JavaScript origins:** (Her birini "+ Add URI" ile ekle)
   - `http://localhost:5173`
   - `https://localhost:5173`
   - `https://tolgacavga.com`
   - `https://cavga.dev`
   - `https://myportfolio-1e13b.firebaseapp.com`
   - `https://myportfolio-1e13b.web.app`
7. **Authorized redirect URIs:** (Her birini "+ Add URI" ile ekle)
   - `http://localhost:5173/__/auth/handler`
   - `https://localhost:5173/__/auth/handler`
   - `https://tolgacavga.com/__/auth/handler`
   - `https://cavga.dev/__/auth/handler`
   - `https://myportfolio-1e13b.firebaseapp.com/__/auth/handler`
   - `https://myportfolio-1e13b.web.app/__/auth/handler`
8. **Create** butonuna tıkla
9. **Client ID** ve **Client secret** kopyala
10. Firebase Console > Authentication > Sign-in method > Google
11. **Web SDK configuration** bölümünde:
    - **Web client ID:** Yeni oluşturduğun Client ID'yi yapıştır
    - **Web client secret:** Yeni oluşturduğun Client secret'ı yapıştır
12. **Save** butonuna tıkla

## 📝 Notlar

- Firebase genellikle OAuth client'ı otomatik oluşturur
- Eğer manuel oluşturursan, Firebase Console'da da güncellemen gerekir
- OAuth client oluşturulduktan sonra birkaç dakika bekle (propagation için)

## ✅ Kontrol Listesi

- [ ] Google Cloud Console'da doğru projeyi seçtin mi? (`myportfolio-1e13b`)
- [ ] APIs & Services > Credentials > OAuth 2.0 Client IDs'de Web client var mı?
- [ ] Client ID Firebase Console'daki ile eşleşiyor mu?
- [ ] Eğer yoksa, Firebase Console'da Google provider'ını tekrar save ettin mi?
- [ ] Birkaç dakika bekledin mi?

