# 🔧 CORS Hatası Düzeltmesi

## ❌ Sorun

```
Access to fetch at 'https://cavga.dev/api/contact' from origin 'https://www.cavga.dev' 
has been blocked by CORS policy: Response to preflight request doesn't pass 
access control check: Redirect is not allowed for a preflight request.
```

**Neden?**
- Frontend `https://www.cavga.dev` üzerinde çalışıyor
- Backend `https://cavga.dev` üzerinde (www olmadan)
- Veya Vercel `www.cavga.dev` → `cavga.dev` redirect yapıyor
- Preflight (OPTIONS) request redirect'e takılıyor

## ✅ Çözüm

Backend'de CORS ayarları güncellendi:
- Hem `www.cavga.dev` hem `cavga.dev` için izin veriliyor
- Development'ta tüm origin'lere izin veriliyor

## 🔧 Vercel Environment Variables

Vercel'de `ALLOWED_ORIGIN` environment variable'ını ayarlayın:

```
ALLOWED_ORIGIN=https://www.cavga.dev,https://cavga.dev
```

**Veya** boş bırakın (otomatik olarak her iki domain'i de destekler).

## 📝 Not

Eğer hala CORS hatası alıyorsanız:

1. **Vercel'de domain redirect kontrolü:**
   - `www.cavga.dev` → `cavga.dev` redirect yapıyorsa, bunu kaldırın
   - Veya her iki domain'i de aynı deployment'a bağlayın

2. **Frontend'de API endpoint:**
   - `VITE_API_ENDPOINT` environment variable'ını ayarlayın:
   ```
   VITE_API_ENDPOINT=https://cavga.dev/api/contact
   ```

3. **Vercel'de redeploy:**
   - Environment variable değişikliklerinden sonra redeploy yapın

## ✅ Test

1. `https://www.cavga.dev` üzerinden form gönderin
2. `https://cavga.dev` üzerinden form gönderin
3. Her ikisi de çalışmalı

