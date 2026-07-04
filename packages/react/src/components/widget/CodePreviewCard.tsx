import React, { useEffect, useMemo, useState } from 'react';
import { Card, CodeBlock, Icon, Select } from '@/components/ui';
import {
  generateSnippet,
  highlightFor,
  initialSnippetLanguage,
  normalizeSnippetLanguages,
  snippetLanguageItems,
} from '@/lib/widget/snippets';
import type { SnippetLanguage, WidgetRequest } from '@/lib/widget/types';

export interface CodePreviewCardProps {
  request: WidgetRequest;
  onBack?: () => void;
  snippetLanguages?: readonly SnippetLanguage[];
}

export const CodePreviewCard: React.FC<CodePreviewCardProps> = ({
  request,
  onBack,
  snippetLanguages,
}) => {
  const languages = useMemo(
    () => normalizeSnippetLanguages(snippetLanguages as readonly string[] | undefined),
    [snippetLanguages],
  );
  const initialLanguage = useMemo(
    () => initialSnippetLanguage(languages),
    [languages],
  );
  const [language, setLanguage] = useState<SnippetLanguage>(initialLanguage);
  const activeLanguage = languages.includes(language) ? language : initialLanguage;
  const languageItems = useMemo(() => snippetLanguageItems(languages), [languages]);
  const code = useMemo(() => generateSnippet(request, activeLanguage), [request, activeLanguage]);

  useEffect(() => {
    if (!languages.includes(language)) setLanguage(initialLanguage);
  }, [languages, language, initialLanguage]);

  return (
    <Card flush>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-3">
        <div className="flex min-w-0 items-center gap-3">
          {onBack && (
            <button
              type="button"
              aria-label="Back to console"
              onClick={onBack}
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-content transition-colors hover:bg-surface-2"
            >
              <Icon name="arrow-left" className="h-5 w-5" />
            </button>
          )}
          <div className="truncate font-heading text-sm font-semibold text-content">Code preview</div>
        </div>

        <Select
          value={activeLanguage}
          onChange={setLanguage}
          items={languageItems}
          size="sm"
          minWidthClassName="min-w-28"
        />
      </div>

      <div className="p-3">
        <CodeBlock code={code} language={highlightFor(activeLanguage)} showLineNumbers />
      </div>
    </Card>
  );
};
