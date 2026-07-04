import React from 'react';
import { IconButton } from './IconButton';
import type { IconButtonVariant, IconButtonSize } from './IconButton';
import { Icon } from './Icon';
import { useCopyToClipboard } from '@/lib/clipboard';

interface CopyButtonProps {
  /** Text to copy to the clipboard. */
  value: string;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  className?: string;
  label?: string;
}

/** Icon button that copies `value` and briefly flips to a check mark. */
export const CopyButton: React.FC<CopyButtonProps> = ({
  value,
  variant = 'surface',
  size = 'md',
  className,
  label = 'Copy to clipboard',
}) => {
  const { copy, copied } = useCopyToClipboard();
  const iconSize = size === 'sm' ? 14 : 16;

  return (
    <IconButton
      aria-label={copied ? 'Copied' : label}
      variant={variant}
      size={size}
      className={className}
      onClick={() => copy(value)}
    >
      {copied ? (
        <Icon name="check" size={iconSize} className="text-green-500" />
      ) : (
        <Icon name="copy" size={iconSize} />
      )}
    </IconButton>
  );
};
