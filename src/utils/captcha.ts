/**
 * CAPTCHA Utility Functions
 * Simple math-based CAPTCHA for spam protection
 */

import { CAPTCHA } from './constants';

export interface CaptchaChallenge {
  question: string;
  answer: number;
}

/**
 * Generates a random CAPTCHA challenge (simple math problem)
 * @returns Object containing question and answer
 */
export const generateCaptcha = (): CaptchaChallenge => {
  const num1 = Math.floor(Math.random() * (CAPTCHA.MAX_NUMBER - CAPTCHA.MIN_NUMBER + 1)) + CAPTCHA.MIN_NUMBER;
  const num2 = Math.floor(Math.random() * (CAPTCHA.MAX_NUMBER - CAPTCHA.MIN_NUMBER + 1)) + CAPTCHA.MIN_NUMBER;
  const operations = ['+', '-', '*'] as const;
  const operation = operations[Math.floor(Math.random() * operations.length)];

  let answer: number;
  let question: string;

  switch (operation) {
    case '+':
      answer = num1 + num2;
      question = `${num1} + ${num2}`;
      break;
    case '-':
      // Ensure positive result
      const larger = Math.max(num1, num2);
      const smaller = Math.min(num1, num2);
      answer = larger - smaller;
      question = `${larger} - ${smaller}`;
      break;
    case '*':
      answer = num1 * num2;
      question = `${num1} × ${num2}`;
      break;
    default:
      answer = num1 + num2;
      question = `${num1} + ${num2}`;
  }

  return {
    question,
    answer,
  };
};

