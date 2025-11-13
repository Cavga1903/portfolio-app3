import React, { Suspense, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FaArrowLeft } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import { LoginModal, SignupModal } from '../features/auth';
import SkeletonLoader from '../components/SkeletonLoader';

// Lazy load blog components
const BlogPostContent = React.lazy(() => import('../features/blog/components/BlogPostContent'));
const RelatedPosts = React.lazy(() => import('../features/blog/components/RelatedPosts'));

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-black">
      <Navbar onLoginClick={() => setShowLoginModal(true)} />
      
      {/* Header */}
      <section className="relative py-12 md:py-16 px-6 md:px-8 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate('/blog')}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-8"
          >
            <FaArrowLeft />
            <span>{t('blog.backToBlog') || 'Back to Blog'}</span>
          </motion.button>
        </div>
      </section>

      {/* Post Content */}
      <section className="pb-12 px-6 md:px-8 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <Suspense fallback={<SkeletonLoader type="projects" />}>
            <BlogPostContent slug={slug || ''} />
          </Suspense>
        </div>
      </section>

      {/* Related Posts */}
      <section className="py-12 px-6 md:px-8 lg:px-12 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <Suspense fallback={<SkeletonLoader type="projects" />}>
            <RelatedPosts currentSlug={slug || ''} />
          </Suspense>
        </div>
      </section>

      {/* Auth Modals */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToSignup={() => {
          setShowLoginModal(false);
          setShowSignupModal(true);
        }}
      />
      <SignupModal
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        onSwitchToLogin={() => {
          setShowSignupModal(false);
          setShowLoginModal(true);
        }}
      />
    </div>
  );
};

export default BlogPost;

