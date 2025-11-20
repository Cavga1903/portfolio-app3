import React from 'react';
import { useAppTheme } from '../../theme/ThemeProvider';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  className = '',
  style,
  ...rest
}) => {
  const { theme } = useAppTheme();

  const isPrimary = variant === 'primary';
  const isOutline = variant === 'outline';
  const isGhost = variant === 'ghost';
  const isDanger = variant === 'danger';

  const baseStyles: React.CSSProperties = {
    padding: size === 'sm' 
      ? `${theme.spacing.xs}px ${theme.spacing.sm}px`
      : size === 'lg'
      ? `${theme.spacing.md}px ${theme.spacing.xl}px`
      : `${theme.spacing.sm}px ${theme.spacing.md}px`,
    borderRadius: theme.radius.lg,
    border: isGhost ? 'none' : `1px solid ${isPrimary || isDanger ? theme.colors.primary : theme.colors.borderStrong}`,
    background: isPrimary 
      ? theme.colors.primary 
      : isDanger
      ? theme.colors.danger
      : isOutline
      ? 'transparent'
      : theme.colors.bgElevated,
    color: isPrimary || isDanger
      ? theme.colors.onPrimary
      : theme.colors.text,
    boxShadow: theme.shadow.sm,
    cursor: rest.disabled ? 'not-allowed' : 'pointer',
    fontSize: size === 'sm' ? theme.typography.size.xs : size === 'lg' ? theme.typography.size.md : theme.typography.size.sm,
    fontWeight: 500,
    fontFamily: theme.typography.fontFamily,
    width: fullWidth ? '100%' : 'auto',
    opacity: rest.disabled ? 0.5 : 1,
    transition: 'all 0.2s ease-in-out',
    ...style,
  };

  const hoverStyles: React.CSSProperties = !rest.disabled ? {
    boxShadow: theme.shadow.md,
    transform: 'translateY(-1px)',
  } : {};

  return (
    <button
      {...rest}
      style={baseStyles}
      className={className}
      onMouseEnter={(e) => {
        if (!rest.disabled) {
          Object.assign(e.currentTarget.style, hoverStyles);
        }
        rest.onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        if (!rest.disabled) {
          e.currentTarget.style.boxShadow = baseStyles.boxShadow as string;
          e.currentTarget.style.transform = 'none';
        }
        rest.onMouseLeave?.(e);
      }}
    >
      {children}
    </button>
  );
};

