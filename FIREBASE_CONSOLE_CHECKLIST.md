# 🔍 Firebase Console Kontrol Listesi

## 📋 Firestore Indexes Kontrolü

Firebase Console > Firestore Database > **Indexes** sekmesine git ve şu index'lerin olup olmadığını kontrol et:

### ✅ Gerekli Index'ler

#### 1. Composite Index (blogPosts - isPublished + publishedAt)
```
Collection: blogPosts
Fields:
  - isPublished (Ascending)
  - publishedAt (Descending)
Query scope: Collection
Status: Enabled ✅
```

**Kontrol:**
- Index listesinde `blogPosts` collection'ını bul
- `isPublished` (Ascending) + `publishedAt` (Descending) composite index var mı?
- Status: **Enabled** olmalı

**Eğer yoksa:**
- **Create Index** butonuna tıkla
- Collection: `blogPosts`
- Fields ekle:
  1. Field: `isPublished`, Order: `Ascending`
  2. Field: `publishedAt`, Order: `Descending`
- **Create** butonuna tıkla
- Index oluşturulması birkaç dakika sürebilir

#### 2. Single Field Index (blogPosts - slug)
```
Collection: blogPosts
Field: slug (Ascending)
Query scope: Collection
Status: Enabled ✅
```

**Kontrol:**
- Index listesinde `blogPosts` collection'ını bul
- `slug` (Ascending) single field index var mı?
- Status: **Enabled** olmalı

**Eğer yoksa:**
- **Create Index** butonuna tıkla
- Collection: `blogPosts`
- Field: `slug`, Order: `Ascending`
- **Create** butonuna tıkla

## 🔒 Security Rules Kontrolü

Firebase Console > Firestore Database > **Rules** sekmesine git ve şu kuralların olup olmadığını kontrol et:

### Mevcut Rules'u Kontrol Et

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
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Users collection
    match /users/{userId} {
      // Users can read their own data, admins can read all
      allow read: if isAuthenticated() && (request.auth.uid == userId || isAdmin());
      // Only admins can create/update users
      allow create, update: if isAdmin();
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

**Kontrol:**
- Rules sekmesinde yukarıdaki kurallar var mı?
- `users` collection için rules var mı?
- `blogPosts` collection için rules var mı?
- `projectLikes` ve `projectStats` için rules var mı?

**Eğer eksikse:**
- Rules'u yukarıdaki gibi güncelle
- **Publish** butonuna tıkla

## 📊 Kullanılan Query'ler

### 1. Blog Posts List (getPosts)
```javascript
// Collection: blogPosts
// Query:
where('isPublished', '==', true)
orderBy('publishedAt', 'desc')

// Gerektirdiği Index:
// Composite Index: isPublished (Ascending) + publishedAt (Descending)
```

### 2. Blog Post by Slug (getPost)
```javascript
// Collection: blogPosts
// Query:
where('slug', '==', slug)

// Gerektirdiği Index:
// Single Field Index: slug (Ascending)
```

### 3. Users Collection
```javascript
// Collection: users
// Query: getDoc(doc(db, 'users', userId))
// Index gerekmez (document ID ile direkt erişim)
```

## ✅ Kontrol Adımları

1. **Firestore Database > Indexes**
   - [ ] `blogPosts` - `isPublished` (Asc) + `publishedAt` (Desc) composite index var mı?
   - [ ] `blogPosts` - `slug` (Asc) single field index var mı?
   - [ ] Her iki index'in status'u **Enabled** mi?

2. **Firestore Database > Rules**
   - [ ] `users` collection için rules var mı?
   - [ ] `blogPosts` collection için rules var mı?
   - [ ] `projectLikes` collection için rules var mı?
   - [ ] `projectStats` collection için rules var mı?
   - [ ] Rules **Published** durumunda mı?

3. **Authentication > Sign-in method**
   - [ ] Google provider **Enabled** mi?
   - [ ] Support email seçilmiş mi?
   - [ ] **Save** butonuna basıldı mı?

4. **Authentication > Settings > Authorized domains**
   - [ ] `localhost` ekli mi?
   - [ ] `myportfolio-1e13b.firebaseapp.com` ekli mi?
   - [ ] `myportfolio-1e13b.web.app` ekli mi?
   - [ ] Production domain'ler ekli mi? (`tolgacavga.com`, `cavga.dev`)

## 🧪 Test Query'leri

Firebase Console > Firestore Database > **Data** sekmesinde test edebilirsin:

### Test 1: Blog Posts Query
1. **Data** sekmesine git
2. `blogPosts` collection'ını seç
3. Bir document aç
4. Şu field'ların olduğundan emin ol:
   - `isPublished` (boolean)
   - `publishedAt` (timestamp)
   - `slug` (string)
   - `title` (string)
   - `content` (string)
   - `excerpt` (string)
   - `author` (object: `{id: string, name: string}`)

### Test 2: Users Collection
1. **Data** sekmesine git
2. `users` collection'ını kontrol et
3. Google ile giriş yaptıktan sonra bir user document oluşmalı
4. Şu field'lar olmalı:
   - `name` (string)
   - `email` (string)
   - `role` (string: 'user' veya 'admin')
   - `avatar` (string, optional)
   - `createdAt` (timestamp)
   - `updatedAt` (timestamp)

## ⚠️ Hata Durumları

### Index Hatası
Eğer şu hatayı alırsan:
```
The query requires an index. You can create it here: [link]
```

**Çözüm:**
- Hata mesajındaki linke tıkla
- Index'i oluştur
- Birkaç dakika bekle (index oluşturulması için)

### Permission Denied Hatası
Eğer şu hatayı alırsan:
```
Missing or insufficient permissions
```

**Çözüm:**
- Firestore Database > Rules sekmesine git
- Rules'u kontrol et
- Gerekli rules'u ekle
- **Publish** butonuna tıkla

## 📝 Notlar

- Index'lerin oluşturulması birkaç dakika sürebilir
- Rules değişiklikleri anında aktif olur
- Test için development'ta "Test mode" kullanabilirsin (production'da security rules kullan)

