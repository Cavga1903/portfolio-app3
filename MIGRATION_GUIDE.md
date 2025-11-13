# 🔄 Migration Guide: Component-Based to Feature-Based Architecture

## 📋 Adım Adım Geçiş Planı

### Phase 1: Foundation Setup (1-2 gün)

#### 1.1. Gerekli Paketleri Yükle
```bash
npm install zustand axios @tanstack/react-query react-hook-form zod @hookform/resolvers
```

#### 1.2. Klasör Yapısını Oluştur
```bash
mkdir -p src/app/{store,router,providers}
mkdir -p src/features/{auth,blog,admin,portfolio,shared}
mkdir -p src/api
mkdir -p src/pages/Admin
```

#### 1.3. Store'u Kur
- `src/app/store/authStore.ts` ✅ (oluşturuldu)
- `src/app/store/uiStore.ts` (toast, modal state için)

#### 1.4. API Client'ı Kur
- `src/api/client.ts` oluştur
- `src/api/endpoints.ts` oluştur

---

### Phase 2: Mevcut Componentleri Taşı (2-3 gün)

#### 2.1. Portfolio Feature'ına Taşı
```bash
# Mevcut componentler
src/components/Hero.tsx → src/features/portfolio/components/Hero/
src/components/About.tsx → src/features/portfolio/components/About/
src/components/Experience.tsx → src/features/portfolio/components/Experience/
src/components/Technologies.tsx → src/features/portfolio/components/Technologies/
src/components/Services.tsx → src/features/portfolio/components/Services/
src/components/Projects.tsx → src/features/portfolio/components/Projects/
src/components/Certificates.tsx → src/features/portfolio/components/Certificates/
src/components/Contact.tsx → src/features/portfolio/components/Contact/
```

#### 2.2. Shared Components
```bash
src/components/Navbar.tsx → src/features/shared/components/layout/Navbar/
src/components/Footer.tsx → src/features/shared/components/layout/Footer/
src/components/Toast.tsx → src/features/shared/components/ui/Toast/
src/components/ScrollToTop.tsx → src/features/shared/components/ui/ScrollToTop/
```

---

### Phase 3: Auth Sistemi (2-3 gün)

#### 3.1. Auth Store ✅ (oluşturuldu)
#### 3.2. Login Modal ✅ (oluşturuldu)
#### 3.3. Signup Modal (LoginModal'a benzer)
#### 3.4. Auth Service
```typescript
// src/features/auth/services/authService.ts
import apiClient from '../../../api/client';

export const authService = {
  login: async (email: string, password: string) => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },
  signup: async (email: string, password: string, name: string) => {
    const response = await apiClient.post('/auth/signup', { email, password, name });
    return response.data;
  },
  logout: async () => {
    await apiClient.post('/auth/logout');
  },
};
```

#### 3.5. Navbar'a Login/Signup Butonları Ekle

---

### Phase 4: Blog Sistemi (3-4 gün)

#### 4.1. Blog Types
```typescript
// src/features/blog/types/blog.types.ts
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  tags: string[];
  image?: string;
}
```

#### 4.2. Blog Service
```typescript
// src/features/blog/services/blogService.ts
import apiClient from '../../../api/client';
import { BlogPost } from '../types/blog.types';

export const blogService = {
  getPosts: async (): Promise<BlogPost[]> => {
    const response = await apiClient.get('/blog/posts');
    return response.data;
  },
  getPost: async (slug: string): Promise<BlogPost> => {
    const response = await apiClient.get(`/blog/posts/${slug}`);
    return response.data;
  },
  createPost: async (post: Partial<BlogPost>): Promise<BlogPost> => {
    const response = await apiClient.post('/blog/posts', post);
    return response.data;
  },
};
```

#### 4.3. Blog Pages
- `src/pages/Blog.tsx` - Blog list
- `src/pages/BlogPost.tsx` - Single post

---

### Phase 5: Admin Panel (4-5 gün)

#### 5.1. Admin Layout
```typescript
// src/pages/Admin/Layout.tsx
// Sidebar + Header + Content area
```

#### 5.2. Dashboard
- Stats cards
- Analytics charts
- Recent activity

#### 5.3. Blog Management
- List posts
- Create/Edit post
- Delete post

---

## 🔧 App.tsx Güncellemesi

```typescript
// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { routes } from './app/router/routes';
import { AppProvider } from './app/providers/AppProvider';

const App: React.FC = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={route.element}
            />
          ))}
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;
```

---

## 📝 Checklist

### Foundation
- [ ] Zustand kuruldu
- [ ] API client kuruldu
- [ ] Router yapısı hazır
- [ ] Auth store hazır

### Migration
- [ ] Portfolio components taşındı
- [ ] Shared components taşındı
- [ ] Home.tsx güncellendi

### Features
- [ ] Auth sistemi çalışıyor
- [ ] Blog sistemi çalışıyor
- [ ] Admin panel çalışıyor

### Testing
- [ ] Her feature test edildi
- [ ] Routing test edildi
- [ ] Auth flow test edildi

---

## ⚠️ Dikkat Edilmesi Gerekenler

1. **Lazy Loading**: Tüm yeni sayfalar lazy load edilmeli
2. **Type Safety**: Her feature kendi types'ına sahip olmalı
3. **Error Handling**: API hataları için global error handler
4. **Loading States**: Her async işlem için loading state
5. **Code Splitting**: Her feature ayrı bundle olmalı

---

## 🚀 Hızlı Başlangıç

1. Paketleri yükle: `npm install zustand axios @tanstack/react-query`
2. Klasörleri oluştur (yukarıdaki komutlar)
3. Store'ları kur
4. API client'ı kur
5. İlk feature'ı (auth) implement et
6. Test et ve devam et

