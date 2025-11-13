# 🔐 reCAPTCHA Enterprise Service Account

Service account oluştururken ne yazmalısınız.

## 📝 Service Account Bilgileri

### 1. Service account name

```
portfolio-recaptcha-enterprise
```

**Veya daha açıklayıcı:**
```
portfolio-contact-form-recaptcha
```

### 2. Service account ID

**Otomatik oluşturulur** - "Refresh" butonuna tıklayarak değiştirebilirsiniz.

**Önerilen:**
```
portfolio-recaptcha-enterprise
```

**Veya:**
```
portfolio-contact-recaptcha
```

### 3. Service account description

```
Service account for reCAPTCHA Enterprise verification in portfolio contact form backend API
```

**Veya kısa:**
```
reCAPTCHA Enterprise verification for contact form
```

## ✅ Örnek Doldurulmuş Form

```
Service account name: portfolio-recaptcha-enterprise
Service account ID: portfolio-recaptcha-enterprise (otomatik)
Email: portfolio-recaptcha-enterprise@my-portfolio-478020.iam.gserviceaccount.com
Description: Service account for reCAPTCHA Enterprise verification in portfolio contact form backend API
```

## 📋 Adımlar

1. **Service account name:** `portfolio-recaptcha-enterprise` yazın
2. **Service account ID:** Otomatik oluşacak, değiştirmek isterseniz refresh butonuna tıklayın
3. **Description:** Yukarıdaki açıklamayı yazın
4. **"Create and continue"** butonuna tıklayın
5. **Permissions:** 
   - **"Owner" rolünü kaldırın** (çok fazla yetki) ❌
   - **"reCAPTCHA Enterprise Agent"** rolünü seçin ✅
   - Veya **"Continue"** butonuna tıklayarak atlayın (opsiyonel)
6. **Done** butonuna tıklayın

## 🔐 Permissions (Rol Seçimi)

### ❌ "Owner" Rolünü Kaldırın

"Owner" rolü çok fazla yetki verir, güvenlik riski oluşturur.

### ✅ Doğru Rol: "reCAPTCHA Enterprise Agent"

**Nasıl seçilir:**
1. "Owner" rolünün yanındaki **çöp kutusu ikonuna** tıklayın (kaldırın)
2. **"+ Add another role"** butonuna tıklayın
3. Arama kutusuna **"reCAPTCHA Enterprise Agent"** yazın
4. Bu rolü seçin

**Alternatif (eğer bulamazsanız):**
- **"Cloud Resource Manager Viewer"** (daha kısıtlı)
- Veya **Permissions adımını atlayın** (opsiyonel)

### ⚠️ Önemli Not

**Permissions adımı opsiyonel!** Şimdilik atlayabilirsiniz. Mevcut backend kodunuz service account kullanmıyor, basit siteverify endpoint kullanıyor.

## 👥 Principals with access (Son Adım)

### ✅ Bu Adımı Atlayın

**"Principals with access" adımı:**
- Service account'a erişim vermek için kullanıcı/grup eklemek içindir
- **Opsiyonel** - gerekli değil
- Mevcut backend kodunuz service account kullanmıyor

**Ne yapmalısınız:**
1. **Hiçbir şey yapmayın** - boş bırakın
2. **"Done"** butonuna tıklayın

**"Service account users role" ve "Service account admins role" alanlarını boş bırakın.** Bu adım sadece başka kullanıcılara service account erişimi vermek isterseniz gerekli.

## ✅ Service Account Oluşturuldu

Service account başarıyla oluşturuldu:
- **Email:** `portfolio-recaptcha-enterprise@my-portfolio-478020.iam.gserviceaccount.com`
- **Name:** `portfolio-recaptcha-enterprise`

## 🎯 Şimdi Ne Yapmalısınız?

### ✅ Hiçbir Şey Yapmanıza Gerek Yok!

**Mevcut backend kodunuz service account kullanmıyor.** Basit `siteverify` endpoint kullanıyor ve çalışıyor.

### 📥 JSON Key İndirmek İsterseniz (Opsiyonel)

Eğer gelecekte Google Cloud SDK kullanmak isterseniz:

1. Service account'un **"Actions"** sütunundaki **kalem ikonuna** (Edit) tıklayın
2. **"Keys"** sekmesine gidin
3. **"Add Key"** → **"Create new key"** seçin
4. **"JSON"** formatını seçin
5. Key dosyası indirilecek

**⚠️ Önemli:** JSON key dosyasını güvenli tutun, GitHub'a commit etmeyin!

### 🔄 Mevcut Durum

- ✅ Service account oluşturuldu
- ✅ Backend kodunuz çalışıyor (siteverify endpoint)
- ✅ Ekstra bir şey yapmanıza gerek yok

## ⚠️ Önemli Not

**Şu anda service account'a ihtiyacınız yok!**

Mevcut backend kodunuz basit `siteverify` endpoint kullanıyor ve çalışıyor. Service account sadece Google Cloud SDK kullanmak isterseniz gerekli.

**Öneri:** Service account oluşturuldu, ancak şu an için kullanmanıza gerek yok. Mevcut kod çalışıyor.

## 🎯 Ne Zaman Gerekli?

Service account sadece şu durumda gerekli:
- Google Cloud SDK (`@google-cloud/recaptcha-enterprise`) kullanmak isterseniz
- Daha gelişmiş risk analizi isterseniz

**Mevcut durumda:** Gerekli değil, mevcut kod çalışıyor! ✅

