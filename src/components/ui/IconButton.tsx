import React from 'react';
import { cn } from '@/lib/cn';

export type IconButtonVariant = 'ghost' | 'solid' | 'surface';
export type IconButtonSize = 'sm' | 'md';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  /** Accessible label — required since the button has no text. */
  'aria-label': string;
}

const variants: Record<IconButtonVariant, string> = {
  ghost: 'text-muted hover:bg-surface-2 hover:text-content',
  surface: 'bg-surface-2 text-muted border border-border hover:text-content',
  solid: 'bg-primary text-primary-contrast hover:bg-primary-hover',
};

const sizes: Record<IconButtonSize, string> = {
  sm: 'h-7 w-7',
  md: 'h-9 w-9',
};

export const IconButton: React.FC<IconButtonProps> = ({
  variant = 'ghost',
  size = 'md',
  className,
  children,
  ...props
}) => (
  <button
    className={cn(
      'inline-flex items-center justify-center rounded-lg transition-colors duration-150',
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      variants[variant],
      sizes[size],
      className,
    )}
    {...props}
  >
    {children}
  </button>
);
