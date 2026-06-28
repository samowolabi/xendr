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
    className={cn('relative w-full overflow-hidden rounded-xl bg-surface-2', className)}
    style={{ minHeight }}
    role="status"
    aria-label="Loading response"
  >
    <span className="absolute inset-0 -translate-x-full animate-[shimmer_2s_linear_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
  </div>
);
