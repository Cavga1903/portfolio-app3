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
- ✅ 3 dil desteği: **Türkçe**, **English**, **Deutsch**
- ✅ Otomatik tarayıcı dili algılama
- ✅ Dinamik dil değiştirme
- ✅ LocalStorage persistence

### 📈 **SEO & Marketing**
- ✅ Advanced SEO meta tags
- ✅ Open Graph & Twitter Cards
- ✅ JSON-LD Schema markup (Person, WebSite, ProfessionalService, BreadcrumbList)
- ✅ Canonical URLs
- ✅ Multi-language hreflang tags
- ✅ Dynamic meta tag updates

### 🌐 **Social Features**
- ✅ Social Proof section (GitHub, LinkedIn, Instagram)
- ✅ Share buttons (LinkedIn, X/Twitter, Facebook, WhatsApp)
- ✅ Copy link functionality
- ✅ Custom Toast notifications
- ✅ Social media integrations

### 📧 **Contact & Communication**
- ✅ EmailJS integration (direct email sending)
- ✅ Contact form with validation
- ✅ Social media links
- ✅ Buy Me a Coffee integration

### 🎯 **Additional Features**
- ✅ Experience Timeline
- ✅ Certificates & Achievements section
- ✅ Tech Stack with progress bars
- ✅ Project showcase with GitHub previews
- ✅ 404 Not Found page (jokey & animated)
- ✅ Progressive loading (Skeleton loaders)
- ✅ Scroll progress indicator
- ✅ Scroll to top button
- ✅ Typing animation (Hero section)

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
│   │   ├── AnimatedSection.tsx
│   │   ├── Certificates.tsx
│   │   ├── Contact.tsx
│   │   ├── Experience.tsx
│   │   ├── Footer.tsx
│   │   ├── Hero.tsx
│   │   ├── Navbar.tsx
│   │   ├── NotFound.tsx
│   │   ├── ParallaxBackground.tsx
│   │   ├── PortfolioShareCTA.tsx
│   │   ├── Projects.tsx
│   │   ├── ScrollProgress.tsx
│   │   ├── ScrollToTop.tsx
│   │   ├── SEOHead.tsx
│   │   ├── ShareButtons.tsx
│   │   ├── SkeletonLoader.tsx
│   │   ├── SocialProof.tsx
│   │   ├── Technologies.tsx
│   │   └── Toast.tsx
│   ├── hooks/
│   │   └── useToast.ts
│   ├── locales/
│   │   ├── tr/translation.json
│   │   ├── en/translation.json
│   │   └── de/translation.json
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

### **ShareButtons.tsx**
Social sharing functionality with modern toast notifications.

### **Experience.tsx**
Vertical timeline for work experience and education with animated dots.

### **Certificates.tsx**
Display achievements and certifications with stats cards.

### **Hero.tsx**
Landing section with parallax background, typing animation, and smooth scroll indicator.

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

### v3.0.0 (2025-01-10)
- ✨ Added Framer Motion animations
- ✨ Implemented smooth scroll & parallax effects
- ✨ Added SEO & Marketing features
- ✨ Created Social Proof section
- ✨ Implemented custom Toast notifications
- ✨ Added custom scrollbar
- ✨ i18n support (TR/EN/DE)
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

<div align="center">

**Made with ❤️ by Tolga Çavga**

</div>
