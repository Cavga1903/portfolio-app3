# 🔴 Redis Nedir ve Bu Projede Kullanımı

## 📚 Redis Nedir?

**Redis (Remote Dictionary Server)**, açık kaynaklı, in-memory (bellekte çalışan) bir veri yapısı deposudur. Yüksek performanslı, key-value (anahtar-değer) tabanlı bir NoSQL veritabanıdır.

### 🎯 Temel Özellikler

1. **In-Memory Storage**: Veriler RAM'de tutulur, çok hızlıdır
2. **Key-Value Store**: Basit anahtar-değer çiftleri
3. **Veri Yapıları**: String, List, Set, Hash, Sorted Set destekler
4. **Persistence**: Verileri diske kaydedebilir (RDB, AOF)
5. **Replication**: Master-slave replikasyon
6. **Pub/Sub**: Mesajlaşma sistemi

---

## 💡 Ne İçin Kullanılır?

### 1. **Caching (Önbellekleme)**
- En yaygın kullanım alanı
- Veritabanı sorgularını cache'ler
- API response'larını cache'ler
- Sayfa render sonuçlarını cache'ler

### 2. **Session Management**
- Kullanıcı oturumlarını saklar
- JWT token'ları saklar
- Distributed session storage

### 3. **Rate Limiting**
- API rate limiting
- Brute force koruması
- DDoS koruması

### 4. **Real-time Features**
- Chat uygulamaları
- Live notifications
- Real-time analytics

### 5. **Queue Management**
- Background job queues
- Task scheduling
- Message queues

### 6. **Leaderboards & Rankings**
- Oyun skorları
- Trending content
- Popular posts

---

## 🚀 Bu Projede Kullanım Senaryoları

### ✅ Kullanılabilir Senaryolar

#### 1. **Blog Post Caching** ⭐ ÖNERİLEN
```typescript
// Blog postlarını cache'le
// Key: blog:post:{slug}
// Value: JSON stringified post data
// TTL: 1 saat

// Avantajlar:
// - Blog listesi çok hızlı yüklenir
// - Veritabanı yükü azalır
// - Kullanıcı deneyimi artar
```

#### 2. **API Rate Limiting** ⭐ ÖNERİLEN
```typescript
// Contact form rate limiting
// Key: rate:contact:{ip}
// Value: request count
// TTL: 1 saat

// Avantajlar:
// - Spam koruması
// - API abuse önleme
// - Güvenlik
```

#### 3. **Session Storage** ⭐ ÖNERİLEN
```typescript
// User sessions
// Key: session:{userId}
// Value: session data
// TTL: 24 saat

// Avantajlar:
// - Distributed session
// - Hızlı erişim
// - Scalability
```

#### 4. **Analytics Caching**
```typescript
// Dashboard analytics
// Key: analytics:{date}
// Value: cached stats
// TTL: 5 dakika

// Avantajlar:
// - Dashboard hızlı yüklenir
// - Veritabanı sorguları azalır
```

#### 5. **Search Results Caching**
```typescript
// Blog search results
// Key: search:{query}
// Value: search results
// TTL: 10 dakika
```

#### 6. **Real-time Notifications**
```typescript
// Admin notifications
// Pub/Sub pattern
// Real-time updates
```

### ❌ Gerekli Olmayan Senaryolar

1. **Portfolio Data**: Statik veriler, cache'e gerek yok
2. **User Profiles**: Az sayıda kullanıcı, veritabanı yeterli
3. **Simple CRUD**: Basit işlemler için overkill

---

## 🛠️ Implementation Örneği

### 1. Redis Client Setup

```typescript
// src/lib/redis/client.ts
import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

export default redis;
```

### 2. Cache Service

```typescript
// src/lib/redis/cacheService.ts
import redis from './client';

export const cacheService = {
  // Get cached data
  get: async <T>(key: string): Promise<T | null> => {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  },

  // Set cached data
  set: async <T>(key: string, value: T, ttlSeconds?: number): Promise<void> => {
    const data = JSON.stringify(value);
    if (ttlSeconds) {
      await redis.setex(key, ttlSeconds, data);
    } else {
      await redis.set(key, data);
    }
  },

  // Delete cached data
  delete: async (key: string): Promise<void> => {
    await redis.del(key);
  },

  // Delete by pattern
  deletePattern: async (pattern: string): Promise<void> => {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  },
};
```

### 3. Blog Cache Hook

```typescript
// src/features/blog/hooks/useBlogCache.ts
import { useQuery } from '@tanstack/react-query';
import { cacheService } from '../../../lib/redis/cacheService';
import { blogService } from '../services/blogService';

export const useBlogPosts = () => {
  return useQuery({
    queryKey: ['blogPosts'],
    queryFn: async () => {
      // Try cache first
      const cached = await cacheService.get('blog:posts');
      if (cached) return cached;

      // Fetch from API
      const posts = await blogService.getPosts();
      
      // Cache for 1 hour
      await cacheService.set('blog:posts', posts, 3600);
      
      return posts;
    },
  });
};
```

### 4. Rate Limiting Middleware

```typescript
// src/api/middleware/rateLimiter.ts
import { cacheService } from '../../lib/redis/cacheService';

export const rateLimiter = async (
  key: string,
  maxRequests: number,
  windowSeconds: number
): Promise<boolean> => {
  const count = await cacheService.get<number>(key) || 0;
  
  if (count >= maxRequests) {
    return false; // Rate limit exceeded
  }
  
  await cacheService.set(key, count + 1, windowSeconds);
  return true; // Allowed
};
```

---

## 📦 Kurulum

### Backend (Node.js)

```bash
npm install ioredis
npm install @types/ioredis --save-dev
```

### Environment Variables

```env
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_password
REDIS_URL=redis://localhost:6379
```

### Docker ile Redis

```bash
docker run -d \
  --name redis \
  -p 6379:6379 \
  redis:alpine
```

### Cloud Options

1. **Redis Cloud** (Free tier: 30MB)
2. **Upstash** (Free tier: 10K commands/day)
3. **AWS ElastiCache**
4. **DigitalOcean Managed Redis**

---

## 💰 Maliyet Analizi

### Bu Proje İçin

**Küçük Ölçek (Başlangıç):**
- Upstash Free: $0 (10K commands/day)
- Redis Cloud Free: $0 (30MB)
- Self-hosted: $0 (kendi sunucunuzda)

**Orta Ölçek:**
- Upstash: ~$10/ay
- Redis Cloud: ~$10/ay
- Self-hosted: Sunucu maliyeti

**Büyük Ölçek:**
- Upstash: ~$50-100/ay
- Redis Cloud: ~$50-100/ay

---

## ✅ Öneri

### Bu Proje İçin Redis Kullanımı

**ÖNERİLEN ✅:**
1. ✅ Blog post caching (performans)
2. ✅ API rate limiting (güvenlik)
3. ✅ Session storage (scalability)

**OPSIYONEL:**
- Analytics caching (dashboard hızlandırma)
- Search results caching

**GEREKMEZ:**
- Portfolio data (statik)
- Simple CRUD operations

### Ne Zaman Kullanmalı?

**Şimdi Kullan:**
- Blog sistemi aktif olduğunda
- Yüksek trafik bekleniyorsa
- Real-time features gerekiyorsa

**Sonra Kullan:**
- Proje büyüdükçe
- Performans sorunları başladığında
- Scaling gerektiğinde

---

## 🎯 Sonuç

**Redis bu projede:**
- ✅ Blog caching için kullanılabilir
- ✅ Rate limiting için önerilir
- ✅ Session management için faydalı
- ⚠️ Şu an için zorunlu değil
- 💡 Gelecekte eklenebilir

**Alternatif:**
- Basit caching için: **Memory cache** (Node.js)
- Rate limiting için: **Express rate limit**
- Session için: **Database sessions**

Redis, proje büyüdükçe ve performans kritik hale geldikçe eklenebilir. Şu an için opsiyonel ama gelecek için planlanabilir.

