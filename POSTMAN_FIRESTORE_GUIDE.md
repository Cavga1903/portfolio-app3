# 🔥 Postman ile Firestore Test Rehberi

## ⚠️ Önemli Not

Bu uygulama **backend API'si olmayan** bir frontend uygulamasıdır. Blog post'lar **Firebase Firestore**'dan direkt geliyor. Postman'de test etmek için **Firestore REST API**'sini kullanmalısın.

## 🚀 Hızlı Başlangıç

### 1. Firebase Auth ile Login Yap

1. **"Firebase Auth - Sign In with Email"** request'ini aç
2. Body'yi doldur:
   ```json
   {
     "email": "test@example.com",
     "password": "test123456",
     "returnSecureToken": true
   }
   ```
3. **Send** butonuna tıkla
4. Response'dan `idToken` değerini kopyala
5. Environment'a git ve `firebaseIdToken` değerini güncelle
6. Response'dan `localId` değerini kopyala ve `userId` değerini güncelle

### 2. Blog Post'ları Getir

1. **"Blog Posts (Firestore)" > "Get All Blog Posts"** request'ini aç
2. **Send** butonuna tıkla
3. Response'da blog post'ları görmelisin

### 3. Blog Post Oluştur

1. **"Blog Posts (Firestore)" > "Create Blog Post"** request'ini aç
2. Body'deki değerleri doldur (zaten örnek değerler var)
3. `author.id` değerini `{{userId}}` ile değiştir (environment variable)
4. **Send** butonuna tıkla
5. Response'da yeni oluşturulan post'u görmelisin

## 📋 Firestore REST API Formatı

### Document Oluşturma (Create)

Firestore REST API, özel bir format kullanır:

```json
{
  "fields": {
    "title": {
      "stringValue": "Blog Post Title"
    },
    "slug": {
      "stringValue": "blog-post-slug"
    },
    "isPublished": {
      "booleanValue": true
    },
    "tags": {
      "arrayValue": {
        "values": [
          {"stringValue": "tag1"},
          {"stringValue": "tag2"}
        ]
      }
    },
    "author": {
      "mapValue": {
        "fields": {
          "id": {"stringValue": "user-id"},
          "name": {"stringValue": "User Name"}
        }
      }
    },
    "publishedAt": {
      "timestampValue": "2024-01-01T00:00:00Z"
    }
  }
}
```

### Query (Sorgu)

Firestore query'leri için `runQuery` endpoint'ini kullan:

```json
{
  "structuredQuery": {
    "from": [{
      "collectionId": "blogPosts"
    }],
    "where": {
      "fieldFilter": {
        "field": {
          "fieldPath": "isPublished"
        },
        "op": "EQUAL",
        "value": {
          "booleanValue": true
        }
      }
    },
    "orderBy": [{
      "field": {
        "fieldPath": "publishedAt"
      },
      "direction": "DESCENDING"
    }]
  }
}
```

## 🔐 Authentication

Tüm Firestore request'leri için `Authorization` header'ında Firebase ID Token gerekir:

```
Authorization: Bearer {{firebaseIdToken}}
```

Token'ı almak için:
1. Firebase Auth ile login yap
2. Response'dan `idToken` değerini al
3. Environment'ta `firebaseIdToken` değerini güncelle

## 📝 Firestore Data Types

Firestore REST API'de farklı data type'lar için farklı formatlar kullanılır:

- **String**: `{"stringValue": "value"}`
- **Number**: `{"integerValue": "123"}` veya `{"doubleValue": "123.45"}`
- **Boolean**: `{"booleanValue": true}`
- **Timestamp**: `{"timestampValue": "2024-01-01T00:00:00Z"}`
- **Array**: `{"arrayValue": {"values": [{"stringValue": "item1"}]}}`
- **Map/Object**: `{"mapValue": {"fields": {"key": {"stringValue": "value"}}}}`
- **Null**: `{"nullValue": null}`

## 🎯 Örnek Senaryolar

### Senaryo 1: Yeni Blog Post Oluştur

1. Firebase Auth ile login yap ve `idToken` al
2. **"Create Blog Post"** request'ini aç
3. Body'deki değerleri doldur:
   - `title`: Blog post başlığı
   - `slug`: URL-friendly slug
   - `content`: Blog post içeriği
   - `excerpt`: Kısa özet
   - `category`: Kategori
   - `tags`: Tag'ler (array)
   - `isPublished`: `false` (draft) veya `true` (published)
   - `author.id`: `{{userId}}` (environment variable)
   - `author.name`: Yazar adı
4. **Send** butonuna tıkla
5. Response'da yeni post'un ID'sini ve tüm alanlarını görmelisin

### Senaryo 2: Blog Post'ları Listele

1. Firebase Auth ile login yap
2. **"Get All Blog Posts"** request'ini aç
3. **Send** butonuna tıkla
4. Response'da yayınlanmış tüm blog post'ları görmelisin

### Senaryo 3: Blog Post Güncelle

1. Firebase Auth ile login yap
2. Güncellemek istediğin post'un ID'sini al (Firestore Console'dan veya "Get All Blog Posts" response'undan)
3. **"Update Blog Post"** request'ini aç
4. URL'deki `:postId` değerini güncelle
5. Body'de sadece güncellemek istediğin alanları gönder
6. **Send** butonuna tıkla

### Senaryo 4: Blog Post Sil

1. Firebase Auth ile login yap (admin olmalısın)
2. Silmek istediğin post'un ID'sini al
3. **"Delete Blog Post"** request'ini aç
4. URL'deki `:postId` değerini güncelle
5. **Send** butonuna tıkla

## ⚠️ Troubleshooting

### "401 Unauthorized" Hatası

- `firebaseIdToken` değerinin güncel olduğundan emin ol
- Token'ın expire olmadığını kontrol et (genellikle 1 saat geçerlidir)
- Yeni bir login yap ve token'ı güncelle

### "403 Forbidden" veya "Missing or insufficient permissions" Hatası

- Firebase Security Rules'u kontrol et
- `FIREBASE_SECURITY_RULES_FIXED.md` dosyasındaki kuralları uyguladığından emin ol
- User document'inin doğru şekilde oluşturulduğunu kontrol et
- Admin işlemleri için admin role'üne sahip olman gerekir

### "400 Bad Request" Hatası

- Request body'nin doğru Firestore formatında olduğundan emin ol
- Gerekli alanların doldurulduğunu kontrol et
- Data type'ların doğru olduğundan emin ol (stringValue, booleanValue, etc.)

### "404 Not Found" Hatası

- Collection adının doğru olduğundan emin ol (`blogPosts`)
- Document ID'nin doğru olduğundan emin ol
- Firestore Console'da document'in var olduğunu kontrol et

## 🔗 Faydalı Linkler

- [Firestore REST API Documentation](https://firebase.google.com/docs/firestore/reference/rest)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Auth REST API](https://firebase.google.com/docs/reference/rest/auth)

## 💡 İpuçları

1. **Token Yenileme**: Firebase ID Token'lar genellikle 1 saat geçerlidir. Token expire olduğunda yeni bir login yapman gerekir.

2. **Environment Variables**: Postman'de environment variables kullanarak token'ı ve diğer değerleri kolayca yönetebilirsin.

3. **Pre-request Scripts**: Postman'de pre-request script'ler ekleyerek token'ı otomatik yenileyebilirsin.

4. **Tests**: Response'ları otomatik test etmek için "Tests" sekmesine script'ler ekleyebilirsin.

5. **Collection Runner**: Birden fazla request'i sırayla çalıştırmak için Collection Runner kullanabilirsin.

