# ❌ "Error updating Google" Hatası - Çözüm

## 🔍 Sorun

Firebase Console'da "Error updating Google" hatası alıyorsun ve client secret yapıştırırken hata veriyor.

## ✅ Çözüm 1: Mevcut Değerleri Geri Yükle (Önerilen)

Firebase'in otomatik oluşturduğu OAuth client'ı kullan. Client secret'ı değiştirme.

### Adımlar:

1. **Firebase Console > Authentication > Sign-in method > Google**

2. **Web SDK configuration bölümünde:**
   - **Web client ID:** Eski değeri geri yükle
     - Eski değer: `419940030464-4l5ii3fmfhd77dc2vj1isc2rtl2suasm.apps.googleusercontent.com`
   - **Web client secret:** Boş bırak veya eski maskelenmiş değeri kullan
     - Firebase otomatik yönetir, manuel girmene gerek yok

3. **Save** butonuna bas

## ✅ Çözüm 2: Client Secret'ı Kaldır

Firebase web uygulamaları için client secret genellikle gerekli değil.

### Adımlar:

1. **Web SDK configuration bölümünde:**
   - **Web client ID:** Mevcut değeri koru
   - **Web client secret:** Alanı **boş bırak** veya sil

2. **Save** butonuna bas

## ✅ Çözüm 3: OAuth Client ID ve Secret Eşleşmesi

Eğer yeni OAuth client oluşturduysan, Client ID ve Client secret'ın aynı OAuth client'tan olması gerekir.

### Kontrol:

1. **Google Cloud Console > APIs & Services > Credentials**
2. **OAuth 2.0 Client IDs** bölümünde:
   - Hangi OAuth client'ın Client ID'sini kullanıyorsun?
   - Aynı OAuth client'ın Client secret'ını kullanmalısın

### Eğer Eşleşmiyorsa:

1. **Google Cloud Console'da:**
   - Doğru OAuth client'ı bul
   - Client ID ve Client secret'ı kopyala

2. **Firebase Console'da:**
   - Web client ID: Doğru Client ID'yi yapıştır
   - Web client secret: Doğru Client secret'ı yapıştır
   - **Save** butonuna bas

## ✅ Çözüm 4: Firebase'in Otomatik OAuth Client'ını Kullan

En kolay çözüm: Firebase'in otomatik oluşturduğu OAuth client'ı kullan.

### Adımlar:

1. **Firebase Console > Authentication > Sign-in method > Google**

2. **Web SDK configuration bölümünde:**
   - **Web client ID:** `419940030464-4l5ii3fmfhd77dc2vj1isc2rtl2suasm.apps.googleusercontent.com`
   - **Web client secret:** Boş bırak veya sil (Firebase otomatik yönetir)

3. **Save** butonuna bas

4. **Eğer hala hata alıyorsan:**
   - Google provider'ını **Disable** yap
   - **Save** butonuna bas
   - Birkaç saniye bekle
   - Google provider'ını tekrar **Enable** yap
   - **Save** butonuna bas

## 🔍 OAuth Consent Screen Kontrolü

"Error updating Google" hatası genellikle OAuth Consent Screen yapılandırılmamış olmasından kaynaklanır.

### Kontrol:

1. **Google Cloud Console > APIs & Services > OAuth consent screen**
2. **Status ne?**
   - **Testing:** Development için yeterli ✅
   - **In production:** Production için gerekli ✅
   - **Yapılandırılmamış:** Yapılandırılmalı ❌

### Eğer Yapılandırılmamışsa:

1. **User Type:** External seç
2. **Create** butonuna tıkla
3. Adım adım yapılandır (detaylar için `FIREBASE_OAUTH_CONSENT_SCREEN.md`)

## 📝 Notlar

- **Client Secret:** Firebase web uygulamaları için genellikle gerekli değil
- **Firebase Otomatik Yönetim:** Firebase, OAuth client'ı otomatik olarak yönetir
- **OAuth Consent Screen:** Yapılandırılmamışsa, "Error updating Google" hatası alırsın

## ✅ Önerilen Adımlar

1. **Web client secret alanını boş bırak** veya sil
2. **Web client ID'yi eski değere geri yükle:** `419940030464-4l5ii3fmfhd77dc2vj1isc2rtl2suasm.apps.googleusercontent.com`
3. **Save** butonuna bas
4. **Eğer hala hata alıyorsan:**
   - OAuth Consent Screen kontrolü yap (Google Cloud Console)
   - Identity Toolkit API kontrolü yap (Google Cloud Console)

