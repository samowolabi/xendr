import React from 'react';
import { cn } from '@/lib/cn';

interface CardProps {
  /** Muted label rendered above the card (e.g. "Get Users", "Sample Response"). */
  label?: string;
  /** Remove inner padding, useful when the card hosts its own toolbar/body. */
  flush?: boolean;
  className?: string;
  children: React.ReactNode;
}

/** Elevated, rounded surface container with an optional caption above it. */
export const Card: React.FC<CardProps> = ({ label, flush, className, children }) => (
  <div className="w-full">
    {label && <div className="mb-2 text-sm text-muted">{label}</div>}
    <div
      className={cn(
        'w-full rounded-xl border border-border/45 bg-surface',
        !flush && 'p-3',
        className,
      )}
    >
      {children}
    </div>
  </div>
);
