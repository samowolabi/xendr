import React from 'react';
import { cn } from '@/lib/cn';
import type { HttpMethod } from '@/types';

export type BadgeTone = 'neutral' | 'primary' | 'success' | 'error' | 'warning' | 'info';

interface BadgeProps {
  tone?: BadgeTone;
  className?: string;
  children: React.ReactNode;
}

const tones: Record<BadgeTone, string> = {
  neutral: 'bg-surface-2 text-muted border border-border',
  primary: 'bg-primary-soft text-primary border border-primary/30',
  success: 'bg-[#52b788]/15 text-[#52b788] border border-[#52b788]/25',
  error:
    'bg-[#3B1B1F] text-[#F87171] border border-[#F87171]/18 [[data-theme=light]_&]:bg-red-500/12 [[data-theme=light]_&]:text-red-600 [[data-theme=light]_&]:border-red-500/25',
  warning:
    'bg-amber-500/15 text-amber-500 border border-amber-500/30 [[data-theme=light]_&]:bg-amber-500/14 [[data-theme=light]_&]:text-amber-700',
  info: 'bg-sky-500/15 text-sky-400 border border-sky-500/30',
};

export const Badge: React.FC<BadgeProps> = ({ tone = 'neutral', className, children }) => (
  <span
    className={cn(
      'inline-flex items-center gap-1 whitespace-nowrap rounded-md px-2 py-0.5 text-xs font-heading font-[550]',
      tones[tone],
      className,
    )}
  >
    {children}
  </span>
);

const methodTones: Record<HttpMethod, BadgeTone> = {
  GET: 'success',
  POST: 'info',
  PUT: 'warning',
  PATCH: 'primary',
  DELETE: 'error',
};

/** Badge color-coded by HTTP method, matching the request builder. */
export const MethodBadge: React.FC<{ method: HttpMethod; className?: string }> = ({
  method,
  className,
}) => (
  <Badge tone={methodTones[method]} className={className}>
    {method}
  </Badge>
);

/** Badge for an HTTP status: green for 2xx, amber for 3xx, red otherwise. */
export const StatusBadge: React.FC<{ status: number; statusText?: string; className?: string }> = ({
  status,
  statusText,
  className,
}) => {
  const tone: BadgeTone = status >= 200 && status < 300 ? 'success' : status >= 300 && status < 400 ? 'warning' : 'error';
  return (
    <Badge tone={tone} className={className}>
      {status} {statusText}
    </Badge>
  );
};
