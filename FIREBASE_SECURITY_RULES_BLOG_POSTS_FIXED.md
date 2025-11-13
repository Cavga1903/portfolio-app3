# 🔒 Firebase Security Rules - Blog Posts FIXED (Final)

## ❌ Hata: Missing or insufficient permissions (Hala devam ediyor)

Bu hata, Firestore security rules'ların blog post oluşturmayı engellediği anlamına gelir. Firestore REST API formatı farklı olduğu için rules'u güncellememiz gerekiyor.

## 🚀 Çözüm: Daha Esnek Security Rules

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
    
    // Helper function: Check if author ID matches authenticated user
    function isAuthor() {
      return isAuthenticated() && 
             request.resource.data.author != null &&
             (
               // Direct format (SDK)
               (request.resource.data.author.id == request.auth.uid) ||
               // Nested format (REST API - mapValue)
               (request.resource.data.author.mapValue != null && 
                request.resource.data.author.mapValue.fields != null &&
                request.resource.data.author.mapValue.fields.id != null &&
                request.resource.data.author.mapValue.fields.id.stringValue == request.auth.uid)
             );
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
    
    // Blog Posts collection - FIXED FOR CREATE (More Flexible)
    match /blogPosts/{postId} {
      // Everyone can read published posts
      // Authenticated users can read all posts (including drafts)
      allow read: if resource.data.isPublished == true || isAuthenticated();
      
      // FIXED: Allow authenticated users to create posts
      // More flexible: Check both SDK and REST API formats
      allow create: if isAuthenticated() && 
                       request.resource.data.keys().hasAll(['title', 'slug', 'content', 'author']) &&
                       isAuthor();
      
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

## 🔑 Önemli Değişiklikler

### 1. `isAuthor()` Helper Function Eklendi

Bu fonksiyon hem SDK formatını hem de REST API formatını destekler:

**SDK Format (Client SDK):**
```javascript
author: {
  id: "user-id",
  name: "User Name"
}
```

**REST API Format:**
```javascript
author: {
  mapValue: {
    fields: {
      id: { stringValue: "user-id" },
      name: { stringValue: "User Name" }
    }
  }
}
```

### 2. Daha Esnek Create Rule

**Önceki (Sadece SDK format):**
```javascript
allow create: if isAuthenticated() && 
                 request.resource.data.keys().hasAll(['title', 'slug', 'content', 'author']) &&
                 request.resource.data.author.id == request.auth.uid;
```

**Yeni (Hem SDK hem REST API format):**
```javascript
allow create: if isAuthenticated() && 
                 request.resource.data.keys().hasAll(['title', 'slug', 'content', 'author']) &&
                 isAuthor();
```

## ✅ Test

### 1. Postman'de Test Et

1. Firebase Auth ile login yap ve `idToken` al
2. Environment'ta `firebaseIdToken` ve `userId` değerlerini güncelle
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

1. **Security Rules Kontrolü:**
   - Firebase Console'da Rules sekmesine git
   - Kuralların yayınlandığından emin ol
   - Syntax hatası olmadığını kontrol et (Rules sekmesinde hata gösterir)
   - "Simulator" sekmesinde test et

2. **Token Kontrolü:**
   - `firebaseIdToken` değerinin güncel olduğundan emin ol
   - Token'ın expire olmadığını kontrol et (genellikle 1 saat geçerlidir)
   - Yeni bir login yap ve token'ı güncelle

3. **Author Format Kontrolü:**
   - Postman'de: `author.mapValue.fields.id.stringValue` formatında olmalı
   - Uygulamada: `author.id` formatında olmalı
   - Her iki format da artık destekleniyor

4. **Gerekli Alanlar:**
   - `title`, `slug`, `content`, `author` alanlarının dolu olduğundan emin ol
   - `author` object'inin doğru formatta olduğundan emin ol

### Firestore Rules Simulator Kullan

1. Firebase Console > Firestore Database > Rules
2. "Rules Simulator" sekmesine git
3. Test senaryosu oluştur:
   - **Location**: `blogPosts/test-post`
   - **Operation**: `create`
   - **Authentication**: `Authenticated` (user ID'yi gir)
   - **Data**: Test data'yı gir
4. "Run" butonuna tıkla
5. Sonucu kontrol et

## 📝 Notlar

1. **Format Farklılıkları:**
   - Firebase SDK (client-side): `author.id` direkt erişilebilir
   - Firestore REST API: `author.mapValue.fields.id.stringValue` formatında
   - Yeni rules her iki formatı da destekliyor

2. **Author ID Zorunluluğu:**
   - Blog post oluştururken `author.id` değeri authenticated user'ın `uid`'si ile eşleşmeli
   - Bu, kullanıcıların sadece kendi adına post oluşturmasını sağlar

3. **Admin Yetkileri:**
   - Admin'ler tüm post'ları update/delete edebilir
   - Normal kullanıcılar sadece kendi post'larını update edebilir

## 🎯 Sonraki Adımlar

1. ✅ Security rules'u Firebase Console'da güncelle (yukarıdaki kuralları kullan)
2. ✅ Rules Simulator'de test et
3. ✅ Postman'de blog post oluşturmayı test et
4. ✅ Uygulamada blog post oluşturmayı test et

## 🚨 Eğer Hala Çalışmıyorsa

Geçici olarak daha açık bir rule kullanabilirsin (sadece test için):

```javascript
// Blog Posts collection - TEMPORARY (Less Secure)
match /blogPosts/{postId} {
  allow read: if true; // Herkes okuyabilir
  allow create: if isAuthenticated(); // Authenticated kullanıcılar oluşturabilir
  allow update, delete: if isAdmin(); // Sadece admin'ler güncelleyebilir/silebilir
}
```

**⚠️ UYARI:** Bu rule production için çok açık! Sadece test için kullan. Production'da yukarıdaki daha güvenli kuralları kullan.

