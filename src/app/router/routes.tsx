import { lazy } from 'react';
import { PrivateRoute } from './PrivateRoute';

// Lazy load pages
const Home = lazy(() => import('../../pages/Home'));
const Blog = lazy(() => import('../../pages/Blog'));
const BlogPost = lazy(() => import('../../pages/BlogPost'));
const Sitemap = lazy(() => import('../../pages/Sitemap'));
const AdminDashboard = lazy(() => import('../../pages/Admin/Dashboard'));
const NotFound = lazy(() => import('../../components/NotFound'));

export const routes = [
  {
    path: '/',
    element: <Home />,
    public: true,
  },
  {
    path: '/blog',
    element: <Blog />,
    public: true,
  },
  {
    path: '/blog/:slug',
    element: <BlogPost />,
    public: true,
  },
  {
    path: '/sitemap.xml',
    element: <Sitemap />,
    public: true,
  },
  {
    path: '/admin',
    element: (
      <PrivateRoute>
        <AdminDashboard />
      </PrivateRoute>
    ),
    public: false,
  },
  {
    path: '/admin/dashboard',
    element: (
      <PrivateRoute>
        <AdminDashboard />
      </PrivateRoute>
    ),
    public: false,
  },
  {
    path: '*',
    element: <NotFound />,
    public: true,
  },
];

