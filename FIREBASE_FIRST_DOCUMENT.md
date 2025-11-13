# 📝 Firebase Firestore - İlk Blog Post Dokümanı

## ⚠️ Önemli: Field Tipleri

Görüntüdeki field tipleri **yanlış**! Doğru tipler:

### ❌ Yanlış:
- `isPublished` → **string** (YANLIŞ!)
- `publishedAt` → **string** (YANLIŞ!)

### ✅ Doğru:
- `isPublished` → **boolean** (true/false)
- `publishedAt` → **timestamp** (Firestore Timestamp)

---

## 📋 İlk Blog Post için Doğru Field Yapısı

Firebase Console'da `blogPosts` collection'ına ilk document eklerken şu field'ları kullan:

### Gerekli Field'lar:

1. **title** (string)
   - Type: `string`
   - Value: `"Getting Started with React"`

2. **slug** (string)
   - Type: `string`
   - Value: `"getting-started-with-react"`
   - ⚠️ Önemli: Unique olmalı, URL-friendly

3. **content** (string)
   - Type: `string`
   - Value: `"<p>Full blog post content here...</p>"`

4. **excerpt** (string)
   - Type: `string`
   - Value: `"Learn the basics of React and start building modern web applications."`

5. **author** (map/object)
   - Type: `map`
   - Fields:
     - `id` (string): `"1"`
     - `name` (string): `"Tolga Çavga"`
     - `avatar` (string, optional): `"/avatars/tolga.jpg"`

6. **publishedAt** (timestamp)
   - Type: `timestamp`
   - Value: Şu anki tarih (Firebase otomatik ekler)

7. **isPublished** (boolean)
   - Type: `boolean`
   - Value: `true`

8. **tags** (array)
   - Type: `array`
   - Value: `["React", "JavaScript", "Web Development"]`

### Opsiyonel Field'lar:

9. **category** (string)
   - Type: `string`
   - Value: `"Tutorial"`

10. **image** (string)
    - Type: `string`
    - Value: `"/blog/react-intro.jpg"`

11. **views** (number)
    - Type: `number`
    - Value: `0`

12. **likes** (number)
    - Type: `number`
    - Value: `0`

13. **updatedAt** (timestamp)
    - Type: `timestamp`
    - Value: Şu anki tarih

14. **createdAt** (timestamp)
    - Type: `timestamp`
    - Value: Şu anki tarih

---

## 🎯 Hızlı Başlangıç - Örnek Document

Firebase Console'da şu şekilde ekle:

**Collection ID:** `blogPosts`

**Document ID:** Auto-generate (otomatik oluştur)

**Fields:**

```
title: string → "Getting Started with React"
slug: string → "getting-started-with-react"
content: string → "<p>This is my first blog post about React...</p>"
excerpt: string → "Learn the basics of React and start building modern web applications."
isPublished: boolean → true
publishedAt: timestamp → [Şu anki tarih seç]
tags: array → ["React", "JavaScript", "Web Development"]
author: map → {
  id: string → "1"
  name: string → "Tolga Çavga"
}
views: number → 0
likes: number → 0
createdAt: timestamp → [Şu anki tarih seç]
updatedAt: timestamp → [Şu anki tarih seç]
```

---

## ⚠️ Yaygın Hatalar

1. ❌ `isPublished` → string yerine **boolean** kullan
2. ❌ `publishedAt` → string yerine **timestamp** kullan
3. ❌ `tags` → string yerine **array** kullan
4. ❌ `author` → string yerine **map** kullan
5. ❌ `views`, `likes` → string yerine **number** kullan

---

## ✅ Doğru Yapı Kontrol Listesi

- [ ] `isPublished` → **boolean** (true/false)
- [ ] `publishedAt` → **timestamp**
- [ ] `tags` → **array** (string array)
- [ ] `author` → **map** (object)
- [ ] `views` → **number**
- [ ] `likes` → **number**
- [ ] `title`, `slug`, `content`, `excerpt` → **string**

