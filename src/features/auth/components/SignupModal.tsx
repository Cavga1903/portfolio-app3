import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../app/store/authStore';
import { useTranslation } from 'react-i18next';
import { FaTimes, FaGoogle, FaGithub } from 'react-icons/fa';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export const SignupModal: React.FC<SignupModalProps> = ({
  isOpen,
  onClose,
  onSwitchToLogin,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { signup, loginWithGoogle, isLoading } = useAuthStore();
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = React.useState('');
  const [fieldErrors, setFieldErrors] = React.useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [navbarHeight, setNavbarHeight] = React.useState(64);

  React.useEffect(() => {
    // Navbar yüksekliğini dinamik olarak hesapla
    const calculateNavbarHeight = () => {
      const navbar = document.querySelector('nav');
      if (navbar) {
        setNavbarHeight(navbar.offsetHeight);
      }
    };
    
    calculateNavbarHeight();
    
    // Modal açıldığında ve window resize olduğunda tekrar hesapla
    if (isOpen) {
      window.addEventListener('resize', calculateNavbarHeight);
      return () => window.removeEventListener('resize', calculateNavbarHeight);
    }
  }, [isOpen]);

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'name':
        if (!value.trim()) {
          return t('auth.nameRequired') || 'Name is required';
        }
        if (value.trim().length < 2) {
          return t('auth.nameTooShort') || 'Name must be at least 2 characters';
        }
        return '';
      case 'email': {
        if (!value) {
          return t('auth.emailRequired') || 'Email is required';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return t('auth.emailInvalid') || 'Please enter a valid email address';
        }
        // Check domain
        if (!value.toLowerCase().endsWith('@cavgalabs.com')) {
          return t('auth.emailDomainNotAllowed') || 'Sadece @cavgalabs.com domainine sahip e-posta adresleri ile kayıt olabilirsiniz.';
        }
        return '';
      }
      case 'password':
        if (!value) {
          return t('auth.passwordRequired') || 'Password is required';
        }
        if (value.length < 6) {
          return t('auth.passwordTooShort') || 'Password must be at least 6 characters';
        }
        return '';
      case 'confirmPassword':
        if (!value) {
          return t('auth.confirmPasswordRequired') || 'Please confirm your password';
        }
        if (value !== formData.password) {
          return t('auth.passwordMismatch') || 'Passwords do not match';
        }
        return '';
      default:
        return '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const errors = {
      name: validateField('name', formData.name),
      email: validateField('email', formData.email),
      password: validateField('password', formData.password),
      confirmPassword: validateField('confirmPassword', formData.confirmPassword),
    };
    
    setFieldErrors(errors);
    
    if (errors.name || errors.email || errors.password || errors.confirmPassword) {
      return;
    }

    try {
      await signup(formData.email, formData.password, formData.name);
      onClose();
      // Redirect to dashboard after signup
      setTimeout(() => {
        navigate('/admin');
      }, 100);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t('auth.signupError') || 'Signup failed';
      setError(errorMessage);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (fieldErrors[name as keyof typeof fieldErrors]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setFieldErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - Below navbar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed left-0 right-0 bottom-0 bg-black/50 backdrop-blur-md z-[9998]"
            style={{ 
              pointerEvents: 'auto',
              top: `${navbarHeight}px` // Navbar yüksekliği kadar
            }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[10000] flex items-center justify-center p-4 pointer-events-none"
            style={{ pointerEvents: 'auto' }}
          >
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-6xl overflow-hidden relative border border-gray-200 dark:border-gray-800">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-2"
              >
                <FaTimes className="w-5 h-5" />
              </button>

              <div className="flex flex-col lg:flex-row min-h-[600px]">
                {/* Left Side - Illustration */}
                <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-12 flex-col justify-center items-center text-white relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="relative z-10 text-center">
                    <div className="text-6xl mb-6">🚀</div>
                    <h2 className="text-4xl font-bold mb-4">
                      {t('auth.welcome') || 'Welcome!'}
                    </h2>
                    <p className="text-xl text-white/90">
                      {t('auth.joinUs') || 'Join us and start your journey'}
                    </p>
                  </div>
                  {/* Decorative circles */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
                </div>

                {/* Right Side - Form */}
                <div className="w-full lg:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                  {/* Header */}
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {t('auth.signup') || 'Sign Up'}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      {t('auth.signupSubtitle') || 'Create your account to get started'}
                    </p>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                        {error}
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('auth.name') || 'Name'}
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full px-4 py-3 bg-white dark:bg-gray-800 border rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                          fieldErrors.name
                            ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                            : 'border-gray-300 dark:border-gray-700 focus:ring-blue-500 focus:border-transparent'
                        }`}
                        placeholder={t('auth.namePlaceholder') || 'Your name'}
                      />
                      {fieldErrors.name && (
                        <div className="mt-2 flex items-start gap-2 text-sm text-red-600 dark:text-red-400">
                          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          <span>{fieldErrors.name}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('auth.email') || 'Email'}
                      </label>
                      <input
                        type="text"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full px-4 py-3 bg-white dark:bg-gray-800 border rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                          fieldErrors.email
                            ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                            : 'border-gray-300 dark:border-gray-700 focus:ring-blue-500 focus:border-transparent'
                        }`}
                        placeholder={t('auth.emailPlaceholder') || 'your@email.com'}
                      />
                      {fieldErrors.email && (
                        <div className="mt-2 flex items-start gap-2 text-sm text-red-600 dark:text-red-400">
                          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          <span>{fieldErrors.email}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('auth.password') || 'Password'}
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full px-4 py-3 bg-white dark:bg-gray-800 border rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                          fieldErrors.password
                            ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                            : 'border-gray-300 dark:border-gray-700 focus:ring-blue-500 focus:border-transparent'
                        }`}
                        placeholder={t('auth.passwordPlaceholder') || '••••••••'}
                      />
                      {fieldErrors.password && (
                        <div className="mt-2 flex items-start gap-2 text-sm text-red-600 dark:text-red-400">
                          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          <span>{fieldErrors.password}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('auth.confirmPassword') || 'Confirm Password'}
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full px-4 py-3 bg-white dark:bg-gray-800 border rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                          fieldErrors.confirmPassword
                            ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                            : 'border-gray-300 dark:border-gray-700 focus:ring-blue-500 focus:border-transparent'
                        }`}
                        placeholder={t('auth.passwordPlaceholder') || '••••••••'}
                      />
                      {fieldErrors.confirmPassword && (
                        <div className="mt-2 flex items-start gap-2 text-sm text-red-600 dark:text-red-400">
                          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          <span>{fieldErrors.confirmPassword}</span>
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                    >
                      {isLoading
                        ? t('auth.loading') || 'Loading...'
                        : t('auth.signup') || 'Sign Up'}
                    </button>
                  </form>

                  {/* Divider */}
                  <div className="flex items-center my-6">
                    <div className="flex-1 border-t border-gray-300 dark:border-gray-700"></div>
                    <span className="px-4 text-sm text-gray-500 dark:text-gray-400">
                      {t('auth.or') || 'or'}
                    </span>
                    <div className="flex-1 border-t border-gray-300 dark:border-gray-700"></div>
                  </div>

                  {/* Social Login */}
                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          await loginWithGoogle();
                          onClose();
                          // Redirect to dashboard after signup
                          setTimeout(() => {
                            navigate('/admin');
                          }, 100);
                        } catch (error) {
                          const errorMessage = error instanceof Error ? error.message : t('auth.googleSignupError') || 'Google sign up failed';
                          setError(errorMessage);
                        }
                      }}
                      disabled={isLoading}
                      className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaGoogle className="w-5 h-5" />
                      <span>{isLoading ? t('auth.loading') || 'Loading...' : t('auth.signupWithGoogle') || 'Sign up with Google'}</span>
                    </button>
                    <button
                      type="button"
                      className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                    >
                      <FaGithub className="w-5 h-5" />
                      <span>{t('auth.signupWithGitHub') || 'Sign up with GitHub'}</span>
                    </button>
                  </div>

                  {/* Switch to Login */}
                  <div className="mt-6 text-center">
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {t('auth.haveAccount') || 'Already have an account?'}{' '}
                      <button
                        onClick={onSwitchToLogin}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                      >
                        {t('auth.login') || 'Sign in'}
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

