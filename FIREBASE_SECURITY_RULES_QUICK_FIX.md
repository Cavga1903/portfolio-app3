# 🔒 Firebase Security Rules - Hızlı Düzeltme

## ❌ Sorun: Silme İşlemi Çalışmıyor

"Missing or insufficient permissions" hatası alıyorsanız, Firebase security rules'u güncellemeniz gerekiyor.

## ⚡ Hızlı Çözüm (5 Dakika)

### 1. Firebase Console'a Git

1. [Firebase Console](https://console.firebase.google.com) → Giriş yap
2. Projenizi seçin: `myportfolio-1e13b`
3. Sol menüden **Firestore Database** → **Rules** sekmesine tıklayın

### 2. Mevcut Kuralları Kopyala

Mevcut kurallarınızı bir yere kopyalayın (yedek için).

### 3. Aşağıdaki Kuralları Yapıştır

Aşağıdaki kuralları **tamamen** kopyalayıp Firebase Console'daki Rules editörüne yapıştırın:

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
    
    // Blog Posts collection - ADMIN UPDATE/DELETE FIXED
    match /blogPosts/{postId} {
      // Everyone can read published posts
      // Authenticated users can read all posts (including drafts)
      allow read: if resource.data.isPublished == true || isAuthenticated();
      
      // Only authenticated users can create posts
      allow create: if isAuthenticated() && 
                       request.resource.data.keys().hasAll(['title', 'slug', 'content', 'author']);
      
      // CRITICAL: Admin can update/delete ANY post
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

### 4. Publish Et

1. **"Publish"** butonuna tıklayın
2. Onay mesajını bekleyin
3. Birkaç saniye bekleyin (rules aktif olması için)

### 5. Test Et

1. Browser'ı yenileyin (F5 veya Cmd+R)
2. Admin panelinde bir post seçin
3. Silme işlemini tekrar deneyin

## ✅ Kullanıcının Admin Olduğunu Kontrol Et

Firebase Console'da:

1. **Firestore Database** → **Data** sekmesine gidin
2. `users` collection'ını açın
3. Kullanıcınızın document'ini bulun (UID ile)
4. `role` field'ının `"admin"` olduğundan emin olun

Eğer `role` field'ı yoksa veya `"user"` ise:

1. Document'i düzenleyin
2. `role` field'ını ekleyin/değiştirin
3. Değerini `"admin"` yapın
4. Kaydedin

## 🔍 Debug İçin

Browser console'da şunu çalıştırın:

```javascript
// Firebase auth durumunu kontrol et
import { auth } from './src/lib/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './src/lib/firebase/config';

auth.onAuthStateChanged(async (user) => {
  if (user) {
    console.log('Current User UID:', user.uid);
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (userDoc.exists()) {
      console.log('User Data:', userDoc.data());
      console.log('User Role:', userDoc.data().role);
      console.log('Is Admin?', userDoc.data().role === 'admin');
    } else {
      console.error('User document not found in Firestore!');
    }
  } else {
    console.log('No user logged in');
  }
});
```

## ⚠️ Hala Çalışmıyorsa

1. **Browser cache'i temizleyin** (Cmd+Shift+R veya Ctrl+Shift+R)
2. **Firebase Console'da rules'u tekrar kontrol edin** (Publish edildiğinden emin olun)
3. **Kullanıcının gerçekten giriş yaptığını kontrol edin**
4. **Kullanıcının `users` collection'ında olduğunu kontrol edin**
5. **Kullanıcının `role` field'ının `'admin'` olduğunu kontrol edin**

## 📚 Detaylı Bilgi

Daha fazla bilgi için: `FIREBASE_SECURITY_RULES_ADMIN_UPDATE.md`

