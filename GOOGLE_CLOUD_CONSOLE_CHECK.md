# 🔍 Google Cloud Console Kontrolü

## 📋 OAuth Consent Screen Kontrolü

Firebase Console'da OAuth consent screen uyarısı yoksa, Google Cloud Console'da kontrol et:

### 1. Google Cloud Console'a Git

[Google Cloud Console](https://console.cloud.google.com/)

### 2. Projeyi Seç

1. Üst kısımdaki proje seçiciye tıkla
2. `myportfolio-1e13b` projesini seç
3. Eğer listede yoksa, "All" seçeneğine tıkla ve ara

### 3. OAuth Consent Screen Kontrolü

1. Sol menüden **APIs & Services** > **OAuth consent screen** seç
2. Şu bilgileri kontrol et:

**Status ne?**
- **Testing**: Development için yeterli ✅
- **In production**: Production için gerekli ✅
- **Yapılandırılmamış**: Yapılandırılmalı ❌

**Eğer yapılandırılmamışsa:**
- **User Type**: External seç
- **Create** butonuna tıkla
- Adım adım yapılandır (detaylar için `FIREBASE_OAUTH_CONSENT_SCREEN.md` dosyasına bak)

### 4. Identity Toolkit API Kontrolü

1. Sol menüden **APIs & Services** > **Enabled APIs** seç
2. Arama kutusuna "Identity Toolkit" yaz
3. **Identity Toolkit API** listede var mı?
   - **Varsa**: Aktif ✅
   - **Yoksa**: **+ ENABLE APIS AND SERVICES** butonuna tıkla
   - "Identity Toolkit API" ara
   - **Enable** butonuna tıkla

## ✅ Kontrol Listesi

- [ ] Google Cloud Console'a giriş yaptın mı?
- [ ] `myportfolio-1e13b` projesini seçtin mi?
- [ ] APIs & Services > OAuth consent screen'e gittin mi?
- [ ] OAuth consent screen status'u ne? (Testing/In production/Yapılandırılmamış)
- [ ] APIs & Services > Enabled APIs'de Identity Toolkit API var mı?
- [ ] Identity Toolkit API aktif mi?

## 🔧 Eğer OAuth Consent Screen Yapılandırılmamışsa

1. **User Type**: External seç
2. **Create** butonuna tıkla
3. **App information**:
   - App name: `Portfolio App`
   - User support email: `tolga@cavgalabs.com`
   - Developer contact: `tolga@cavgalabs.com`
   - **Save and Continue**
4. **Scopes**: Varsayılanları kullan (email, profile, openid)
   - **Save and Continue**
5. **Test users**: Kendi email'ini ekle (`tolga@cavgalabs.com`)
   - **Save and Continue**
6. **Back to Dashboard**

## 📝 Notlar

- OAuth Consent Screen yapılandırması birkaç dakika sürebilir
- Değişikliklerin aktif olması için 2-3 dakika bekle
- Development'ta "Testing" modu yeterli
- Test users listesine eklediğin email'lerle giriş yapabilirsin

