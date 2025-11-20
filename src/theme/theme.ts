import { palette, radius, spacing, typography, shadow } from './tokens';

export type ThemeMode = 'light' | 'dark';

export interface AppTheme {
  mode: ThemeMode;
  colors: {
    // backgrounds
    bg: string;
    bgElevated: string;
    bgSubtle: string;

    // borders
    borderSubtle: string;
    borderStrong: string;

    // text
    text: string;
    textMuted: string;
    textInverse: string;

    // primary
    primary: string;
    primarySoft: string;
    primaryStrong: string;
    onPrimary: string;

    // semantic
    success: string;
    danger: string;
    warning: string;
    info: string;

    overlay: string;
  };
  radius: typeof radius;
  spacing: typeof spacing;
  typography: typeof typography;
  shadow: typeof shadow;
}

export const lightTheme: AppTheme = {
  mode: 'light',
  colors: {
    bg: palette.gray[50],
    bgElevated: '#FFFFFF',
    bgSubtle: palette.gray[100],

    borderSubtle: palette.gray[200],
    borderStrong: palette.gray[300],

    text: palette.gray[900],
    textMuted: palette.gray[500],
    textInverse: '#FFFFFF',

    primary: palette.primary[600],
    primarySoft: palette.primary[50],
    primaryStrong: palette.primary[700],
    onPrimary: '#FFFFFF',

    success: palette.accent.green,
    danger: palette.accent.red,
    warning: palette.accent.amber,
    info: palette.accent.blue,

    overlay: 'rgba(15, 23, 42, 0.5)',
  },
  radius,
  spacing,
  typography,
  shadow,
};

export const darkTheme: AppTheme = {
  mode: 'dark',
  colors: {
    bg: '#020617',              // tailwind slate-950 vibe
    bgElevated: '#0F172A',      // slate-900
    bgSubtle: '#1E293B',        // slate-800

    borderSubtle: '#1F2937',    // gray-800
    borderStrong: '#4B5563',    // gray-600

    text: palette.gray[50],
    textMuted: palette.gray[400],
    textInverse: palette.gray[900],

    primary: palette.primary[400],
    primarySoft: 'rgba(99, 102, 241, 0.18)',
    primaryStrong: palette.primary[500],
    onPrimary: '#FFFFFF',

    success: '#22C55E',
    danger: '#F97316',
    warning: '#FBBF24',
    info: '#38BDF8',

    overlay: 'rgba(15, 23, 42, 0.8)',
  },
  radius,
  spacing,
  typography,
  shadow,
};

