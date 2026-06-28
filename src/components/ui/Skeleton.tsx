import React from 'react';
import { cn } from '@/lib/cn';

interface SkeletonProps {
  className?: string;
  /** Inline width (CSS length). */
  width?: string | number;
  /** Inline height (CSS length). */
  height?: string | number;
  /** Corner radius. */
  rounded?: 'sm' | 'md' | 'lg' | 'full';
}

const radii: Record<NonNullable<SkeletonProps['rounded']>, string> = {
  sm: 'rounded',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full',
};

/** Placeholder block with a light shimmer sweep, for loading states. */
export const Skeleton: React.FC<SkeletonProps> = ({ className, width, height, rounded = 'md' }) => (
  <span
    className={cn('relative block overflow-hidden bg-surface-2', radii[rounded], className)}
    style={{ width, height }}
    aria-hidden="true"
  >
    <span className="absolute inset-0 -translate-x-full animate-[shimmer_2s_linear_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
  </span>
);
