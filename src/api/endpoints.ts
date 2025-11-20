// API Endpoints
export const endpoints = {
  // Auth
  auth: {
    login: '/auth/login',
    signup: '/auth/signup',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    me: '/auth/me',
  },
  
  // Blog
  blog: {
    posts: '/blog/posts',
    post: (slug: string) => `/blog/posts/${slug}`,
    create: '/blog/posts',
    update: (id: string) => `/blog/posts/${id}`,
    delete: (id: string) => `/blog/posts/${id}`,
  },
  
  // Admin
  admin: {
    stats: '/admin/stats',
    users: '/admin/users',
    analytics: '/admin/analytics',
    analyticsCountries: '/api/analytics/countries',
  },
  
  // Contact
  contact: {
    send: '/contact/send',
  },
} as const;

