import React from 'react';
import { useAppTheme } from '../../theme/ThemeProvider';

interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'success' | 'danger' | 'warning' | 'info';
  size?: 'sm' | 'md';
  children: React.ReactNode;
}

export const Tag: React.FC<TagProps> = ({
  variant = 'default',
  size = 'md',
  children,
  className = '',
  style,
  ...rest
}) => {
  const { theme } = useAppTheme();

  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'primary':
        return {
          background: theme.colors.primarySoft,
          color: theme.colors.primary,
        };
      case 'success':
        return {
          background: `${theme.colors.success}20`,
          color: theme.colors.success,
        };
      case 'danger':
        return {
          background: `${theme.colors.danger}20`,
          color: theme.colors.danger,
        };
      case 'warning':
        return {
          background: `${theme.colors.warning}20`,
          color: theme.colors.warning,
        };
      case 'info':
        return {
          background: `${theme.colors.info}20`,
          color: theme.colors.info,
        };
      default:
        return {
          background: theme.colors.bgSubtle,
          color: theme.colors.textMuted,
        };
    }
  };

  const baseStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: size === 'sm' 
      ? `${theme.spacing.xs / 2}px ${theme.spacing.xs}px`
      : `${theme.spacing.xs}px ${theme.spacing.sm}px`,
    borderRadius: theme.radius.full,
    fontSize: size === 'sm' ? theme.typography.size.xs : theme.typography.size.sm,
    fontWeight: 500,
    fontFamily: theme.typography.fontFamily,
    ...getVariantStyles(),
    ...style,
  };

  return (
    <span
      {...rest}
      style={baseStyles}
      className={className}
    >
      {children}
    </span>
  );
};

