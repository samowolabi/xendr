import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';

export interface TabItem {
  id: string;
  label: string;
  badge?: string | number;
}

interface TabsProps {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  /** Visual style: `underline` (default) or `segmented` pill group. */
  variant?: 'underline' | 'segmented';
  size?: 'sm' | 'md';
  className?: string;
}

/** Themed tab bar with a sliding active indicator. */
export const Tabs: React.FC<TabsProps> = ({
  items,
  activeId,
  onChange,
  variant = 'underline',
  size = 'md',
  className,
}) => {
  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [rect, setRect] = useState({ left: 0, top: 0, width: 0, height: 0 });

  // Track the active tab's geometry so the indicator can slide to it.
  // useLayoutEffect runs before paint, so the indicator never flashes.
  useLayoutEffect(() => {
    const el = btnRefs.current[activeId];
    if (el) setRect({ left: el.offsetLeft, top: el.offsetTop, width: el.offsetWidth, height: el.offsetHeight });
  }, [activeId, items]);

  // Keep it aligned when the container reflows (e.g. window resize).
  useEffect(() => {
    const reposition = () => {
      const el = btnRefs.current[activeId];
      if (el) setRect({ left: el.offsetLeft, top: el.offsetTop, width: el.offsetWidth, height: el.offsetHeight });
    };
    window.addEventListener('resize', reposition);
    return () => window.removeEventListener('resize', reposition);
  }, [activeId]);

  if (variant === 'segmented') {
    return (
      <div className={cn('relative inline-flex gap-1 rounded-lg border border-border bg-surface-2 p-1', className)}>
        {/* Sliding pill */}
        <span
          className="pointer-events-none absolute z-0 rounded-md bg-primary transition-all duration-300 ease-out"
          style={{ left: rect.left, top: rect.top, width: rect.width, height: rect.height }}
        />
        {items.map((item) => {
          const active = item.id === activeId;
          return (
            <button
              key={item.id}
              ref={(el) => {
                btnRefs.current[item.id] = el;
              }}
              onClick={() => onChange(item.id)}
              className={cn(
                'group/seg relative z-10 cursor-pointer rounded-md font-heading transition-colors duration-150',
                size === 'sm' ? 'px-2.5 py-1 text-[12px]' : 'px-3 py-1.5 text-[14px]',
                active ? 'text-primary-contrast' : 'text-muted',
              )}
            >
              {/* Inactive label shimmers (gradient clipped to the text) on hover */}
              <span
                className={cn(
                  'relative z-10',
                  !active &&
                    'bg-gradient-to-r from-muted via-content to-muted bg-[length:200%_100%] bg-clip-text group-hover/seg:text-transparent group-hover/seg:[animation:text-shimmer_1.2s_linear_1_forwards]',
                )}
              >
                {item.label}
                {item.badge !== undefined && <span className="ml-1.5 opacity-70">{item.badge}</span>}
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn('relative flex gap-1 border-b border-border', className)}>
      {items.map((item) => {
        const active = item.id === activeId;
        return (
          <button
            key={item.id}
            ref={(el) => {
              btnRefs.current[item.id] = el;
            }}
            onClick={() => onChange(item.id)}
            className={cn(
              'inline-flex cursor-pointer items-center gap-1.5 font-heading transition-colors duration-150',
              size === 'sm' ? 'px-2 py-2 text-[12px]' : 'px-3 py-2.5 text-[14px]',
              active ? 'text-content' : 'text-muted hover:text-content',
            )}
          >
            {item.label}
            {item.badge !== undefined && <span className="text-xs text-muted">{item.badge}</span>}
          </button>
        );
      })}
      {/* Sliding underline */}
      <span
        className="pointer-events-none absolute -bottom-px h-0.5 rounded-full bg-primary transition-all duration-300 ease-out"
        style={{ left: rect.left, width: rect.width }}
      />
    </div>
  );
};
