import React, { useState } from 'react';
import { Button, Card, Icon } from '@/components/ui';
import { cn } from '@/lib/cn';
import { parseCurl } from '@/lib/widget/curl';
import type { WidgetRequest } from '@/lib/widget/types';

interface ImportCardProps {
  /** Called with the parsed request when a valid cURL command is imported. */
  onImport: (request: WidgetRequest, curl: string) => void;
  onCancel?: () => void;
  className?: string;
}

const PLACEHOLDER = `curl -X POST 'https://jsonplaceholder.typicode.com/posts' \\
  -H 'Content-Type: application/json' \\
  -d '{ "title": "API client", "body": "Live request", "userId": 1 }'`;

/** Inline card for importing a request by pasting a cURL command. */
export const ImportCard: React.FC<ImportCardProps> = ({ onImport, onCancel, className }) => {
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleImport = () => {
    const parsed = parseCurl(text);
    if (!parsed) {
      setError('Could not parse a valid cURL command. Make sure it includes a URL.');
      return;
    }
    onImport(parsed, text);
    setText('');
    setError(null);
  };

  return (
    <Card flush className={className}>
      <div className="space-y-4 p-3">
        <div className="flex items-center gap-3">
          {onCancel && (
            <button
              type="button"
              aria-label="Back"
              onClick={onCancel}
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-content transition-colors hover:bg-surface-2"
            >
              <Icon name="arrow-left" className="h-5 w-5" />
            </button>
          )}
          <div className="font-heading text-sm font-semibold text-content">Import</div>
        </div>

        <p className="text-xs text-muted">Paste a cURL command to populate the request.</p>
        <textarea
          value={text}
          onChange={(event) => {
            setText(event.target.value);
            if (error) setError(null);
          }}
          spellCheck={false}
          rows={5}
          placeholder={PLACEHOLDER}
          aria-label="cURL command"
          className={cn(
            'w-full resize-none rounded-lg border border-border/35 bg-surface-2 p-3 font-mono text-[13px] leading-relaxed text-content outline-none',
            'placeholder:text-muted/50',
            error && 'border-red-500/60',
          )}
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
        <div className="flex items-center justify-end">
          <Button
            size="sm"
            onClick={handleImport}
            disabled={!text.trim()}
            leftIcon={<Icon name="import" className="h-4 w-4" />}
          >
            Import
          </Button>
        </div>
      </div>
    </Card>
  );
};
