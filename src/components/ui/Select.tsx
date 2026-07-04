import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import { Icon } from './Icon';

export interface SelectItem<T extends string> {
  id: T;
  label: string;
  className?: string;
}

interface SelectProps<T extends string> {
  items: SelectItem<T>[];
  value: T;
  onChange: (value: T) => void;
  size?: 'sm' | 'md';
  disabled?: boolean;
  triggerLabel?: string;
  minWidthClassName?: string;
  /** Which edge the menu aligns to. Use `'right'` near a container's right edge. */
  align?: 'left' | 'right';
  className?: string;
}

const triggerSizes = {
  sm: 'gap-1.5 px-2.5 py-1 text-[12px]',
  md: 'gap-1 px-2 py-1 text-[14px]',
};

const itemSizes = {
  sm: 'px-2.5 py-1.5 text-[12px]',
  md: 'px-3 py-1.5 text-[14px]',
};

/** Compact themed dropdown using the same behavior as the HTTP method selector. */
export function Select<T extends string>({
  items,
  value,
  onChange,
  size = 'md',
  disabled,
  triggerLabel,
  minWidthClassName = 'min-w-[7rem]',
  align = 'left',
  className,
}: SelectProps<T>) {
  const [open, setOpen] = useState(false);
  const [render, setRender] = useState(false);
  const [closing, setClosing] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = items.find((item) => item.id === value) ?? items[0];

  useEffect(() => {
    if (open) {
      setRender(true);
      setClosing(false);
      return;
    }

    if (!render) return;
    setClosing(true);
    const timeout = window.setTimeout(() => {
      setRender(false);
      setClosing(false);
    }, 150);
    return () => window.clearTimeout(timeout);
  }, [open, render]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const select = (nextValue: T) => {
    if (disabled) return;
    onChange(nextValue);
    setOpen(false);
  };

  return (
    <div ref={rootRef} className={cn('relative inline-flex', className)}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        className={cn(
          'inline-flex cursor-pointer items-center rounded-md font-heading transition-colors duration-150',
          'focus:outline-none',
          'disabled:cursor-not-allowed disabled:opacity-60',
          triggerSizes[size],
          selected?.className ?? 'text-content hover:bg-surface-2',
        )}
      >
        {triggerLabel ?? selected?.label}
        <Icon
          name="chevron-down"
          className={cn('h-4 w-4 text-muted transition-transform duration-200', open && 'rotate-180')}
        />
      </button>

      {render && (
        <div
          className={cn(
            't-dropdown absolute top-full z-20 mt-1 overflow-hidden rounded-lg border border-border bg-surface shadow-lg',
            align === 'right' ? 'right-0' : 'left-0',
            minWidthClassName,
            open && 'is-open',
            closing && 'is-closing',
          )}
          data-origin={align === 'right' ? 'top-right' : 'top-left'}
        >
          <ul role="listbox" className="max-h-[248px] min-h-0 overflow-y-auto p-1">
            {items.map((item) => {
              const active = item.id === value;
              return (
                <li key={item.id} role="option" aria-selected={active}>
                  <button
                    type="button"
                    onClick={() => select(item.id)}
                    className={cn(
                      'flex w-full cursor-pointer items-center justify-between rounded-md font-heading transition-colors duration-150 hover:bg-surface-2',
                      itemSizes[size],
                      item.className ?? 'text-muted hover:text-content',
                      active && 'bg-surface-2',
                    )}
                  >
                    {item.label}
                    {active && <Icon name="check" className="h-4 w-4" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
