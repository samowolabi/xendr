import React from 'react';
import { cn } from '@/lib/cn';

interface ResponseLoadingStateProps {
  className?: string;
  /** Minimum height of the shimmering area (CSS length). */
  minHeight?: string | number;
}

/** Full-bleed shimmering surface shown in the response panel while a request is in flight. */
export const ResponseLoadingState: React.FC<ResponseLoadingStateProps> = ({
  className,
  minHeight = 240,
}) => (
  <div
    className={cn('t-bg-shimmer w-full rounded-xl bg-surface-2 [--bg-shimmer-strength:5%]', className)}
    style={{ minHeight }}
    role="status"
    aria-label="Loading response"
  />
);
