# 🔧 OAuth Client Güncelleme - Authorized Origins

## ✅ Mevcut Durum

Google Cloud Console'da OAuth client detaylarını görüyorsun:

**Client ID:** `419940030464-gb848ubui3139a5tbfonqmc0pu17kotr.apps.googleusercontent.com`  
**Name:** "Web client (auto created by Google Service)"  
**Creation date:** November 13, 2025, 8:04:44 PM GMT+3  
**Status:** Firebase tarafından otomatik oluşturulmuş ✅

## ❌ Eksik Authorized Origins

### Mevcut Authorized JavaScript origins:
- ✅ `http://localhost`
- ✅ `http://localhost:5000`
- ✅ `https://myportfolio-1e13b.firebaseapp.com`

### Eksik olanlar:
- ❌ `http://localhost:5173` (Development için - Vite default port)
- ❌ `https://tolgacavga.com` (Production domain)
- ❌ `https://cavga.dev` (Production domain)

### Mevcut Authorized redirect URIs:
- ✅ `https://myportfolio-1e13b.firebaseapp.com/_/auth/handler`

### Eksik olanlar:
- ❌ `http://localhost:5173/__/auth/handler` (Development için)
- ❌ `https://tolgacavga.com/__/auth/handler` (Production)
- ❌ `https://cavga.dev/__/auth/handler` (Production)

## 🚀 Çözüm: Authorized Origins Ekle

### 1. Authorized JavaScript origins ekle

Google Cloud Console'da OAuth client detay sayfasında:

1. **Authorized JavaScript origins** bölümünde **"+ Add URI"** butonuna tıkla
2. Şu URI'leri ekle (her biri için ayrı ayrı):
   - `http://localhost:5173`
   - `https://tolgacavga.com`
   - `https://cavga.dev`
   - `https://myportfolio-1e13b.web.app`

### 2. Authorized redirect URIs ekle

1. **Authorized redirect URIs** bölümünde **"+ Add URI"** butonuna tıkla
2. Şu URI'leri ekle (her biri için ayrı ayrı):
   - `http://localhost:5173/__/auth/handler`
   - `https://tolgacavga.com/__/auth/handler`
   - `https://cavga.dev/__/auth/handler`
   - `https://myportfolio-1e13b.web.app/__/auth/handler`

### 3. Save

1. Sayfanın alt kısmındaki **"Save"** butonuna tıkla
2. Birkaç dakika bekle (propagation için)
3. Uygulamayı test et

## 📝 Notlar

- **Firebase Otomatik Oluşturma:** Bu OAuth client Firebase tarafından otomatik oluşturulmuş
- **Yeni Client:** Bugün (November 13, 2025) oluşturulmuş
- **Doğru Proje:** `myportfolio-1e13b` ✅
- **Client Secret:** Mevcut ve enabled ✅

## ✅ Kontrol Listesi

- [ ] Authorized JavaScript origins'e `http://localhost:5173` eklendi mi?
- [ ] Authorized JavaScript origins'e production domain'ler eklendi mi?
- [ ] Authorized redirect URIs'e development ve production URI'ler eklendi mi?
- [ ] Save butonuna basıldı mı?
- [ ] Birkaç dakika beklendi mi?
- [ ] Uygulama test edildi mi?

## 🎯 Sonuç

Bu OAuth client **yeni** ve Firebase tarafından otomatik oluşturulmuş. Sadece **Authorized origins** eklemen gerekiyor. Ekle ve test et!

