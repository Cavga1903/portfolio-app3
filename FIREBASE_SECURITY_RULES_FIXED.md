# 🔒 Firebase Security Rules - Fixed for Signup

## 📋 Firestore Security Rules

Firebase Console > Firestore Database > Rules sekmesine git ve şu kuralları ekle:

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
    
    // Blog Posts collection
    match /blogPosts/{postId} {
      // Everyone can read published posts
      // Authenticated users can read all posts (including drafts)
      allow read: if resource.data.isPublished == true || isAuthenticated();
      
      // Only authenticated users can create posts
      allow create: if isAuthenticated() && 
                       request.resource.data.keys().hasAll(['title', 'slug', 'content', 'author']);
      
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
      allow write: if isAuthenticated(); // Can be restricted to admin only
    }
  }
}
```

## 🔑 Önemli Değişiklikler

1. **User Creation During Signup:**
   - `allow create: if request.auth != null && request.auth.uid == userId` - Kullanıcılar kendi user document'lerini oluşturabilir
   - `request.resource.data.role == 'user'` - Sadece 'user' role ile oluşturabilir (admin olamaz)
   - `request.resource.data.keys().hasAll(['name', 'email', 'role', 'createdAt'])` - Gerekli alanlar kontrol edilir

2. **isAdmin Function:**
   - `exists()` kontrolü eklendi - User document'in var olup olmadığını kontrol eder
   - Bu, yeni oluşturulan user'lar için hata önler

## 🚀 Firebase Console'da Uygulama

1. Firebase Console > Firestore Database > Rules sekmesine git
2. Mevcut kuralları sil
3. Yukarıdaki kuralları yapıştır
4. "Publish" butonuna tıkla
5. Birkaç saniye bekle (rules aktif olması için)

## ✅ Test

1. Signup yap
2. Firestore Console'da `users` collection'ına git
3. Yeni user document'inin oluşturulduğunu kontrol et
4. "Missing or insufficient permissions" hatası olmamalı

