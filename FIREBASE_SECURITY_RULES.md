# 🔒 Firebase Security Rules - Production

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

## 🔐 Authentication Rules

Firebase Console > Authentication > Settings > Authorized domains:
- Production domain'ini ekle (örn: `tolgacavga.com`)
- Development için `localhost` zaten ekli

## 📝 Indexes

Firestore Database > Indexes sekmesinde şu index'leri oluştur:

### Composite Index 1:
- Collection: `blogPosts`
- Fields:
  - `isPublished` (Ascending)
  - `publishedAt` (Descending)
- Query scope: Collection

### Single Field Index:
- Collection: `blogPosts`
- Field: `slug` (Ascending)
- Query scope: Collection

## ⚠️ Önemli Notlar

1. **API Keys Güvenliği:**
   - API key'ler client-side'da görünür (normal)
   - Security rules ile koruma sağlanır
   - API key'i kısıtlamak için: Firebase Console > Project Settings > General > Web API Key > Restrict key

2. **Rate Limiting:**
   - Firestore'da otomatik rate limiting var
   - Aşırı isteklerde hata alırsan Firebase Console'dan quota'yı kontrol et

3. **Backup:**
   - Düzenli backup al (Firebase Console > Firestore > Backup)

4. **Monitoring:**
   - Firebase Console > Usage and billing'den kullanımı takip et
   - Alerts ayarla (quota aşımı için)

## 🚀 Production Checklist

- [ ] Security rules test edildi
- [ ] Indexes oluşturuldu
- [ ] Authorized domains eklendi
- [ ] API key restrictions ayarlandı (opsiyonel)
- [ ] Backup stratejisi belirlendi
- [ ] Monitoring alerts ayarlandı
- [ ] Environment variables production'da set edildi

