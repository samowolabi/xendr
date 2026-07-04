import React, { useId } from 'react';
import { cn } from '@/lib/cn';

export type TextFieldSize = 'sm' | 'md' | 'lg';

interface TextFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  hint?: string;
  size?: TextFieldSize;
  /** Content rendered inside the field on the left (e.g. an icon or method badge). */
  leftSlot?: React.ReactNode;
  /** Content rendered inside the field on the right. */
  rightSlot?: React.ReactNode;
  containerClassName?: string;
}

const fieldSizes: Record<TextFieldSize, string> = {
  sm: 'gap-1.5 rounded-md px-2.5',
  md: 'gap-2 rounded-lg px-3',
  lg: 'gap-2.5 rounded-lg px-4',
};

const inputSizes: Record<TextFieldSize, string> = {
  sm: 'py-1 text-[12px]',
  md: 'py-1.5 text-sm',
  lg: 'py-2 text-base',
};

const labelSizes: Record<TextFieldSize, string> = {
  sm: 'mb-1 text-xs',
  md: 'mb-1.5 text-sm',
  lg: 'mb-2 text-sm',
};

const helperSizes: Record<TextFieldSize, string> = {
  sm: 'mt-1 text-[11px]',
  md: 'mt-1 text-xs',
  lg: 'mt-1.5 text-xs',
};

/** Themed text input with optional label, inline slots, and error/hint text. */
export const TextField: React.FC<TextFieldProps> = ({
  label,
  error,
  hint,
  size = 'md',
  leftSlot,
  rightSlot,
  className,
  containerClassName,
  id,
  ...props
}) => {
  const autoId = useId();
  const fieldId = id ?? autoId;

  return (
    <div className={cn('w-full', containerClassName)}>
      {label && (
        <label htmlFor={fieldId} className={cn('block font-medium text-muted', labelSizes[size])}>
          {label}
        </label>
      )}
      <div
        className={cn(
          'flex items-center border border-border/35 bg-surface-2',
          fieldSizes[size],
          error && 'border-red-500',
        )}
      >
        {leftSlot}
        <input
          id={fieldId}
          className={cn(
            'w-full bg-transparent text-content placeholder:text-muted',
            'focus:outline-none disabled:cursor-not-allowed disabled:opacity-60',
            inputSizes[size],
            className,
          )}
          {...props}
        />
        {rightSlot}
      </div>
      {error ? (
        <p className={cn('text-red-500', helperSizes[size])}>{error}</p>
      ) : hint ? (
        <p className={cn('text-muted', helperSizes[size])}>{hint}</p>
      ) : null}
    </div>
  );
};
