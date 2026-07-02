import React from 'react';
import { cn } from '@/lib/cn';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

/** Accessible on/off toggle. The track fills with the primary color when on,
 *  with a white pill (liquid-glass) thumb. */
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
        'relative inline-flex h-5 w-11 shrink-0 items-center rounded-full transition-colors duration-200',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        checked ? 'bg-primary' : 'bg-surface-2 border border-border',
      )}
    >
      <span
        className={cn(
          'inline-block h-4 w-6 transform rounded-lg bg-white shadow-sm transition-transform duration-200',
          checked ? 'translate-x-[18px]' : 'translate-x-0.5',
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
