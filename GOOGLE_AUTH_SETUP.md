# 🔐 Google Authentication Setup

## 📋 Firebase Console'da Google Authentication'ı Aktifleştir

### 1. Firebase Console'a Git
1. [Firebase Console](https://console.firebase.google.com/)'a git
2. Projeni seç: `myportfolio-1e13b`

### 2. Authentication'ı Aktifleştir
1. Sol menüden **Authentication** seç
2. **Get started** veya **Sign-in method** sekmesine git
3. **Sign-in providers** listesinden **Google**'ı seç
4. **Enable** toggle'ını aç
5. **Project support email** seç (veya ekle)
6. **Save** butonuna tıkla

### 3. OAuth Consent Screen (İlk kez kullanıyorsan)
Eğer Google Cloud Console'da OAuth consent screen yapılandırılmamışsa:
1. Firebase Console'da bir uyarı göreceksin
2. **Configure consent screen** linkine tıkla
3. Google Cloud Console'a yönlendirileceksin
4. OAuth consent screen'i yapılandır:
   - **User Type**: External (genel kullanım için)
   - **App name**: Portfolio App (veya istediğin isim)
   - **User support email**: Kendi email'in
   - **Developer contact information**: Kendi email'in
   - **Save and Continue**
   - **Scopes**: Varsayılanları kullan (email, profile)
   - **Save and Continue**
   - **Test users**: Development için kendi email'ini ekle (opsiyonel)
   - **Save and Continue**

### 4. Authorized Domains Kontrolü
Firebase Console > Authentication > Settings > Authorized domains:
- `localhost` (zaten ekli)
- `myportfolio-1e13b.firebaseapp.com` (zaten ekli)
- `myportfolio-1e13b.web.app` (zaten ekli)
- Production domain'ini ekle (örn: `tolgacavga.com`)

## ✅ Test Et

1. Uygulamayı çalıştır: `npm run dev`
2. Login modal'ını aç
3. "Sign in with Google" butonuna tıkla
4. Google popup'ı açılmalı
5. Google hesabını seç
6. İzinleri onayla
7. Başarıyla giriş yapılmalı

## 🔧 Sorun Giderme

### Popup açılmıyor
- **Sorun**: Popup blocker aktif olabilir
- **Çözüm**: Tarayıcı ayarlarından popup'ları izin ver

### "auth/popup-closed-by-user" hatası
- **Sorun**: Kullanıcı popup'ı kapattı
- **Çözüm**: Normal, kullanıcı iptal etti

### "auth/cancelled-popup-request" hatası
- **Sorun**: Aynı anda birden fazla popup açılmaya çalışıldı
- **Çözüm**: Bir popup açıkken diğerini açma

### OAuth consent screen hatası
- **Sorun**: OAuth consent screen yapılandırılmamış
- **Çözüm**: Yukarıdaki adımları takip et

## 📝 Notlar

- Google Sign-In popup kullanır (redirect değil)
- İlk girişte kullanıcı Firestore'da otomatik oluşturulur
- Kullanıcı bilgileri (name, email, avatar) Google'dan alınır
- Token otomatik olarak alınır ve store'a kaydedilir

