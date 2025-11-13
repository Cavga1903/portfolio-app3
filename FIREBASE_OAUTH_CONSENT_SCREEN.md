# 🔐 OAuth Consent Screen Yapılandırması

## 📋 Neden Gerekli?

Google Authentication kullanmak için OAuth Consent Screen'in yapılandırılması gerekiyor. Bu, Google'ın güvenlik ve kullanıcı gizliliği gereksinimlerinden kaynaklanıyor.

## ✅ Adım Adım Yapılandırma

### 1. Firebase Console'dan Başla

1. [Firebase Console](https://console.firebase.google.com/) > Projeni seç (`myportfolio-1e13b`)
2. **Authentication** > **Sign-in method** sekmesine git
3. **Google** provider'ını aç
4. Eğer "OAuth consent screen" uyarısı görüyorsan:
   - **Configure consent screen** linkine tıkla
   - Google Cloud Console'a yönlendirileceksin

### 2. OAuth Consent Screen Yapılandır

Google Cloud Console'da:

#### Step 1: OAuth consent screen
- **User Type**: **External** seç (genel kullanım için)
  - Internal sadece Google Workspace organizasyonları için
- **Create** butonuna tıkla

#### Step 2: App information
- **App name**: `Portfolio App` (veya istediğin isim)
- **User support email**: `tolga@cavgalabs.com` (dropdown'dan seç)
- **App logo**: (Opsiyonel) Logo yükle
- **App domain**: (Opsiyonel) `tolgacavga.com` veya `cavga.dev`
- **Application home page**: (Opsiyonel) `https://tolgacavga.com`
- **Application privacy policy link**: (Opsiyonel) Privacy policy URL'i
- **Application terms of service link**: (Opsiyonel) Terms of service URL'i
- **Authorized domains**: Otomatik eklenir
- **Developer contact information**: `tolga@cavgalabs.com`
- **Save and Continue** butonuna tıkla

#### Step 3: Scopes
- Varsayılan scopes yeterli:
  - `email`
  - `profile`
  - `openid`
- **Save and Continue** butonuna tıkla

#### Step 4: Test users (Development için)
- Development aşamasında test kullanıcıları ekleyebilirsin
- Kendi email'ini ekle: `tolga@cavgalabs.com`
- **Save and Continue** butonuna tıkla

#### Step 5: Summary
- Tüm bilgileri kontrol et
- **Back to Dashboard** butonuna tıkla

### 3. Firebase Console'a Dön

1. Firebase Console'a geri dön
2. **Authentication** > **Sign-in method** > **Google**
3. Artık uyarı görünmemeli
4. **Save** butonuna tıkla (eğer değişiklik yaptıysan)

## ⚠️ Önemli Notlar

### Development vs Production

- **Development**: Test users ekleyerek sadece belirli email'lerle test edebilirsin
- **Production**: OAuth consent screen'i "Publish App" yaparak production'a alabilirsin
  - Google'ın verification süreci gerekebilir (7-14 gün)
  - Production'da herkes kullanabilir

### Verification Gereksinimleri

Eğer production'da kullanmak istiyorsan:
- Privacy Policy URL gerekli
- Terms of Service URL gerekli (bazı durumlarda)
- Google verification süreci gerekebilir

### Test Users (Development)

Development aşamasında:
- Test users listesine eklediğin email'lerle giriş yapabilirsin
- Diğer email'lerle giriş yapamazsın (verification gerekir)

## ✅ Kontrol Listesi

- [ ] OAuth consent screen yapılandırıldı
- [ ] User Type: External seçildi
- [ ] App name girildi
- [ ] Support email seçildi
- [ ] Developer contact email girildi
- [ ] Scopes ayarlandı (varsayılanlar yeterli)
- [ ] Test users eklendi (development için)
- [ ] Firebase Console'da Google provider "Save" edildi
- [ ] Uygulama test edildi

## 🧪 Test

1. Uygulamayı yenile: `npm run dev` (eğer çalışmıyorsa)
2. Tarayıcıyı yenile (F5)
3. Login modal'ını aç
4. "Sign in with Google" butonuna tıkla
5. Google popup'ı açılmalı
6. Test user email'i ile giriş yap
7. Başarıyla giriş yapılmalı

## 🔄 Hala Çalışmıyorsa

1. **Browser cache temizle:**
   - Chrome: Ctrl+Shift+Delete (Windows) veya Cmd+Shift+Delete (Mac)
   - Cache'i temizle ve sayfayı yenile

2. **Firebase Console'u kontrol et:**
   - Authentication > Users
   - Giriş denemeleri görünüyor mu?

3. **Console hatalarını kontrol et:**
   - F12 > Console
   - Detaylı hata mesajlarını gör

4. **OAuth Consent Screen durumunu kontrol et:**
   - Google Cloud Console > APIs & Services > OAuth consent screen
   - Status: "Testing" veya "In production" olmalı

## 📝 Notlar

- OAuth consent screen yapılandırması birkaç dakika sürebilir
- Değişikliklerin aktif olması için birkaç saniye bekle
- Development'ta test users kullan, production'da verification gerekir

