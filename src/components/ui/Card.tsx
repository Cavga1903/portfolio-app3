import React from 'react';
import { useAppTheme } from '../../theme/ThemeProvider';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'md',
  children,
  className = '',
  style,
  ...rest
}) => {
  const { theme } = useAppTheme();

  const isElevated = variant === 'elevated';
  const isOutlined = variant === 'outlined';

  const paddingValue = padding === 'none' 
    ? 0 
    : padding === 'sm'
    ? theme.spacing.sm
    : padding === 'lg'
    ? theme.spacing.lg
    : theme.spacing.md;

  const baseStyles: React.CSSProperties = {
    borderRadius: theme.radius.lg,
    border: isOutlined ? `1px solid ${theme.colors.borderSubtle}` : 'none',
    background: theme.colors.bgElevated,
    boxShadow: isElevated ? theme.shadow.lg : theme.shadow.sm,
    padding: paddingValue,
    color: theme.colors.text,
    ...style,
  };

  return (
    <div
      {...rest}
      style={baseStyles}
      className={className}
    >
      {children}
    </div>
  );
};

