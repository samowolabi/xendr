import React from 'react';
import { cn } from '@/lib/cn';

interface SpinnerProps {
  /** Diameter in pixels. */
  size?: number;
  className?: string;
  label?: string;
}

/** Indeterminate loading spinner tinted with the primary color. */
export const Spinner: React.FC<SpinnerProps> = ({ size = 20, className, label }) => (
  <span className={cn('inline-flex items-center gap-2 text-muted', className)} role="status">
    <span
      className="inline-block animate-spin rounded-full border-2 border-border border-t-primary"
      style={{ width: size, height: size }}
    />
    {label && <span className="text-sm">{label}</span>}
  </span>
);
