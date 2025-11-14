# 🔥 Firebase Firestore Setup for Blog

## 📋 Adımlar

### 1. Firebase Console'da Proje Oluştur

1. [Firebase Console](https://console.firebase.google.com/)'a git
2. Yeni proje oluştur veya mevcut projeyi seç
3. Project Settings > General > Your apps > Web app ekle
4. Firebase config bilgilerini kopyala

### 2. Environment Variables

`env.example` dosyasını `.env` olarak kopyalayın ve değerleri doldurun:

```bash
cp env.example .env
```

`.env` dosyasına Firebase Console'dan aldığınız değerleri ekleyin:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

**Önemli:** `.env` dosyasını asla git'e commit etmeyin! (`.gitignore`'da zaten var)

### 3. Firestore Database Oluştur

1. Firebase Console > Firestore Database
2. "Create database" tıkla
3. Test mode'da başlat (development için)
4. Location seç (örn: europe-west1)

### 4. Firestore Security Rules

Firestore Database > Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Blog Posts - Public read, authenticated write
    match /blogPosts/{postId} {
      allow read: if true; // Herkes okuyabilir
      allow create, update, delete: if request.auth != null; // Sadece authenticated kullanıcılar yazabilir
    }
  }
}
```

### 5. Firestore Index Oluştur

Firestore Database > Indexes:

**Composite Index:**
- Collection: `blogPosts`
- Fields:
  - `isPublished` (Ascending)
  - `publishedAt` (Descending)

**Single Field Index:**
- Collection: `blogPosts`
- Field: `slug` (Ascending)

### 6. İlk Blog Post Ekle (Test)

Firebase Console > Firestore Database > Data > Add collection:

**Collection ID:** `blogPosts`

**Document:**
```json
{
  "title": "Getting Started with React",
  "slug": "getting-started-with-react",
  "content": "<p>Full blog post content here...</p>",
  "excerpt": "Learn the basics of React and start building modern web applications.",
  "author": {
    "id": "1",
    "name": "Tolga Çavga"
  },
  "publishedAt": "2024-01-15T00:00:00Z",
  "tags": ["React", "JavaScript", "Web Development"],
  "category": "Tutorial",
  "image": "/blog/react-intro.jpg",
  "views": 0,
  "likes": 0,
  "isPublished": true,
  "createdAt": "2024-01-15T00:00:00Z",
  "updatedAt": "2024-01-15T00:00:00Z"
}
```

### 7. Test Et

1. Uygulamayı çalıştır: `npm run dev`
2. `/blog` sayfasına git
3. Blog postlarının Firestore'dan geldiğini kontrol et

## 🔒 Production Security Rules

Production için daha güvenli rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /blogPosts/{postId} {
      // Herkes published postları okuyabilir
      allow read: if resource.data.isPublished == true || request.auth != null;
      
      // Sadece admin yazabilir
      allow create, update, delete: if request.auth != null 
        && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

## 📝 Notlar

- Firestore'da tarihler `Timestamp` olarak saklanır
- `slug` field'ı unique olmalı (index ile kontrol edilebilir)
- `isPublished` false olan postlar sadece admin tarafından görülebilir
- Image URL'leri Firebase Storage'dan veya external URL'lerden gelebilir

