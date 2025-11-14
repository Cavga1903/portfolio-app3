# 🔒 Firebase Security Rules - Tüm İşlemler İçin Kapsamlı Kurallar

## 📋 Tüm Admin İşlemleri İçin Güvenli Rules

Bu dosya, blog yönetimi için **tüm işlemler** (create, read, update, delete, publish, unpublish, archive, bookmark, favorite) için kapsamlı Firebase security rules içerir.

## 🚀 Firebase Console'da Uygulama

1. **Firebase Console**'a git: https://console.firebase.google.com
2. Projeni seç: `myportfolio-1e13b`
3. Sol menüden **Firestore Database** > **Rules** sekmesine git
4. Mevcut kuralları sil ve aşağıdaki kuralları yapıştır
5. **"Publish"** butonuna tıkla

## 📝 Tam Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // ============================================
    // HELPER FUNCTIONS
    // ============================================
    
    // Check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Check if user is admin
    // IMPORTANT: exists() kontrolü eklendi - user document'in var olup olmadığını kontrol eder
    function isAdmin() {
      return isAuthenticated() && 
             exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Check if user is the author of the post
    function isAuthor(postData) {
      return isAuthenticated() && 
             postData.author != null &&
             postData.author.id == request.auth.uid;
    }
    
    // Check if post is published
    function isPublished(postData) {
      return postData.isPublished == true;
    }
    
    // ============================================
    // USERS COLLECTION
    // ============================================
    
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
    
    // ============================================
    // BLOG POSTS COLLECTION - COMPLETE RULES
    // ============================================
    
    match /blogPosts/{postId} {
      
      // ============================================
      // READ OPERATIONS
      // ============================================
      
      // Everyone can read published posts
      // Authenticated users can read all posts (including drafts)
      allow read: if isPublished(resource.data) || isAuthenticated();
      
      // ============================================
      // CREATE OPERATIONS
      // ============================================
      
      // Only authenticated users can create posts
      // Must include required fields: title, slug, content, author
      allow create: if isAuthenticated() && 
                       request.resource.data.keys().hasAll(['title', 'slug', 'content', 'author']) &&
                       // Author must match authenticated user
                       request.resource.data.author.id == request.auth.uid &&
                       // Ensure author object has required fields
                       request.resource.data.author.keys().hasAll(['id', 'name']);
      
      // ============================================
      // UPDATE OPERATIONS
      // ============================================
      
      // Admin can update ANY post (all fields)
      // This includes: publish, unpublish, archive, bookmark, favorite, and all other updates
      allow update: if isAdmin();
      
      // Authors can update their own posts (limited fields)
      // Non-admin authors can update: title, slug, content, excerpt, tags, category, image
      // But CANNOT change: isPublished, isArchived, isBookmarked, isFavorited, author, publishedAt
      allow update: if isAuthenticated() && 
                       isAuthor(resource.data) &&
                       // Author cannot be changed
                       request.resource.data.author.id == resource.data.author.id &&
                       // Published status cannot be changed by non-admins
                       request.resource.data.isPublished == resource.data.isPublished &&
                       // Archived status cannot be changed by non-admins
                       request.resource.data.isArchived == resource.data.isArchived &&
                       // Bookmarked status cannot be changed by non-admins
                       request.resource.data.isBookmarked == resource.data.isBookmarked &&
                       // Favorited status cannot be changed by non-admins
                       request.resource.data.isFavorited == resource.data.isFavorited &&
                       // PublishedAt cannot be changed by non-admins
                       (request.resource.data.publishedAt == resource.data.publishedAt || 
                        !request.resource.data.diff(resource.data).affectedKeys().hasAny(['publishedAt']));
      
      // ============================================
      // DELETE OPERATIONS
      // ============================================
      
      // Only admins can delete posts
      allow delete: if isAdmin();
      
      // Authors CANNOT delete their own posts (only admins can)
      // This is a security measure to prevent accidental deletions
    }
    
    // ============================================
    // PROJECT LIKES COLLECTION
    // ============================================
    
    match /projectLikes/{likeId} {
      allow read: if true;
      allow create, update: if isAuthenticated();
      allow delete: if isAuthenticated() && resource.data.userId == request.auth.uid;
    }
    
    // ============================================
    // PROJECT STATS COLLECTION
    // ============================================
    
    match /projectStats/{projectId} {
      allow read: if true;
      allow write: if isAuthenticated(); // Can be restricted to admin only if needed
    }
  }
}
```

## 🔑 Önemli Özellikler

### 1. **Admin Yetkileri**
- ✅ Admin **tüm postları** okuyabilir (published + draft)
- ✅ Admin **tüm postları** güncelleyebilir (tüm field'lar)
- ✅ Admin **tüm postları** silebilir
- ✅ Admin **publish/unpublish** yapabilir
- ✅ Admin **archive/bookmark/favorite** yapabilir

### 2. **Author Yetkileri**
- ✅ Author **kendi postlarını** okuyabilir
- ✅ Author **kendi postlarını** güncelleyebilir (sınırlı field'lar)
- ❌ Author **kendi postlarını** silemez (sadece admin)
- ❌ Author **publish/unpublish** yapamaz (sadece admin)
- ❌ Author **archive/bookmark/favorite** yapamaz (sadece admin)

### 3. **Public Yetkileri**
- ✅ Herkes **published postları** okuyabilir
- ❌ Herkes **draft postları** okuyamaz (sadece authenticated users)
- ❌ Herkes **post oluşturamaz** (sadece authenticated users)
- ❌ Herkes **post güncelleyemez** (sadece author/admin)
- ❌ Herkes **post silemez** (sadece admin)

## 📊 İşlem Matrisi

| İşlem | Admin | Author (Kendi Postu) | Author (Başkasının Postu) | Public |
|-------|-------|---------------------|--------------------------|--------|
| **Read Published** | ✅ | ✅ | ✅ | ✅ |
| **Read Draft** | ✅ | ✅ (kendi) | ❌ | ❌ |
| **Create** | ✅ | ✅ | ✅ | ❌ |
| **Update (Content)** | ✅ | ✅ (kendi) | ❌ | ❌ |
| **Update (Publish)** | ✅ | ❌ | ❌ | ❌ |
| **Update (Archive)** | ✅ | ❌ | ❌ | ❌ |
| **Update (Bookmark)** | ✅ | ❌ | ❌ | ❌ |
| **Update (Favorite)** | ✅ | ❌ | ❌ | ❌ |
| **Delete** | ✅ | ❌ | ❌ | ❌ |

## ✅ Test Senaryoları

### Test 1: Admin İşlemleri
1. Admin olarak giriş yap
2. Herhangi bir post seç
3. **Publish** → ✅ Çalışmalı
4. **Unpublish** → ✅ Çalışmalı
5. **Archive** → ✅ Çalışmalı
6. **Bookmark** → ✅ Çalışmalı
7. **Favorite** → ✅ Çalışmalı
8. **Delete** → ✅ Çalışmalı
9. **Update Content** → ✅ Çalışmalı

### Test 2: Author İşlemleri
1. Normal user (author) olarak giriş yap
2. Kendi postunu seç
3. **Update Content** → ✅ Çalışmalı
4. **Publish** → ❌ Çalışmamalı (izin hatası)
5. **Delete** → ❌ Çalışmamalı (izin hatası)
6. Başkasının postunu seç
7. **Update** → ❌ Çalışmamalı (izin hatası)

### Test 3: Public İşlemleri
1. Giriş yapmadan
2. Published postları oku → ✅ Çalışmalı
3. Draft postları oku → ❌ Çalışmamalı
4. Post oluştur → ❌ Çalışmamalı

## 🔍 Debug İçin

Eğer hala izin hatası alıyorsanız:

### 1. Kullanıcının Admin Olduğunu Kontrol Et

Firebase Console'da:
1. **Firestore Database** → **Data** → `users` collection
2. Kullanıcınızın document'ini bulun (UID ile)
3. `role` field'ının `"admin"` olduğundan emin olun

### 2. Kullanıcının Giriş Yaptığını Kontrol Et

Browser console'da:
```javascript
import { auth } from './src/lib/firebase/config';
auth.onAuthStateChanged((user) => {
  console.log('Current User:', user?.uid);
});
```

### 3. Rules'u Test Et

Firebase Console'da:
1. **Firestore Database** → **Rules** sekmesine git
2. **"Rules Playground"** butonuna tıkla
3. Test senaryolarını çalıştır

## ⚠️ Önemli Notlar

1. **Author Silme Yetkisi Yok**: Güvenlik için, yazarlar kendi postlarını silemez. Sadece admin silebilir.

2. **Author Publish Yetkisi Yok**: Post yayınlama/yayından kaldırma sadece admin yetkisinde.

3. **exists() Kontrolü**: `isAdmin()` fonksiyonunda `exists()` kontrolü var. Bu, yeni oluşturulan user'lar için hata önler.

4. **Field Validation**: Create işleminde required field'lar kontrol edilir (title, slug, content, author).

5. **Author Immutability**: Non-admin authors, author field'ını değiştiremez.

## 🚀 Sonraki Adımlar

1. **Kullanıcıyı Admin Yap:**
   - `tolga@cavgalabs.com` kullanıcısını admin yapmak için: `MAKE_USER_ADMIN.md` dosyasına bakın
   - Firebase Console → Firestore Database → Data → `users` collection
   - Kullanıcının document'inde `role` field'ını `"admin"` yapın

2. **Firebase Console'da rules'u yapıştır:**
   - Firestore Database → Rules sekmesine git
   - Yukarıdaki rules'u yapıştır
   - "Publish" butonuna tıkla

3. **Browser'ı yenile** (F5 veya Cmd+R)

4. **Tüm işlemleri test et:**
   - Publish, Unpublish, Archive, Bookmark, Favorite, Delete

5. **Hata alırsanız:**
   - Yukarıdaki debug adımlarını takip et
   - Kullanıcının admin olduğunu kontrol et

## 📚 İlgili Dosyalar

- `FIREBASE_SECURITY_RULES_QUICK_FIX.md` - Hızlı düzeltme için
- `FIREBASE_SECURITY_RULES_ADMIN_UPDATE.md` - Admin update/delete için
- `FIREBASE_SECURITY_RULES_FIXED.md` - Genel güvenlik kuralları

