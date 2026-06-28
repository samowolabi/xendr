import React, { useEffect, useMemo, useState } from 'react';
import { Button, Card, CodeBlock, Icon } from '@/components/ui';
import { ApiConsole } from './ApiConsole';
import { parseCurl } from './curl';
import { ImportCard } from './ImportCard';
import { RequestSnippet } from './RequestSnippet';
import { generateSnippet } from './snippets';
import type { WidgetRequest } from './types';

type ApiPlaygroundPanel = 'idle' | 'console' | 'import';

export type ApiPlaygroundMode = 'dark' | 'light' | 'system';

/** Resolve the widget's effective theme, following the OS for `'system'`. */
function useResolvedMode(mode: ApiPlaygroundMode): 'dark' | 'light' {
  const getSystem = (): 'dark' | 'light' =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  const [systemMode, setSystemMode] = useState<'dark' | 'light'>(getSystem);

  useEffect(() => {
    if (mode !== 'system') return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => setSystemMode(media.matches ? 'dark' : 'light');
    onChange();
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, [mode]);

  return mode === 'system' ? systemMode : mode;
}

export interface ApiPlaygroundCustomization {
  primary?: string;
  background?: string;
}

export interface ApiPlaygroundProps {
  request: string;
  title?: string;
  sampleResponse?: string;
  onUpdateRequest?: (request: string) => void;
  editable?: boolean;
  allowImport?: boolean;
  /** Color theme: `'dark'` (default), `'light'`, or `'system'` (follows the OS). */
  mode?: ApiPlaygroundMode;
  /**
   * When true, the start snippet tracks live edits made in the console.
   * Default false — the snippet stays pinned to the documented `request`.
   */
  syncSnippet?: boolean;
  customization?: ApiPlaygroundCustomization;
}

function inferredTitle(request: WidgetRequest): string {
  try {
    const url = new URL(request.url);
    return `${request.method} ${url.pathname || '/'}`;
  } catch {
    return `${request.method} ${request.url || '/'}`;
  }
}

const InvalidRequest: React.FC<{
  request: string;
  allowImport: boolean;
  editable: boolean;
  onTryImport: () => void;
}> = ({ request, allowImport, editable, onTryImport }) => (
  <Card label="Invalid request">
    <div className="relative flex items-center justify-between">
      <div className="text-sm font-medium text-content">cURL</div>
      {allowImport && editable && (
        <Button
          size="sm"
          variant="primary"
          onClick={onTryImport}
          rightIcon={<Icon name="download" className="h-4 w-4" />}
        >
          Import
        </Button>
      )}
    </div>
    <div className="mt-4">
      <CodeBlock
        code={request.trim() || 'Paste or pass a cURL request with a URL.'}
        language="bash"
        showLineNumbers
      />
    </div>
    <p className="mt-3 text-xs text-muted">The request could not be parsed into a valid URL.</p>
  </Card>
);

function hydrateRequest(
  request: WidgetRequest,
  title?: string,
  sampleResponse?: string,
): WidgetRequest {
  return {
    ...request,
    title: title ?? inferredTitle(request),
    sampleResponse,
  };
}

/** Full embeddable API playground with cURL as its public request source of truth. */
export const ApiPlayground: React.FC<ApiPlaygroundProps> = ({
  request,
  title,
  sampleResponse,
  onUpdateRequest,
  editable = true,
  allowImport = true,
  mode = 'dark',
  syncSnippet = false,
  customization,
}) => {
  const resolvedMode = useResolvedMode(mode);
  const [panel, setPanel] = useState<ApiPlaygroundPanel>('idle');

  // Two separate entities:
  //  • `request` (prop) — the documented request, drives the preview snippet.
  //  • `liveCurl` (internal) — the console's working copy.
  // They start equal; the console only edits `liveCurl`. Reset when the
  // documented request changes.
  const [liveCurl, setLiveCurl] = useState(request);
  useEffect(() => {
    setLiveCurl(request);
  }, [request]);

  // Console entity — always the live cURL.
  const parsedRequest = useMemo(() => {
    const parsed = parseCurl(liveCurl);
    return parsed ? hydrateRequest(parsed, title, sampleResponse) : null;
  }, [liveCurl, title, sampleResponse]);

  // Preview entity — the documented `request`, unless `syncSnippet` mirrors live edits.
  const snippetCurl = syncSnippet ? liveCurl : request;
  const snippetRequest = useMemo(() => {
    const parsed = parseCurl(snippetCurl);
    return parsed ? hydrateRequest(parsed, title, sampleResponse) : null;
  }, [snippetCurl, title, sampleResponse]);

  const publishCurl = (nextCurl: string) => {
    setLiveCurl(nextCurl);
    onUpdateRequest?.(nextCurl);
  };

  const updateRequest = (nextRequest: WidgetRequest) => {
    publishCurl(generateSnippet(nextRequest, 'curl'));
  };

  const importRequest = (_nextRequest: WidgetRequest, importedCurl: string) => {
    publishCurl(importedCurl.trim());
    setPanel('console');
  };

  const style = {
    ...(customization?.primary ? { '--primary': customization.primary } : {}),
    ...(customization?.background ? { '--bg': customization.background } : {}),
  } as React.CSSProperties;

  const showConsole = panel === 'console' && parsedRequest;

  return (
    <div data-theme={resolvedMode} style={style} className="bg-bg text-content text-left">
      {panel === 'import' ? (
        <div key="import" className="motion-safe:animate-[widget-slide-in_180ms_ease-out]">
          <ImportCard
            onImport={importRequest}
            onCancel={() => setPanel(parsedRequest ? 'console' : 'idle')}
          />
        </div>
      ) : showConsole ? (
        <div key="console" className="motion-safe:animate-[widget-slide-in_180ms_ease-out]">
          <ApiConsole
            request={parsedRequest}
            onRequestChange={updateRequest}
            editable={editable}
            onBack={() => setPanel('idle')}
            onImport={allowImport && editable ? () => setPanel('import') : undefined}
          />
        </div>
      ) : snippetRequest ? (
        <RequestSnippet request={snippetRequest} onTryItOut={() => setPanel('console')} />
      ) : (
        <InvalidRequest
          request={snippetCurl}
          allowImport={allowImport}
          editable={editable}
          onTryImport={() => setPanel('import')}
        />
      )}
    </div>
  );
};
