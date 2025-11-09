/**
 * Contact Form Validation Utilities
 * Reusable validation functions for form fields
 */

import { VALIDATION } from './constants';

/**
 * Validates email format using regex
 * @param email - Email address to validate
 * @returns true if email format is valid
 */
export const validateEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') {
    return false;
  }
  return VALIDATION.EMAIL_REGEX.test(email.trim());
};

/**
 * Validates name length
 * @param name - Name to validate
 * @returns true if name meets minimum length requirement
 */
export const validateName = (name: string): boolean => {
  if (!name || typeof name !== 'string') {
    return false;
  }
  return name.trim().length >= VALIDATION.MIN_NAME_LENGTH;
};

/**
 * Validates message length
 * @param message - Message to validate
 * @returns true if message meets length requirements
 */
export const validateMessage = (message: string): boolean => {
  if (!message || typeof message !== 'string') {
    return false;
  }
  const trimmed = message.trim();
  return (
    trimmed.length >= VALIDATION.MIN_MESSAGE_LENGTH &&
    trimmed.length <= VALIDATION.MAX_MESSAGE_LENGTH
  );
};

/**
 * Validates CAPTCHA answer
 * @param userAnswer - User's answer to CAPTCHA
 * @param correctAnswer - Correct answer to CAPTCHA
 * @returns true if answers match
 */
export const validateCaptcha = (userAnswer: number, correctAnswer: number): boolean => {
  return userAnswer === correctAnswer;
};

/**
 * Get validation error message key for a field
 * @param fieldName - Name of the field
 * @param value - Current value of the field
 * @returns Error message key or null if valid
 */
export const getValidationError = (
  fieldName: 'name' | 'email' | 'message',
  value: string
): string | null => {
  const trimmed = value.trim();

  switch (fieldName) {
    case 'name':
      if (!trimmed) {
        return 'contact.form.errors.nameRequired';
      }
      if (!validateName(value)) {
        return 'contact.form.errors.nameMinLength';
      }
      return null;

    case 'email':
      if (!trimmed) {
        return 'contact.form.errors.emailRequired';
      }
      if (!validateEmail(value)) {
        return 'contact.form.errors.emailInvalid';
      }
      return null;

    case 'message':
      if (!trimmed) {
        return 'contact.form.errors.messageRequired';
      }
      if (!validateMessage(value)) {
        if (trimmed.length < VALIDATION.MIN_MESSAGE_LENGTH) {
          return 'contact.form.errors.messageMinLength';
        }
        return 'contact.form.errors.messageMaxLength';
      }
      return null;

    default:
      return null;
  }
};

