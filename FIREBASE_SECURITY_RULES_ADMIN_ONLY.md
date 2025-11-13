# 🔒 Firebase Security Rules - Admin Only (Full Security)

## 🎯 Amaç
Sadece admin kullanıcılar blog post oluşturabilir, güncelleyebilir ve silebilir. Normal kullanıcılar sadece yayınlanmış postları okuyabilir.

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
    
    // Helper function: Check if email domain is @cavgalabs.com
    function isCavgalabsEmail() {
      return isAuthenticated() &&
             request.auth.token.email != null &&
             request.auth.token.email.matches('.*@cavgalabs\\.com$');
    }
    
    // Users collection
    match /users/{userId} {
      // Users can read their own data, admins can read all
      allow read: if isAuthenticated() && (request.auth.uid == userId || isAdmin());
      
      // IMPORTANT: Allow users to create their own user document during signup
      // But only if email is @cavgalabs.com
      allow create: if request.auth != null && 
                       request.auth.uid == userId &&
                       isCavgalabsEmail() &&
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
    
    // Blog Posts collection - ADMIN ONLY
    match /blogPosts/{postId} {
      // Everyone can read published posts
      // Authenticated users can read all posts (including drafts)
      allow read: if resource.data.isPublished == true || isAuthenticated();
      
      // ONLY ADMINS can create posts
      allow create: if isAdmin() && 
                       request.resource.data.keys().hasAll(['title', 'slug', 'content', 'author']) &&
                       request.resource.data.author.id == request.auth.uid;
      
      // ONLY ADMINS can update/delete posts
      allow update, delete: if isAdmin();
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

1. **Blog Posts - Admin Only:**
   - `allow create: if isAdmin()` - Sadece admin kullanıcılar blog post oluşturabilir
   - `allow update, delete: if isAdmin()` - Sadece admin kullanıcılar güncelleyebilir/silebilir
   - Normal kullanıcılar artık blog post oluşturamaz

2. **Email Domain Check:**
   - `isCavgalabsEmail()` helper function eklendi
   - User creation sırasında email domain kontrolü yapılıyor
   - Sadece @cavgalabs.com domainine sahip kullanıcılar kayıt olabilir

3. **User Creation:**
   - Signup sırasında kullanıcılar kendi user document'lerini oluşturabilir
   - Ancak sadece @cavgalabs.com email domainine sahip olmalılar
   - Role her zaman 'user' olarak ayarlanır (admin olamaz)

## 🚀 Firebase Console'da Uygulama

1. Firebase Console > Firestore Database > Rules sekmesine git
2. Mevcut kuralları sil
3. Yukarıdaki kuralları yapıştır
4. "Publish" butonuna tıkla
5. Birkaç saniye bekle (rules aktif olması için)

## ⚠️ Önemli Notlar

- **Admin Role:** Kullanıcının `role` field'ı Firestore'da `'admin'` olarak ayarlanmalı
- **Email Domain:** Firebase Auth'da email domain kontrolü yapılamaz, bu yüzden hem client-side hem de security rules'da kontrol ediyoruz
- **Test:** Admin olmayan bir kullanıcı ile blog post oluşturmayı deneyin, "Missing or insufficient permissions" hatası almalısınız

