# 🚀 Tolga Çavga | Modern Portfolio Website

<div align="center">

![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4.17-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-11.15-FF0055?style=for-the-badge&logo=framer&logoColor=white)

**Modern, responsive ve feature-rich personal portfolio website**

[Live Demo](https://www.tolgacavga.com) • [GitHub](https://github.com/Cavga1903/portfolio-app3) • [LinkedIn](https://linkedin.com/in/tolgaacavgaa)

</div>

---

## ✨ Öne Çıkan Özellikler

### 🎨 **Modern UI/UX**
- ✅ Glassmorphism design
- ✅ Gradient backgrounds & animations
- ✅ Custom scrollbar (Blue/Purple/Pink gradient)
- ✅ Smooth scroll behavior
- ✅ Responsive design (Mobile, Tablet, Desktop)

### 🎭 **Animations & Effects**
- ✅ **Framer Motion** animations
- ✅ Parallax scrolling effects
- ✅ Scroll-triggered animations
- ✅ Staggered animations
- ✅ Hover & focus states
- ✅ Spring physics animations
- ✅ Page transitions

### 🌍 **Internationalization (i18n)**
- ✅ 4 dil desteği: **Türkçe**, **English**, **Deutsch**, **Azərbaycan Türkcəsi** 🇦🇿
- ✅ Otomatik tarayıcı dili algılama
- ✅ Dinamik dil değiştirme
- ✅ LocalStorage persistence
- ✅ Browser language detection (TR → Turkish, DE → German, AZ → Azerbaijani, Others → English)

### 📈 **SEO & Marketing**
- ✅ Advanced SEO meta tags
- ✅ Open Graph & Twitter Cards
- ✅ JSON-LD Schema markup (Person, WebSite, ProfessionalService, BreadcrumbList)
- ✅ Canonical URLs
- ✅ Multi-language hreflang tags
- ✅ Dynamic meta tag updates

### ❤️ **Social Features**
- ✅ **Real-time project likes** with Firebase Firestore
- ✅ **Social interaction** tracking
- ✅ **Detailed analytics** for engagement
- ✅ **Toast notifications** for user feedback
- ✅ **Persistent like states** across sessions

### 🌐 **Social Features**
- ✅ Dedicated Social Proof section (GitHub, LinkedIn, Instagram stats & links)
- ✅ Portfolio share buttons (LinkedIn, X/Twitter, Facebook, WhatsApp)
- ✅ Copy link functionality with custom toast
- ✅ Social media cards with animated hover effects
- ✅ Buy Me a Coffee integration in footer

### 📧 **Contact & Communication**
- ✅ EmailJS integration (direct email sending)
- ✅ Contact form with validation
- ✅ Multi-language email template support
- ✅ Real-time form status feedback
- ✅ Buy Me a Coffee integration (Footer)

### 📊 **Analytics & Tracking**
- ✅ Google Analytics 4 (GA4) integration
- ✅ Google Tag Manager (GTM) setup
- ✅ Comprehensive event tracking
- ✅ User behavior analysis
- ✅ Performance monitoring
- ✅ Conversion tracking
- ✅ Scroll depth tracking
- ✅ Click pattern analysis
- ✅ Form interaction tracking
- ✅ Project engagement metrics
- ✅ Real-time analytics dashboard

### 🎯 **Additional Features**
- ✅ Experience Timeline with animated dots
- ✅ Certificates & Achievements section
- ✅ Tech Stack with progress bars
- ✅ Services section (B2B & B2C)
- ✅ Project showcase with carousel (11 projects)
- ✅ Touch/swipe navigation for mobile
- ✅ 404 Not Found page (jokey & animated)
- ✅ Progressive loading (Skeleton loaders)
- ✅ Scroll progress indicator
- ✅ Scroll to top button
- ✅ Typing animation (Hero section)
- ✅ Dynamic CV generation (PDF download)
- ✅ Buy Me a Coffee integration

---

## 🛠️ Tech Stack

### **Core Technologies**
- **React 18.3.1** - UI library
- **TypeScript 5.6.2** - Type safety
- **Vite 6.3.2** - Build tool
- **TailwindCSS 3.4.17** - Utility-first CSS

### **Libraries & Frameworks**
- **Framer Motion 11.15.0** - Animations
- **React Router DOM 7.1.1** - Routing
- **React i18next 15.2.0** - Internationalization
- **EmailJS Browser 4.4.1** - Email service
- **React Type Animation 3.2.0** - Typing effects
- **React Icons 5.4.0** - Icon library
- **DaisyUI 4.12.23** - UI components
- **jsPDF** - PDF generation
- **html2canvas** - HTML to canvas conversion

### **Development Tools**
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

---

## 📂 Project Structure

```
portfolio-app3-main/
├── public/
│   ├── favicon.svg
│   ├── robots.txt
│   ├── sitemap.xml
│   ├── _redirects (Netlify)
│   └── vercel.json (Vercel)
├── src/
│   ├── components/
│   │   ├── About.tsx
│   │   ├── Certificates.tsx
│   │   ├── Contact.tsx
│   │   ├── DynamicCV.tsx
│   │   ├── Experience.tsx
│   │   ├── Footer.tsx
│   │   ├── Hero.tsx
│   │   ├── Navbar.tsx
│   │   ├── NotFound.tsx
│   │   ├── PortfolioShareCTA.tsx
│   │   ├── Projects.tsx
│   │   ├── ScrollProgress.tsx
│   │   ├── ScrollToTop.tsx
│   │   ├── SEOHead.tsx
│   │   ├── Services.tsx
│   │   ├── SkeletonLoader.tsx
│   │   ├── SocialProof.tsx
│   │   ├── Technologies.tsx
│   │   └── Toast.tsx
│   ├── hooks/
│   │   ├── useAdvancedClickTracking.ts
│   │   ├── useAnalytics.ts
│   │   ├── useConversionTracking.ts
│   │   ├── usePerformanceTracking.ts
│   │   ├── useScrollTracking.ts
│   │   ├── useTimeTracking.ts
│   │   ├── useToast.ts
│   │   └── useUserBehaviorTracking.ts
│   ├── locales/
│   │   ├── tr/translation.json
│   │   ├── en/translation.json
│   │   ├── de/translation.json
│   │   └── az/translation.json
│   ├── pages/
│   │   └── Home.tsx
│   ├── App.tsx
│   ├── main.tsx
│   ├── i18n.ts
│   └── index.css
├── .env (EmailJS credentials)
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🚀 Getting Started

### **Prerequisites**
- Node.js (v18 or higher)
- npm or yarn

### **Installation**

1. **Clone the repository**
```bash
git clone https://github.com/Cavga1903/portfolio-app3.git
cd portfolio-app3
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env` file in the root directory:
```env
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

4. **Run development server**
```bash
npm run dev
```

5. **Build for production**
```bash
npm run build
```

6. **Preview production build**
```bash
npm run preview
```

---

## 🎨 Key Components

### **SEOHead.tsx**
Dynamic SEO meta tags, Open Graph, Twitter Cards, and JSON-LD schema markup.

### **Toast.tsx**
Custom notification system with Framer Motion animations and theme-matching design.

### **SocialProof.tsx**
Showcase social media presence with animated cards (GitHub, LinkedIn, Instagram).

### **PortfolioShareCTA.tsx**
Social sharing functionality with modern toast notifications and copy link feature.

### **Experience.tsx**
Vertical timeline for work experience and education with animated dots and hover effects.

### **Certificates.tsx**
Display achievements and certifications with stats cards and animations.

### **Services.tsx**
B2B and B2C services showcase with animated cards and hover effects.

### **Projects.tsx**
Interactive project carousel with 11 projects, touch/swipe navigation, and clickable cards.

### **Technologies.tsx**
Tech stack display with progress bars and animated cards.

### **DynamicCV.tsx**
Dynamic CV generation with PDF download and print functionality.

### **Hero.tsx**
Landing section with parallax background, multi-language typing animation (TR/EN/DE/AZ), and smooth scroll indicator.

### **Contact.tsx**
Streamlined contact form with EmailJS integration. Direct email sending with multi-language support. Clean, focused UI without redundant social media links.

### **Analytics Hooks**
- **useAnalytics.ts** - Main analytics tracking
- **useScrollTracking.ts** - Scroll depth and section tracking
- **useTimeTracking.ts** - Page time tracking
- **usePerformanceTracking.ts** - Performance metrics
- **useUserBehaviorTracking.ts** - User behavior analysis
- **useAdvancedClickTracking.ts** - Advanced click tracking
- **useConversionTracking.ts** - Conversion tracking

---

## 📊 Analytics Features

### **Event Tracking**
- **Page Views** - Page visits and navigation
- **Section Views** - Which sections users visit
- **Scroll Depth** - 25%, 50%, 75%, 100% milestones
- **Click Events** - All button and link clicks
- **Form Interactions** - Field changes, submissions, errors
- **Project Clicks** - GitHub and demo link clicks
- **Language Changes** - Language switching tracking
- **Carousel Interactions** - Navigation, swipe, dot clicks
- **Social Media Clicks** - GitHub, LinkedIn, Instagram
- **CV Downloads** - PDF download tracking
- **Contact Form** - Form submissions and completions

### **Performance Metrics**
- **Core Web Vitals** - LCP, FID, CLS tracking
- **Page Load Time** - Performance monitoring
- **Memory Usage** - Browser memory tracking
- **Network Info** - Connection speed and type
- **Device Info** - Screen size, platform, language

### **User Behavior Analysis**
- **Mouse Movement** - Movement patterns and speed
- **Click Patterns** - Click frequency and positions
- **Keyboard Activity** - Keystroke tracking
- **Scroll Behavior** - Scroll patterns and depth
- **Engagement Score** - Calculated user engagement
- **Session Duration** - Time spent on site
- **Idle Time** - User inactivity tracking

### **Conversion Tracking**
- **CV Downloads** - Purchase events for CV downloads
- **Contact Submissions** - Lead generation tracking
- **Project Interactions** - Engagement value scoring
- **Social Media Clicks** - Social engagement tracking
- **Buy Me a Coffee** - Purchase intent tracking
- **Section Engagement** - Time spent in sections
- **Scroll Milestones** - Engagement progression

---

## 🌐 Deployment

### **Vercel** (Recommended)
```bash
vercel --prod
```

### **Netlify**
```bash
netlify deploy --prod
```

### **GitHub Pages**
```bash
npm run build
# Deploy dist/ folder
```

---

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

---

## 🎯 Browser Support

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Opera

---

## 📊 Performance

- ⚡ Lighthouse Score: 95+
- 🚀 Fast load times with lazy loading
- 📦 Code splitting
- 🎨 Optimized animations
- 💾 Cached assets

---

## 🔒 Security

- ✅ Environment variables for sensitive data
- ✅ HTTPS only
- ✅ No exposed API keys
- ✅ Secure EmailJS integration

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Author

**Tolga Çavga**
- Website: [www.tolgacavga.com](https://www.tolgacavga.com)
- GitHub: [@Cavga1903](https://github.com/Cavga1903)
- LinkedIn: [tolgaacavgaa](https://linkedin.com/in/tolgaacavgaa)
- Instagram: [@codewithcavga](https://instagram.com/codewithcavga)
- Email: cavgaa228@gmail.com

---

## 💖 Support

If you like this project, please consider:
- ⭐ Starring the repository
- 🔗 Sharing with others
- ☕ [Buying me a coffee](https://buymeacoffee.com/cavga228)

---

## 📜 Changelog

### v3.3.0 (2025-01-10)
- 📊 **Comprehensive Analytics System** - Google Analytics 4 + GTM integration
- 🎯 **Advanced Tracking** - 50+ event types, user behavior analysis
- 🚀 **Performance Monitoring** - Core Web Vitals, memory usage, network info
- 💰 **Conversion Tracking** - CV downloads, contact forms, project interactions
- 🖱️ **Click Analytics** - Button, form, link, component click tracking
- 📈 **Real-time Dashboard** - Live analytics data in Google Analytics
- 🎨 **Project Carousel** - 11 projects with touch/swipe navigation
- 🎯 **Clickable Project Cards** - Full card clickable, GitHub integration
- 🛠️ **Services Section** - B2B & B2C services showcase
- 📄 **Dynamic CV** - PDF generation with jsPDF + html2canvas
- ☕ **Buy Me a Coffee** - Integration in footer
- 🔧 **Performance Optimization** - useCallback hooks, memory cleanup

### v3.2.0 (2025-01-10)
- 🎨 **Project UI Improvements** - GitHub icon top-right, details bottom-right
- 🎯 **Enhanced UX** - Better visual hierarchy, cleaner design
- 🔧 **Code Optimization** - TypeScript fixes, performance improvements

### v3.1.0 (2025-01-10)
- 🌍 **Azerbaijani language support** - Azərbaycan Türkcəsi added
- ♻️ **Streamlined Contact section** - Removed redundant social media buttons, focused on email form
- 🎨 **Multi-language typing animation** - Hero section supports TR/EN/DE/AZ
- ✨ **Enhanced i18n** - Browser language auto-detection (TR/DE/AZ → respective languages, Others → EN)
- 📧 **Improved EmailJS** - Multi-language template support
- 🎯 **Better UX** - Cleaner, more focused contact form

### v3.0.0 (2025-01-10)
- ✨ Added Framer Motion animations
- ✨ Implemented smooth scroll & parallax effects
- ✨ Added SEO & Marketing features
- ✨ Created Social Proof section
- ✨ Implemented custom Toast notifications
- ✨ Added custom scrollbar
- ✨ i18n support (TR/EN/DE) - 3 languages
- ✨ Experience Timeline
- ✨ Certificates section
- ✨ 404 Not Found page
- ✨ Progressive loading
- 🐛 Multiple bug fixes
- 🎨 UI/UX improvements

### v2.0.0
- ✨ TypeScript migration
- ✨ TailwindCSS integration
- ✨ Responsive design

### v1.0.0
- 🎉 Initial release

---

## 🚀 Kurulum

### Gereksinimler
- Node.js (v18+)
- npm veya yarn
- Firebase hesabı (social features için)

### Adımlar
1. **Repository'yi klonlayın:**
   ```bash
   git clone https://github.com/Cavga1903/portfolio-app3.git
   cd portfolio-app3
   ```

2. **Dependencies'leri yükleyin:**
   ```bash
   npm install
   ```

3. **Firebase Kurulumu (Opsiyonel - Social Features için):**
   ```bash
   # Firebase projesi oluşturun: https://console.firebase.google.com
   # Firestore Database'i etkinleştirin
   # firebase-setup.md dosyasındaki talimatları takip edin
   # .env dosyası oluşturun:
   cp env.example .env
   # .env dosyasını düzenleyin ve Firebase bilgilerinizi ekleyin
   ```

4. **Development server'ı başlatın:**
   ```bash
   npm run dev
   ```

5. **Build için:**
   ```bash
   npm run build
   ```

### Firebase Kurulum Detayları
1. [Firebase Console](https://console.firebase.google.com) hesabı oluşturun
2. Yeni proje oluşturun
3. Firestore Database'i etkinleştirin (test mode)
4. `firebase-setup.md` dosyasındaki talimatları takip edin
5. Project Settings > General > Your apps > Web app'i ekleyin
6. `.env` dosyasına Firebase config bilgilerini ekleyin:
   ```
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your-project-id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
   REACT_APP_FIREBASE_APP_ID=your-app-id
   ```

---

<div align="center">

**Made with ❤️ by Tolga Çavga**

</div>
