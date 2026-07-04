import React, { useId, useRef, useState } from 'react';
import { cn } from '@/lib/cn';

export type TooltipSide = 'top' | 'bottom' | 'left' | 'right';
export type TooltipAlign = 'start' | 'center' | 'end';

interface TooltipProps {
  /** Tooltip contents. When empty, the trigger renders on its own. */
  content: React.ReactNode;
  /** The element the tooltip describes (a single focusable element works best). */
  children: React.ReactElement;
  /** Which side of the trigger the tooltip appears on. Defaults to `'top'`. */
  side?: TooltipSide;
  /**
   * Alignment along the side's axis. For `top`/`bottom` this is horizontal, for
   * `left`/`right` vertical. Use `'start'` near a container edge to keep the
   * bubble inside. Defaults to `'center'`.
   */
  align?: TooltipAlign;
  /** Delay before showing on hover/focus, in ms. Defaults to 150. */
  delay?: number;
  /** Extra classes for the tooltip bubble. */
  className?: string;
}

const sideOffset: Record<TooltipSide, string> = {
  top: 'bottom-full mb-1.5',
  bottom: 'top-full mt-1.5',
  left: 'right-full mr-1.5',
  right: 'left-full ml-1.5',
};

const alignClasses: Record<TooltipSide, Record<TooltipAlign, string>> = {
  top: { start: 'left-0', center: 'left-1/2 -translate-x-1/2', end: 'right-0' },
  bottom: { start: 'left-0', center: 'left-1/2 -translate-x-1/2', end: 'right-0' },
  left: { start: 'top-0', center: 'top-1/2 -translate-y-1/2', end: 'bottom-0' },
  right: { start: 'top-0', center: 'top-1/2 -translate-y-1/2', end: 'bottom-0' },
};

/**
 * Lightweight hover/focus tooltip. Wraps a trigger element and shows a small
 * floating label. Purely CSS-positioned relative to the trigger, so it needs no
 * portal; keep it away from tight `overflow` scroll containers where it could clip.
 */
export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  side = 'top',
  align = 'center',
  delay = 150,
  className,
}) => {
  const id = useId();
  const [open, setOpen] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  if (!content) return children;

  const show = () => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(true), delay);
  };
  const hide = () => {
    window.clearTimeout(timer.current);
    setOpen(false);
  };

  const trigger = React.isValidElement(children)
    ? React.cloneElement(children as React.ReactElement<{ 'aria-describedby'?: string }>, {
        'aria-describedby': open ? id : undefined,
      })
    : children;

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {trigger}
      <span
        role="tooltip"
        id={id}
        className={cn(
          'pointer-events-none absolute z-50 w-max max-w-xs rounded-md border border-border bg-surface-2 px-2 py-1',
          'text-[12px] font-medium leading-snug text-content shadow-md',
          'transition-opacity duration-150',
          open ? 'opacity-100' : 'opacity-0',
          sideOffset[side],
          alignClasses[side][align],
          className,
        )}
      >
        {content}
      </span>
    </span>
  );
};
