# 🔄 Supabase'e Geçiş Planı

## 📊 Mevcut Dış Bağımlılıklar

### 1. **Firebase Firestore** 
- **Kullanım**: Proje beğenileri ve istatistikleri
- **Alternatif**: Supabase PostgreSQL + Realtime
- **Avantajlar**: 
  - Açık kaynak
  - PostgreSQL (daha güçlü query'ler)
  - Realtime subscriptions
  - Row Level Security (RLS)

### 2. **EmailJS**
- **Kullanım**: İletişim formundan e-posta gönderme
- **Alternatifler**:
  - **Supabase Edge Functions** (önerilen) - Serverless functions ile e-posta gönderme
  - **Resend API** - Modern e-posta servisi
  - **SendGrid** - Enterprise e-posta servisi
- **Avantajlar**:
  - Tek platform (Supabase)
  - Daha fazla kontrol
  - Daha iyi güvenlik

### 3. **Google Analytics 4**
- **Kullanım**: Analytics ve kullanıcı davranışı takibi
- **Alternatifler**:
  - **Plausible Analytics** - Privacy-focused, açık kaynak
  - **Umami** - Self-hosted, açık kaynak
  - **Supabase Analytics** - Custom tracking
- **Not**: Bu opsiyonel, kaldırılabilir veya alternatif kullanılabilir

---

## 🚀 Supabase Geçiş Adımları

### Adım 1: Supabase Projesi Oluşturma

1. [Supabase](https://supabase.com) hesabı oluşturun
2. Yeni proje oluşturun
3. Project URL ve anon key'i alın

### Adım 2: Database Schema Oluşturma

Supabase SQL Editor'da çalıştırın:

```sql
-- Project Likes Table
CREATE TABLE project_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  liked BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id, user_id)
);

-- Project Stats Table
CREATE TABLE project_stats (
  project_id TEXT PRIMARY KEY,
  total_likes INTEGER DEFAULT 0,
  unique_likers INTEGER DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_project_likes_project_id ON project_likes(project_id);
CREATE INDEX idx_project_likes_user_id ON project_likes(user_id);
CREATE INDEX idx_project_likes_liked ON project_likes(liked);

-- Function to update stats automatically
CREATE OR REPLACE FUNCTION update_project_stats()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO project_stats (project_id, total_likes, unique_likers, last_updated)
  SELECT 
    NEW.project_id,
    COUNT(*) FILTER (WHERE liked = true),
    COUNT(DISTINCT user_id) FILTER (WHERE liked = true),
    NOW()
  FROM project_likes
  WHERE project_id = NEW.project_id
  ON CONFLICT (project_id) 
  DO UPDATE SET
    total_likes = EXCLUDED.total_likes,
    unique_likers = EXCLUDED.unique_likers,
    last_updated = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update stats
CREATE TRIGGER trigger_update_project_stats
AFTER INSERT OR UPDATE OR DELETE ON project_likes
FOR EACH ROW
EXECUTE FUNCTION update_project_stats();

-- Row Level Security (RLS) - Public read, authenticated write
ALTER TABLE project_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_stats ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can read project likes" ON project_likes
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert project likes" ON project_likes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update project likes" ON project_likes
  FOR UPDATE USING (true);

CREATE POLICY "Anyone can read project stats" ON project_stats
  FOR SELECT USING (true);
```

### Adım 3: Supabase Client Kurulumu

```bash
npm install @supabase/supabase-js
```

### Adım 4: Supabase Client Dosyası Oluşturma

`src/lib/supabase.ts` dosyası oluşturulacak.

### Adım 5: Edge Function (E-posta için)

Supabase Edge Function oluşturulacak (Resend veya başka bir servis ile).

---

## 📝 Seçenekler

### Seçenek 1: Tam Supabase Geçişi (Önerilen)
- ✅ Firebase → Supabase PostgreSQL
- ✅ EmailJS → Supabase Edge Functions + Resend
- ⚠️ Google Analytics → Plausible/Umami (opsiyonel)

### Seçenek 2: Kısmi Geçiş
- ✅ Firebase → Supabase PostgreSQL
- ⚠️ EmailJS → Kalabilir (basit ve çalışıyor)
- ⚠️ Google Analytics → Kalabilir

### Seçenek 3: Minimal Bağımlılık
- ✅ Firebase → LocalStorage + Backend API (kendi backend'iniz)
- ✅ EmailJS → Backend API endpoint
- ⚠️ Google Analytics → Kaldırılabilir

---

## 🎯 Önerilen Yaklaşım

**Seçenek 1: Tam Supabase Geçişi**

Avantajlar:
- Tek platform
- Daha iyi performans
- Daha fazla kontrol
- Açık kaynak
- Ücretsiz tier yeterli

Dezavantajlar:
- Migration gerektirir
- Edge Functions öğrenme eğrisi

Hangi seçeneği tercih edersiniz?

