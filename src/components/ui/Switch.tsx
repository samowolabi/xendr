import React from 'react';
import { cn } from '@/lib/cn';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

/** Accessible on/off toggle. The track fills with the primary color when on. */
export const Switch: React.FC<SwitchProps> = ({ checked, onChange, label, disabled, className }) => {
  const toggle = (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        checked ? 'bg-primary' : 'bg-surface-2 border border-border',
      )}
    >
      <span
        className={cn(
          'inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200',
          checked ? 'translate-x-6' : 'translate-x-1',
        )}
      />
    </button>
  );

  if (!label) return <span className={className}>{toggle}</span>;

  return (
    <label className={cn('inline-flex items-center gap-2 cursor-pointer select-none', className)}>
      {toggle}
      <span className="text-sm text-content">{label}</span>
    </label>
  );
};
