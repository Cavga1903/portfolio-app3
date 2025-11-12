/**
 * Contact Form Constants
 * Centralized constants for the contact form component
 */

// Validation constants
export const VALIDATION = {
  MIN_NAME_LENGTH: 2,
  MIN_MESSAGE_LENGTH: 10,
  MAX_MESSAGE_LENGTH: 1000,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;

// Timing constants (in milliseconds)
export const TIMING = {
  SUCCESS_MESSAGE_DURATION: 3000,
  ERROR_MESSAGE_DURATION: 5000,
  ANALYTICS_DEBOUNCE_DELAY: 1000,
} as const;

// CAPTCHA constants
export const CAPTCHA = {
  MIN_NUMBER: 1,
  MAX_NUMBER: 10,
} as const;

