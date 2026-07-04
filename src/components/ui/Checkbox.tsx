import React from 'react';
import { cn } from '@/lib/cn';
import { Icon } from './Icon';

export type CheckboxSize = 'sm' | 'md';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: CheckboxSize;
  className?: string;
  'aria-label'?: string;
}

const boxSizes: Record<CheckboxSize, string> = {
  sm: 'h-4 w-4 rounded',
  md: 'h-5 w-5 rounded-md',
};

const iconSizes: Record<CheckboxSize, string> = {
  sm: 'h-3 w-3',
  md: 'h-3.5 w-3.5',
};

const labelSizes: Record<CheckboxSize, string> = {
  sm: 'text-xs',
  md: 'text-sm',
};

/** Controlled checkbox with the same theme tokens as form fields. */
export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  label,
  disabled,
  size = 'md',
  className,
  'aria-label': ariaLabel,
}) => {
  const control = (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={ariaLabel ?? label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        'inline-flex shrink-0 items-center justify-center border transition-colors duration-150',
        'focus:outline-none',
        'disabled:cursor-not-allowed disabled:opacity-50',
        boxSizes[size],
        checked
          ? 'border-primary bg-primary text-primary-contrast'
          : 'border-border bg-surface-2 text-transparent hover:border-primary/70',
      )}
    >
      <Icon name="check" className={iconSizes[size]} />
    </button>
  );

  if (!label) return <span className={className}>{control}</span>;

  return (
    <label className={cn('inline-flex cursor-pointer select-none items-center gap-2', className)}>
      {control}
      <span className={cn('text-content', labelSizes[size])}>{label}</span>
    </label>
  );
};
