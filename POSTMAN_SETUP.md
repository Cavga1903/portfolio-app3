# 📬 Postman Setup Guide

## 🚀 Hızlı Başlangıç

### 1. Postman Collection'ı Import Et

1. Postman'i aç
2. Sol üstteki **"Import"** butonuna tıkla
3. **"File"** sekmesine git
4. `postman_collection.json` dosyasını seç
5. **"Import"** butonuna tıkla

### 2. Environment Dosyasını Import Et

1. Postman'de sağ üstteki **"Environments"** sekmesine tıkla (veya `Cmd/Ctrl + E`)
2. **"Import"** butonuna tıkla
3. `postman_environment.json` dosyasını seç
4. **"Import"** butonuna tıkla
5. Sağ üstteki environment dropdown'dan **"Portfolio App Environment"** seç

### 3. Environment Variables'ı Güncelle

Environment'ı seçtikten sonra, gerekirse değerleri güncelleyebilirsin:

- **baseUrl**: 
  - Development: `http://localhost:5173`
  - Production: `https://www.cavga.dev`
  
- **firebaseApiKey**: Firebase Console'dan al (zaten dolu)
- **firebaseProjectId**: `myportfolio-1e13b` (zaten dolu)
- **token**: Login yaptıktan sonra otomatik doldurulacak
- **firebaseIdToken**: Firebase Auth ile login yaptıktan sonra doldurulacak
- **userId**: Login yaptıktan sonra doldurulacak

## 📋 Test Senaryoları

### Senaryo 1: Firebase Auth ile Login Test

1. **Firebase Auth - Sign In with Email** request'ini aç
2. Body'deki email ve password'ü doldur:
   ```json
   {
     "email": "test@example.com",
     "password": "password123",
     "returnSecureToken": true
   }
   ```
3. **Send** butonuna tıkla
4. Response'dan `idToken` değerini kopyala
5. Environment'a git ve `firebaseIdToken` değerini güncelle
6. Response'dan `localId` değerini kopyala ve `userId` değerini güncelle

### Senaryo 2: Firestore User Document Oluşturma Test

1. Önce Firebase Auth ile login yap (Senaryo 1)
2. **Firestore - Create User Document** request'ini aç
3. Body'deki `userId` değerini environment'taki `userId` ile değiştir
4. **Send** butonuna tıkla
5. Başarılı olursa, Firestore Console'da `users` collection'ında yeni document görmelisin

### Senaryo 3: Blog Posts Test

1. **Get All Blog Posts** request'ini aç
2. **Send** butonuna tıkla
3. Response'da blog post'ları görmelisin

### Senaryo 4: API Auth Test (Eğer backend varsa)

1. **Login** request'ini aç
2. Body'deki email ve password'ü doldur
3. **Send** butonuna tıkla
4. Response'dan `token` değerini kopyala
5. Environment'a git ve `token` değerini güncelle
6. Artık authenticated request'leri test edebilirsin

## 🔧 Troubleshooting

### "401 Unauthorized" Hatası

- `firebaseIdToken` veya `token` değerinin güncel olduğundan emin ol
- Token'ın expire olmadığını kontrol et (genellikle 1 saat geçerlidir)
- Yeni bir login yap ve token'ı güncelle

### "403 Forbidden" veya "Missing or insufficient permissions" Hatası

- Firebase Security Rules'u kontrol et
- `FIREBASE_SECURITY_RULES_FIXED.md` dosyasındaki kuralları uyguladığından emin ol
- User document'inin doğru şekilde oluşturulduğunu kontrol et

### "400 Bad Request" Hatası

- Request body'nin doğru format'ta olduğundan emin ol
- Gerekli alanların doldurulduğunu kontrol et
- Firebase API key'in doğru olduğundan emin ol

## 📝 Notlar

- Firebase Auth token'ları genellikle 1 saat geçerlidir
- Token expire olduğunda yeni bir login yapman gerekir
- Environment variables'ı güncelledikten sonra, request'ler otomatik olarak yeni değerleri kullanır
- Collection'daki tüm request'ler environment variables kullanır, bu yüzden bir kez ayarladıktan sonra tüm request'lerde çalışır

## 🎯 İpuçları

1. **Pre-request Scripts**: Postman'de pre-request script'ler ekleyerek token'ı otomatik yenileyebilirsin
2. **Tests**: Response'ları otomatik test etmek için "Tests" sekmesine script'ler ekleyebilirsin
3. **Collection Runner**: Birden fazla request'i sırayla çalıştırmak için Collection Runner kullanabilirsin

