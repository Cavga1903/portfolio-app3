# 🔒 Firebase Security Rules - Blog Posts Fix

## ❌ Hata: Missing or insufficient permissions

Bu hata, Firestore security rules'ların blog post oluşturmayı engellediği anlamına gelir.

## 🚀 Çözüm: Security Rules'u Güncelle

### Firebase Console'da Uygula

1. **Firebase Console**'a git: https://console.firebase.google.com
2. Projeni seç: `myportfolio-1e13b`
3. Sol menüden **Firestore Database** > **Rules** sekmesine git
4. Mevcut kuralları sil ve aşağıdaki kuralları yapıştır:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function: Check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper function: Check if user is admin
    function isAdmin() {
      return isAuthenticated() && 
             exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Users collection
    match /users/{userId} {
      // Users can read their own data, admins can read all
      allow read: if isAuthenticated() && (request.auth.uid == userId || isAdmin());
      
      // IMPORTANT: Allow users to create their own user document during signup
      allow create: if request.auth != null && 
                       request.auth.uid == userId &&
                       request.resource.data.keys().hasAll(['name', 'email', 'role', 'createdAt']) &&
                       request.resource.data.role == 'user';
      
      // Only admins can create/update other users
      allow create: if isAdmin();
      
      // Only admins can update other users
      allow update: if isAdmin();
      
      // Users can update their own profile (limited fields)
      allow update: if request.auth.uid == userId && 
                       request.resource.data.diff(resource.data).unchangedKeys().hasAll(['role', 'createdAt']);
    }
    
    // Blog Posts collection - FIXED FOR CREATE
    match /blogPosts/{postId} {
      // Everyone can read published posts
      // Authenticated users can read all posts (including drafts)
      allow read: if resource.data.isPublished == true || isAuthenticated();
      
      // FIXED: Allow authenticated users to create posts
      allow create: if isAuthenticated() && 
                       request.resource.data.keys().hasAll(['title', 'slug', 'content', 'author']) &&
                       request.resource.data.author.id == request.auth.uid;
      
      // Only admins can update/delete posts
      allow update, delete: if isAdmin();
      
      // Authors can update their own posts (if not admin)
      allow update: if isAuthenticated() && 
                       resource.data.author.id == request.auth.uid &&
                       request.resource.data.diff(resource.data).unchangedKeys().hasAll(['author']);
    }
    
    // Project Likes (existing)
    match /projectLikes/{likeId} {
      allow read: if true;
      allow create, update: if isAuthenticated();
      allow delete: if isAuthenticated() && resource.data.userId == request.auth.uid;
    }
    
    // Project Stats (existing)
    match /projectStats/{projectId} {
      allow read: if true;
      allow write: if isAuthenticated();
    }
  }
}
```

5. **"Publish"** butonuna tıkla
6. Birkaç saniye bekle (rules aktif olması için)

## 🔑 Önemli Değişiklikler

### Blog Posts Create Rule

**Önceki (Hatalı):**
```javascript
allow create: if isAuthenticated() && 
                 request.resource.data.keys().hasAll(['title', 'slug', 'content', 'author']);
```

**Yeni (Düzeltilmiş):**
```javascript
allow create: if isAuthenticated() && 
                 request.resource.data.keys().hasAll(['title', 'slug', 'content', 'author']) &&
                 request.resource.data.author.id == request.auth.uid;
```

**Değişiklikler:**
1. ✅ `author.id == request.auth.uid` kontrolü eklendi - Kullanıcı sadece kendi adına post oluşturabilir
2. ✅ Gerekli alanlar kontrol ediliyor: `title`, `slug`, `content`, `author`
3. ✅ Authenticated olma kontrolü var

## ✅ Test

### 1. Postman'de Test Et

1. Firebase Auth ile login yap ve `idToken` al
2. Environment'ta `firebaseIdToken` değerini güncelle
3. **"Blog Posts (Firestore)" > "Create Blog Post"** request'ini aç
4. Body'deki değerleri kontrol et:
   - `author.id` değeri `{{userId}}` olmalı (environment variable)
   - `title`, `slug`, `content` dolu olmalı
5. **Send** butonuna tıkla
6. Artık "Missing or insufficient permissions" hatası olmamalı ✅

### 2. Uygulamada Test Et

1. Uygulamaya login yap
2. Admin panel'e git (`/admin`)
3. Blog Management sayfasına git
4. Yeni blog post oluştur
5. Başarılı olmalı ✅

## 🔍 Troubleshooting

### Hala "403 Forbidden" Hatası Alıyorsan

1. **Token Kontrolü:**
   - `firebaseIdToken` değerinin güncel olduğundan emin ol
   - Token'ın expire olmadığını kontrol et (genellikle 1 saat geçerlidir)
   - Yeni bir login yap ve token'ı güncelle

2. **Author ID Kontrolü:**
   - `author.id` değerinin `request.auth.uid` ile eşleştiğinden emin ol
   - Postman'de `{{userId}}` environment variable'ını kullan
   - Uygulamada `useAuthStore.getState().user.id` kullan

3. **Gerekli Alanlar:**
   - `title`, `slug`, `content`, `author` alanlarının dolu olduğundan emin ol
   - `author` object'inin `id` ve `name` field'larına sahip olduğundan emin ol

4. **Security Rules Kontrolü:**
   - Firebase Console'da Rules sekmesine git
   - Kuralların yayınlandığından emin ol
   - Syntax hatası olmadığını kontrol et

### "User document not found" Hatası

Eğer `isAdmin()` fonksiyonu hata veriyorsa:
- Önce user document'ini oluştur (signup sırasında otomatik oluşmalı)
- Firebase Console > Firestore > `users` collection'ında user document'inin var olduğunu kontrol et

## 📝 Notlar

1. **Author ID Zorunluluğu:**
   - Blog post oluştururken `author.id` değeri authenticated user'ın `uid`'si ile eşleşmeli
   - Bu, kullanıcıların sadece kendi adına post oluşturmasını sağlar

2. **Admin Yetkileri:**
   - Admin'ler tüm post'ları update/delete edebilir
   - Normal kullanıcılar sadece kendi post'larını update edebilir

3. **Draft vs Published:**
   - `isPublished: false` olan post'lar sadece authenticated kullanıcılar tarafından okunabilir
   - `isPublished: true` olan post'lar herkes tarafından okunabilir

## 🎯 Sonraki Adımlar

1. ✅ Security rules'u Firebase Console'da güncelle
2. ✅ Postman'de blog post oluşturmayı test et
3. ✅ Uygulamada blog post oluşturmayı test et
4. ✅ Admin panel'de blog post yönetimini test et

