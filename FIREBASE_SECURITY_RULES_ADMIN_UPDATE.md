# 🔒 Firebase Security Rules - Admin Update/Delete Fix

## ❌ Hata: Missing or insufficient permissions

Bu hata, Firestore security rules'ların admin kullanıcıların blog postları güncelleyip silebilmesini engellediği anlamına gelir.

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
    // IMPORTANT: exists() kontrolü eklendi - user document'in var olup olmadığını kontrol eder
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
    
    // Blog Posts collection - FIXED FOR ADMIN UPDATE/DELETE
    match /blogPosts/{postId} {
      // Everyone can read published posts
      // Authenticated users can read all posts (including drafts)
      allow read: if resource.data.isPublished == true || isAuthenticated();
      
      // Only authenticated users can create posts
      allow create: if isAuthenticated() && 
                       request.resource.data.keys().hasAll(['title', 'slug', 'content', 'author']);
      
      // FIXED: Only admins can update/delete posts
      // This rule must come first to ensure admin access
      allow update, delete: if isAdmin();
      
      // Authors can update their own posts (if not admin)
      // This is a fallback for non-admin authors
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
      allow write: if isAuthenticated(); // Can be restricted to admin only
    }
  }
}
```

## 🔑 Önemli Değişiklikler

1. **isAdmin Function:**
   - `exists()` kontrolü eklendi - User document'in var olup olmadığını kontrol eder
   - Bu, yeni oluşturulan user'lar için hata önler
   - Admin kontrolü daha güvenli hale getirildi

2. **Blog Posts Update/Delete:**
   - `allow update, delete: if isAdmin();` kuralı öncelikli olarak eklendi
   - Admin kullanıcılar tüm postları güncelleyip silebilir
   - Author kuralı fallback olarak kalıyor (non-admin authors için)

## 🚀 Firebase Console'da Uygulama

1. Firebase Console > Firestore Database > Rules sekmesine git
2. Mevcut kuralları sil
3. Yukarıdaki kuralları yapıştır
4. "Publish" butonuna tıkla
5. Birkaç saniye bekle (rules aktif olması için)

## ✅ Test

1. Admin olarak giriş yap
2. Blog post seç
3. Yayınla/Yayından Kaldır/Arşivle/Favori/Yer İşareti/Sil işlemlerini test et
4. "Missing or insufficient permissions" hatası olmamalı

## ⚠️ Not

Eğer hala izin hatası alıyorsanız:
1. Firebase Console'da kullanıcının `users` collection'ında olduğunu kontrol et
2. Kullanıcının `role` field'ının `'admin'` olduğunu kontrol et
3. Firebase Authentication'da kullanıcının giriş yaptığını kontrol et
4. Browser'ı yenile ve tekrar dene

