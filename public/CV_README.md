# CV Dosyası Yükleme Talimatları 📄

## 📍 Bu Klasöre CV'nizi Ekleyin

Portfolyo sitenizde "CV İndir" butonu çalışması için bu klasöre CV'nizi yüklemeniz gerekiyor.

## 📝 Adım Adım:

### 1. CV'nizi Hazırlayın
- **Format**: PDF (tavsiye edilir)
- **Dosya Adı**: `Tolga_Cavga_CV.pdf`
- **ATS Uyumlu**: Başvuru takip sistemlerine uygun formatta olduğundan emin olun

### 2. Dosyayı Buraya Koyun
```
public/
  ├── Tolga_Cavga_CV.pdf  ← Buraya!
  ├── CV_README.md
  ├── favicon.svg
  └── ...
```

### 3. Test Edin
- Projeyi çalıştırın: `npm run dev`
- Footer'daki "CV İndir" butonuna tıklayın
- CV'nizin indiğini kontrol edin

## 🎯 ATS Uyumlu CV İpuçları:

✅ **Yapılması Gerekenler:**
- Basit, temiz formatı kullanın
- Standart fontlar (Arial, Calibri, Times New Roman)
- Net başlıklar (İş Deneyimi, Eğitim, Yetenekler)
- Anahtar kelimeler ekleyin (React, TypeScript, vb.)
- Sayfa başlıkları ve alt başlıkları kullanın
- Metin tabanlı PDF (taranmış görsel değil)

❌ **Yapılmaması Gerekenler:**
- Karmaşık grafikler ve görseller
- Tablolar içinde tablolar
- Header/Footer içinde önemli bilgiler
- İki kolonlu karmaşık düzenler
- Özel veya dekoratif fontlar

## 🛠️ Önerilen Araçlar:

- **Canva**: Ücretsiz ATS-friendly şablonlar
- **Resume.io**: Profesyonel CV oluşturucu
- **Microsoft Word**: Basit şablonlar
- **Google Docs**: Resume Template Gallery

## 📊 Alternatif Dosya İsimleri:

Eğer farklı bir isim kullanmak isterseniz, `Footer.tsx` dosyasında şu satırı değiştirin:

```tsx
href="/Tolga_Cavga_CV.pdf"  // ← Burası
download="Tolga_Cavga_CV.pdf"
```

## 🚀 Deployment Sonrası:

- Vercel: Otomatik olarak `public/` klasörü deploy edilir
- Netlify: Aynı şekilde otomatik
- GitHub Pages: Build klasörüne kopyalanır

CV dosyanız hazır olduğunda bu README'yi silebilirsiniz! ✨

