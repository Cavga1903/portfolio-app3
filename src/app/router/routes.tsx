import { lazy } from 'react';
import { PrivateRoute } from './PrivateRoute';

// Lazy load pages
const Home = lazy(() => import('../../pages/Home'));
const Blog = lazy(() => import('../../pages/Blog'));
const BlogPost = lazy(() => import('../../pages/BlogPost'));
const AdminBlogManagement = lazy(() => import('../../pages/Admin/BlogManagement'));
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
    path: '/admin',
    element: (
      <PrivateRoute requiredRole="admin">
        <AdminBlogManagement />
      </PrivateRoute>
    ),
    public: false,
  },
  {
    path: '/admin/blog',
    element: (
      <PrivateRoute requiredRole="admin">
        <AdminBlogManagement />
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

