# 🔧 Firebase Auth Configuration Not Found Hatası - Çözüm

## ❌ Hata
```
Firebase: Error (auth/configuration-not-found)
```

## 🔍 Olası Nedenler ve Çözümler

### 1. Google Authentication Provider Aktif Değil

**Kontrol:**
1. [Firebase Console](https://console.firebase.google.com/) > Projeni seç
2. **Authentication** > **Sign-in method** sekmesine git
3. **Google** provider'ını kontrol et

**Çözüm:**
- **Google** provider'ı **Enable** olmalı
- **Project support email** seçilmiş olmalı
- **Save** butonuna tıkla

### 2. OAuth Consent Screen Yapılandırılmamış

**Kontrol:**
1. Firebase Console > Authentication > Sign-in method > Google
2. Eğer "OAuth consent screen" uyarısı görüyorsan, yapılandırılmalı

**Çözüm:**
1. **Configure consent screen** linkine tıkla
2. Google Cloud Console'a yönlendirileceksin
3. OAuth consent screen'i yapılandır:
   - **User Type**: External (genel kullanım için)
   - **App name**: Portfolio App (veya istediğin isim)
   - **User support email**: Kendi email'in
   - **Developer contact information**: Kendi email'in
   - **Save and Continue**
   - **Scopes**: Varsayılanları kullan (email, profile, openid)
   - **Save and Continue**
   - **Test users**: Development için kendi email'ini ekle (opsiyonel)
   - **Save and Continue**
   - **Back to Dashboard**

### 3. Authorized Domains Eksik

**Kontrol:**
1. Firebase Console > Authentication > Settings > **Authorized domains**
2. Şu domain'lerin ekli olduğundan emin ol:
   - `localhost` ✅
   - `myportfolio-1e13b.firebaseapp.com` ✅
   - `myportfolio-1e13b.web.app` ✅

**Çözüm:**
- Eğer `localhost` yoksa, **Add domain** butonuna tıkla ve ekle
- Production domain'ini de ekle (örn: `cavga.dev` veya `tolgacavga.com`)

### 4. Firebase Config Kontrolü

**Kontrol:**
`src/lib/firebase/config.ts` dosyasında:
- `authDomain` doğru mu?
- `projectId` doğru mu?
- `apiKey` doğru mu?

**Çözüm:**
1. Firebase Console > Project Settings > General > Your apps > Web app
2. Config bilgilerini kontrol et
3. Eğer farklıysa, `.env` dosyasını güncelle veya `config.ts`'i düzelt

### 5. Google Cloud Console API Kontrolü

**Kontrol:**
1. [Google Cloud Console](https://console.cloud.google.com/) > Projeni seç
2. **APIs & Services** > **Enabled APIs**
3. Şu API'lerin aktif olduğundan emin ol:
   - **Identity Toolkit API** ✅
   - **Google+ API** (deprecated ama bazı durumlarda gerekli)

**Çözüm:**
- Eğer eksikse, **Enable API** butonuna tıkla

## ✅ Adım Adım Kontrol Listesi

- [ ] Firebase Console > Authentication > Sign-in method > Google **Enabled**
- [ ] OAuth consent screen yapılandırılmış
- [ ] Authorized domains'de `localhost` var
- [ ] Firebase config doğru (`authDomain`, `projectId`, `apiKey`)
- [ ] Google Cloud Console > Identity Toolkit API aktif
- [ ] Tarayıcı cache'i temizlendi
- [ ] Uygulama yeniden başlatıldı (`npm run dev`)

## 🧪 Test

1. Uygulamayı yeniden başlat: `npm run dev`
2. Login modal'ını aç
3. "Sign in with Google" butonuna tıkla
4. Google popup'ı açılmalı
5. Google hesabını seç
6. İzinleri onayla
7. Başarıyla giriş yapılmalı

## 🔄 Hala Çalışmıyorsa

1. **Browser Console'u kontrol et:**
   - F12 > Console
   - Detaylı hata mesajlarını gör

2. **Firebase Console'u kontrol et:**
   - Authentication > Users
   - Giriş denemeleri görünüyor mu?

3. **Network tab'ı kontrol et:**
   - F12 > Network
   - Google OAuth isteklerini kontrol et
   - 400 veya 403 hataları var mı?

4. **Firebase Support:**
   - [Firebase Support](https://firebase.google.com/support)
   - Hata mesajını ve adımları paylaş

## 📝 Notlar

- Development'ta `localhost` kullanıyorsan, OAuth consent screen'in "Testing" modunda olması gerekebilir
- Production'da domain ekledikten sonra birkaç dakika bekle (propagation için)
- API key restrictions varsa, `localhost` ve production domain'ini ekle

