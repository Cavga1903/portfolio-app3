# 🔍 Farklı Client ID'ler - Açıklama

## ❌ Sorun

İki farklı Client ID görüyorsun:

1. **Google Cloud Console'da:**
   - Client ID: `803439146629-h3hj...`
   - Proje: `my-portfolio-478020`

2. **Firebase Console'da:**
   - Client ID: `419940030464-gb848ubui3139a5tbfonqmc0pu17kotr.apps.googleuserc...`
   - Proje: `myportfolio-1e13b`

## 🔍 Neden Farklı?

### Senaryo 1: Farklı Projeler (EN OLASISI)

**Google Cloud Console'da:** `my-portfolio-478020`  
**Firebase Console'da:** `myportfolio-1e13b`

Bu **farklı projeler**! Bu yüzden Client ID'ler farklı.

### Senaryo 2: Farklı OAuth Client'lar

Aynı projede birden fazla OAuth client olabilir:
- Firebase otomatik oluşturduğu client
- Sen manuel oluşturduğun client

## ✅ Çözüm: Doğru Projeyi Seç

### 1. Firebase Proje Bilgilerini Kontrol Et

Firebase Console > Project Settings > General:
- **Project ID:** `myportfolio-1e13b`
- **Project number:** `419940030464`

### 2. Google Cloud Console'da Doğru Projeyi Seç

1. Google Cloud Console'da üst kısımdaki proje seçiciye tıkla
2. **Tüm projeleri göster**
3. `myportfolio-1e13b` projesini ara ve seç
4. Eğer listede yoksa:
   - Project number ile ara: `419940030464`
   - Veya Firebase Console'dan proje ID'sini kopyala

### 3. Doğru OAuth Client'ı Kontrol Et

Google Cloud Console'da doğru projeyi seçtikten sonra:

1. **APIs & Services** > **Credentials**
2. **OAuth 2.0 Client IDs** bölümünde:
   - Hangi OAuth client'lar var?
   - Firebase otomatik oluşturduğu client var mı?
   - Client ID: `419940030464-...` ile başlayan var mı?

### 4. Firebase Console'daki Client ID ile Eşleştir

Firebase Console'daki Client ID:
```
419940030464-gb848ubui3139a5tbfonqmc0pu17kotr.apps.googleusercontent.com
```

Google Cloud Console'da bu Client ID'yi bul:
- Eğer bulursan: Bu doğru OAuth client ✅
- Eğer bulamazsan: Farklı projede olabilir ❌

## 🚀 Önerilen Çözüm

### Seçenek 1: Firebase'in Otomatik OAuth Client'ını Kullan (Önerilen)

1. **Firebase Console'da:**
   - Authentication > Sign-in method > Google
   - Web SDK configuration bölümünde:
     - **Web client ID:** Mevcut değeri koru (`419940030464-gb848ubui3139a5tbfonqmc0pu17kotr...`)
     - **Web client secret:** Maskelenmiş değeri koru (Firebase otomatik yönetir)
   - **Save** butonuna bas

2. **Test et:**
   - Uygulamayı yenile
   - "Sign in with Google" butonunu dene

### Seçenek 2: Google Cloud Console'daki OAuth Client'ı Kullan

Eğer Google Cloud Console'da yeni OAuth client oluşturduysan:

1. **Google Cloud Console'da doğru projeyi seç** (`myportfolio-1e13b`)
2. **OAuth client'ın Client ID'sini kopyala**
3. **Firebase Console'da:**
   - Authentication > Sign-in method > Google
   - Web SDK configuration:
     - **Web client ID:** Google Cloud Console'dan kopyaladığın Client ID'yi yapıştır
     - **Web client secret:** Boş bırak (Firebase otomatik yönetir)
   - **Save** butonuna bas

## ⚠️ Önemli Notlar

- **Farklı Projeler:** `my-portfolio-478020` ve `myportfolio-1e13b` farklı projeler
- **Doğru Proje:** Firebase projesi `myportfolio-1e13b` olmalı
- **Client Secret:** Firebase web uygulamaları için genellikle gerekli değil
- **Firebase Otomatik Yönetim:** Firebase, OAuth client'ı otomatik olarak yönetir

## ✅ Kontrol Listesi

- [ ] Google Cloud Console'da doğru projeyi seçtin mi? (`myportfolio-1e13b`)
- [ ] Firebase Console'daki Client ID ile Google Cloud Console'daki Client ID eşleşiyor mu?
- [ ] OAuth Consent Screen yapılandırılmış mı?
- [ ] Identity Toolkit API aktif mi?

## 📝 Sonuç

**Farklı Client ID'ler farklı projelerden kaynaklanıyor olabilir.** 

**Çözüm:**
1. Google Cloud Console'da **doğru projeyi seç** (`myportfolio-1e13b`)
2. Firebase Console'daki mevcut Client ID'yi kullan (Firebase otomatik yönetir)
3. Client secret'ı değiştirme (Firebase otomatik yönetir)

