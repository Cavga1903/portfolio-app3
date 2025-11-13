# 🔐 Firebase Test User Setup

## ❌ Hata: INVALID_LOGIN_CREDENTIALS

Bu hata, email veya password'ün yanlış olduğu veya kullanıcının mevcut olmadığı anlamına gelir.

## 🚀 Çözüm: Test Kullanıcısı Oluştur

### Yöntem 1: Firebase Console'dan Manuel Oluştur (Önerilen)

1. **Firebase Console**'a git: https://console.firebase.google.com
2. Projeni seç: `myportfolio-1e13b`
3. Sol menüden **Authentication** > **Users** sekmesine git
4. **"Add user"** butonuna tıkla
5. Şu bilgileri gir:
   - **Email**: `test@example.com` (veya istediğin bir email)
   - **Password**: `test123456` (en az 6 karakter)
6. **"Add user"** butonuna tıkla
7. Kullanıcı oluşturuldu! ✅

### Yöntem 2: Postman ile Signup Yap

1. Postman'de **"Firebase Auth - Sign Up"** request'ini aç
2. Body'yi şu şekilde doldur:
   ```json
   {
     "email": "test@example.com",
     "password": "test123456",
     "returnSecureToken": true
   }
   ```
3. **Send** butonuna tıkla
4. Response'da `idToken` ve `localId` değerlerini al
5. Environment'ta `firebaseIdToken` ve `userId` değerlerini güncelle

### Yöntem 3: Uygulamadan Signup Yap

1. Uygulamayı aç: `http://localhost:5173` (veya production URL)
2. Navbar'daki profil ikonuna tıkla
3. **"Kayıt Ol"** butonuna tıkla
4. Formu doldur:
   - **Ad**: Test User
   - **E-posta**: test@example.com
   - **Şifre**: test123456
   - **Şifre Tekrar**: test123456
5. **"Kayıt Ol"** butonuna tıkla
6. Başarılı olursa, otomatik olarak `/blog` sayfasına yönlendirileceksin

## ✅ Test Kullanıcısı ile Login

Kullanıcı oluşturulduktan sonra:

### Postman'de Test Et

1. **"Firebase Auth - Sign In with Email"** request'ini aç
2. Body'yi şu şekilde doldur:
   ```json
   {
     "email": "test@example.com",
     "password": "test123456",
     "returnSecureToken": true
   }
   ```
3. **Send** butonuna tıkla
4. Başarılı response almalısın:
   ```json
   {
     "idToken": "...",
     "email": "test@example.com",
     "localId": "...",
     "expiresIn": "3600"
   }
   ```

### Uygulamada Test Et

1. Navbar'daki profil ikonuna tıkla
2. **"Giriş Yap"** butonuna tıkla
3. Email ve password'ü gir
4. **"Giriş Yap"** butonuna tıkla
5. Başarılı olursa, `/blog` veya `/admin` sayfasına yönlendirileceksin

## 🔍 Troubleshooting

### "EMAIL_EXISTS" Hatası

- Bu email zaten kullanılıyor
- Farklı bir email kullan veya mevcut kullanıcı ile login yap

### "WEAK_PASSWORD" Hatası

- Password en az 6 karakter olmalı
- Daha güçlü bir password kullan

### "INVALID_EMAIL" Hatası

- Email formatı yanlış
- Geçerli bir email formatı kullan (örn: `test@example.com`)

### "USER_DISABLED" Hatası

- Kullanıcı Firebase Console'dan devre dışı bırakılmış
- Firebase Console > Authentication > Users > Kullanıcıyı seç > Enable

## 📝 Test Kullanıcıları İçin Öneriler

1. **Development için**:
   - Email: `dev@test.com`
   - Password: `dev123456`

2. **Admin test için**:
   - Email: `admin@test.com`
   - Password: `admin123456`
   - Not: Admin role'ü Firestore'da manuel olarak `users/{userId}` document'inde `role: "admin"` olarak ayarlanmalı

3. **Production için**:
   - Gerçek kullanıcılar kendi hesaplarını oluşturmalı
   - Test kullanıcıları production'da kullanılmamalı

## 🎯 Sonraki Adımlar

1. ✅ Test kullanıcısı oluştur
2. ✅ Login yap ve token al
3. ✅ Firestore'da user document oluştur (signup sırasında otomatik oluşmalı)
4. ✅ Blog post'ları test et
5. ✅ Admin panel'i test et (eğer admin role'ü varsa)

