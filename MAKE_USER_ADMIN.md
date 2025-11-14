# 👤 Kullanıcıyı Admin Yapma

`tolga@cavgalabs.com` kullanıcısını admin yapmak için iki yöntem var:

## 🚀 Yöntem 1: Firebase Console (Önerilen - En Kolay)

### Adım 1: Kullanıcının UID'sini Bul

1. [Firebase Console](https://console.firebase.google.com) → Projenizi seçin
2. Sol menüden **Authentication** → **Users** sekmesine gidin
3. `tolga@cavgalabs.com` email'ini arayın
4. Kullanıcıyı bulun ve **UID**'sini kopyalayın (örnek: `abc123xyz456...`)

### Adım 2: Firestore'da User Document'ini Güncelle

1. Sol menüden **Firestore Database** → **Data** sekmesine gidin
2. `users` collection'ını açın
3. Kullanıcının UID'si ile document'i bulun (veya oluşturun)

**Eğer document yoksa:**
- **"Add document"** butonuna tıklayın
- Document ID olarak kullanıcının **UID**'sini yapıştırın
- Aşağıdaki field'ları ekleyin:

```json
{
  "name": "Tolga Çavga",
  "email": "tolga@cavgalabs.com",
  "role": "admin",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

**Eğer document varsa:**
- Document'i açın
- `role` field'ını bulun (veya ekleyin)
- Değerini `"admin"` olarak değiştirin
- **"Update"** butonuna tıklayın

### Adım 3: Kontrol Et

1. Document'te `role` field'ının `"admin"` olduğundan emin olun
2. Browser'ı yenileyin (F5 veya Cmd+R)
3. Admin panelinde işlemleri test edin

## 🔧 Yöntem 2: Firebase CLI ile (Gelişmiş)

### Adım 1: Firebase CLI Kurulumu

```bash
npm install -g firebase-tools
```

### Adım 2: Firebase'e Login Ol

**⚠️ Safari HTTPS-Only Hatası İçin:**

Eğer Safari'de "Navigation failed because the request was for an HTTP URL with HTTPS-Only enabled" hatası alıyorsanız:

**Çözüm 1: Chrome veya Firefox Kullan (Önerilen)**
- Terminal'deki URL'yi kopyalayın
- Chrome veya Firefox'ta açın
- OAuth akışını tamamlayın

**Çözüm 2: Safari Ayarlarını Değiştir**
1. Safari → Settings → Privacy
2. "Prevent cross-site tracking" ve "HTTPS-Only" ayarlarını geçici olarak kapatın
3. Firebase login'i tamamlayın
4. Ayarları tekrar açın

**Çözüm 3: No-localhost Flag Kullan**
```bash
firebase login --no-localhost
```
Bu komut, manuel olarak bir token almanızı sağlar.

**Normal Login:**
```bash
firebase login
```

### Adım 3: Script Çalıştır

Aşağıdaki script'i çalıştırın (kullanıcının UID'sini değiştirin):

```bash
# Kullanıcının UID'sini bulmak için
firebase auth:export users.json --project your-project-id

# Veya doğrudan Firestore'da güncelleme yapmak için
# Aşağıdaki Node.js script'ini kullanın
```

## 📝 Node.js Script (Alternatif)

Aşağıdaki script'i `make-admin.js` olarak kaydedin ve çalıştırın:

```javascript
const admin = require('firebase-admin');
const serviceAccount = require('./path-to-your-service-account-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const auth = admin.auth();

async function makeUserAdmin(email) {
  try {
    // 1. Kullanıcıyı email ile bul
    const user = await auth.getUserByEmail(email);
    console.log('User found:', user.uid);
    
    // 2. Firestore'da user document'ini kontrol et veya oluştur
    const userRef = db.collection('users').doc(user.uid);
    const userDoc = await userRef.get();
    
    if (userDoc.exists) {
      // Document varsa, role'ü güncelle
      await userRef.update({
        role: 'admin',
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      console.log('User role updated to admin');
    } else {
      // Document yoksa, oluştur
      await userRef.set({
        name: user.displayName || 'Tolga Çavga',
        email: user.email,
        role: 'admin',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      console.log('User document created with admin role');
    }
    
    console.log('✅ Success! User is now admin.');
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Kullanım
makeUserAdmin('tolga@cavgalabs.com');
```

**Not:** Bu script için Firebase Admin SDK ve service account key gerekir.

## ✅ Hızlı Kontrol

Firebase Console'da kontrol etmek için:

1. **Firestore Database** → **Data** → `users` collection
2. Kullanıcının document'ini açın
3. `role` field'ının `"admin"` olduğunu görün

## 🔍 Sorun Giderme

### Kullanıcı Bulunamıyor

- Firebase Authentication'da kullanıcının var olduğundan emin olun
- Email adresinin doğru yazıldığından emin olun

### Document Bulunamıyor

- `users` collection'ında document yoksa, yukarıdaki adımlarla oluşturun
- Document ID'nin kullanıcının UID'si olduğundan emin olun

### Role Güncellenmiyor

- Browser cache'ini temizleyin (Cmd+Shift+R)
- Firebase Console'da değişikliğin kaydedildiğinden emin olun
- Birkaç saniye bekleyin (Firestore gecikmesi olabilir)

## 📚 İlgili Dosyalar

- `FIREBASE_SECURITY_RULES_COMPLETE.md` - Security rules
- `FIREBASE_SECURITY_RULES_QUICK_FIX.md` - Hızlı düzeltme

