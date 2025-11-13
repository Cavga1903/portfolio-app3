# 🚀 Vercel Environment Variables Setup

## 📋 Firebase Environment Variables

Firebase Console'daki değerleri Vercel'e eklemek için:

### 1. Vercel Dashboard'a Git

1. [Vercel Dashboard](https://vercel.com/dashboard) > Projeni seç
2. **Settings** sekmesine git
3. **Environment Variables** bölümüne git

### 2. Environment Variables Ekle

Her bir variable için:

1. **Name** (Variable Name): Aşağıdaki isimleri kullan
2. **Value**: Firebase Console'daki değerleri yapıştır
3. **Environment**: Hangi environment'lar için geçerli olacak?
   - **Production** ✅ (Production için)
   - **Preview** ✅ (Preview/PR için)
   - **Development** ✅ (Development için)
4. **Add** butonuna tıkla

### 3. Eklenmesi Gereken Variables

#### 1. VITE_FIREBASE_API_KEY
```
Name: VITE_FIREBASE_API_KEY
Value: AIzaSyA6UCz0o9V4OLH2vGw8n1GU-CdRTb8hPxg
Environment: Production, Preview, Development
```

#### 2. VITE_FIREBASE_AUTH_DOMAIN
```
Name: VITE_FIREBASE_AUTH_DOMAIN
Value: myportfolio-1e13b.firebaseapp.com
Environment: Production, Preview, Development
```

#### 3. VITE_FIREBASE_PROJECT_ID
```
Name: VITE_FIREBASE_PROJECT_ID
Value: myportfolio-1e13b
Environment: Production, Preview, Development
```

#### 4. VITE_FIREBASE_STORAGE_BUCKET
```
Name: VITE_FIREBASE_STORAGE_BUCKET
Value: myportfolio-1e13b.firebasestorage.app
Environment: Production, Preview, Development
```

#### 5. VITE_FIREBASE_MESSAGING_SENDER_ID
```
Name: VITE_FIREBASE_MESSAGING_SENDER_ID
Value: 419940030464
Environment: Production, Preview, Development
```

#### 6. VITE_FIREBASE_APP_ID
```
Name: VITE_FIREBASE_APP_ID
Value: 1:419940030464:web:4370506fa0b2e9b934a0e5
Environment: Production, Preview, Development
```

#### 7. VITE_FIREBASE_MEASUREMENT_ID
```
Name: VITE_FIREBASE_MEASUREMENT_ID
Value: G-TTT8JF69GR
Environment: Production, Preview, Development
```

## 🔄 Vercel CLI ile Ekleme (Alternatif)

Terminal'den de ekleyebilirsin:

```bash
# Vercel CLI'yi yükle (eğer yoksa)
npm i -g vercel

# Vercel'e login ol
vercel login

# Projeye bağlan
vercel link

# Environment variables ekle
vercel env add VITE_FIREBASE_API_KEY production
# Value'yu yapıştır: AIzaSyA6UCz0o9V4OLH2vGw8n1GU-CdRTb8hPxg

vercel env add VITE_FIREBASE_AUTH_DOMAIN production
# Value'yu yapıştır: myportfolio-1e13b.firebaseapp.com

vercel env add VITE_FIREBASE_PROJECT_ID production
# Value'yu yapıştır: myportfolio-1e13b

vercel env add VITE_FIREBASE_STORAGE_BUCKET production
# Value'yu yapıştır: myportfolio-1e13b.firebasestorage.app

vercel env add VITE_FIREBASE_MESSAGING_SENDER_ID production
# Value'yu yapıştır: 419940030464

vercel env add VITE_FIREBASE_APP_ID production
# Value'yu yapıştır: 1:419940030464:web:4370506fa0b2e9b934a0e5

vercel env add VITE_FIREBASE_MEASUREMENT_ID production
# Value'yu yapıştır: G-TTT8JF69GR
```

Her variable için preview ve development environment'larına da ekle:
```bash
vercel env add VITE_FIREBASE_API_KEY preview
vercel env add VITE_FIREBASE_API_KEY development
# ... diğerleri için de aynı şekilde
```

## ✅ Kontrol

1. Vercel Dashboard > Settings > Environment Variables
2. Tüm variables'ların eklendiğini kontrol et
3. Her birinin doğru environment'larda olduğunu kontrol et

## 🔄 Deployment

Environment variables ekledikten sonra:

1. **Yeni deployment yap:**
   - Vercel Dashboard > Deployments > Redeploy
   - Veya git push yap

2. **Environment variables'ların aktif olduğunu kontrol et:**
   - Deployment logs'da kontrol et
   - Uygulamada test et

## 📝 Notlar

- **VITE_ prefix:** Vite projelerinde environment variables `VITE_` ile başlamalı
- **Environment seçimi:** Production, Preview, Development için ayrı ayrı ekle
- **Güvenlik:** Environment variables Vercel'de güvenli bir şekilde saklanır
- **Deployment:** Yeni variables ekledikten sonra redeploy gerekir

## 🚀 Hızlı Adımlar

1. Vercel Dashboard > Projen > Settings > Environment Variables
2. Her variable için:
   - Name: `VITE_FIREBASE_...`
   - Value: Firebase Console'daki değer
   - Environment: Production, Preview, Development
   - Add
3. Redeploy yap
4. Test et

