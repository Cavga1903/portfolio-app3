import React from 'react';
import { useAppTheme } from '../../theme/ThemeProvider';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  fullWidth = false,
  className = '',
  style,
  ...rest
}) => {
  const { theme } = useAppTheme();

  const baseStyles: React.CSSProperties = {
    width: fullWidth ? '100%' : 'auto',
    padding: `${theme.spacing.sm}px ${theme.spacing.md}px`,
    borderRadius: theme.radius.md,
    border: `1px solid ${error ? theme.colors.danger : theme.colors.borderSubtle}`,
    background: theme.colors.bgElevated,
    color: theme.colors.text,
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.fontFamily,
    transition: 'all 0.2s ease-in-out',
    ...style,
  };

  const focusStyles: React.CSSProperties = {
    outline: 'none',
    borderColor: error ? theme.colors.danger : theme.colors.primary,
    boxShadow: `0 0 0 3px ${error ? `${theme.colors.danger}20` : `${theme.colors.primary}20`}`,
  };

  return (
    <div style={{ width: fullWidth ? '100%' : 'auto' }}>
      {label && (
        <label
          style={{
            display: 'block',
            marginBottom: theme.spacing.xs,
            fontSize: theme.typography.size.sm,
            fontWeight: 500,
            color: theme.colors.text,
          }}
        >
          {label}
        </label>
      )}
      <input
        {...rest}
        style={baseStyles}
        className={className}
        onFocus={(e) => {
          Object.assign(e.currentTarget.style, focusStyles);
          rest.onFocus?.(e);
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = baseStyles.border as string;
          e.currentTarget.style.boxShadow = 'none';
          rest.onBlur?.(e);
        }}
      />
      {error && (
        <p
          style={{
            marginTop: theme.spacing.xs,
            fontSize: theme.typography.size.xs,
            color: theme.colors.danger,
          }}
        >
          {error}
        </p>
      )}
      {helperText && !error && (
        <p
          style={{
            marginTop: theme.spacing.xs,
            fontSize: theme.typography.size.xs,
            color: theme.colors.textMuted,
          }}
        >
          {helperText}
        </p>
      )}
    </div>
  );
};

