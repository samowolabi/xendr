import React, { useId } from 'react';
import { cn } from '@/lib/cn';

interface ColorFieldProps {
  label?: string;
  /** Hex color value, e.g. "#6760e3". */
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

/** Swatch + hex input pair for picking a theme color. */
export const ColorField: React.FC<ColorFieldProps> = ({ label, value, onChange, className }) => {
  const id = useId();
  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-muted">
          {label}
        </label>
      )}
      <div className="flex items-center gap-1.5 rounded-md border border-border bg-surface-2 p-1 focus-within:border-primary">
        <label
          className="relative h-5 w-5 shrink-0 overflow-hidden rounded border border-border"
          style={{ backgroundColor: value }}
        >
          <input
            id={id}
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
        </label>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
          className="w-full bg-transparent font-mono text-[13px] uppercase text-content focus:outline-none"
        />
      </div>
    </div>
  );
};
