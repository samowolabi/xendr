import type { WidgetHeader, WidgetRequest, WidgetResponse } from './types';

const FORBIDDEN_HEADERS = new Set([
  'accept-charset',
  'accept-encoding',
  'access-control-request-headers',
  'access-control-request-method',
  'connection',
  'content-length',
  'cookie',
  'cookie2',
  'date',
  'dnt',
  'expect',
  'host',
  'keep-alive',
  'origin',
  'referer',
  'te',
  'trailer',
  'transfer-encoding',
  'upgrade',
  'via',
]);

function authHeader(request: WidgetRequest): WidgetHeader | null {
  if (!request.auth || request.auth.type === 'none') return null;
  if (request.auth.type === 'bearer') {
    return { key: 'Authorization', value: `Bearer ${request.auth.token}` };
  }
  return { key: request.auth.key, value: request.auth.value };
}

function requestHeaders(request: WidgetRequest): Headers {
  const headers = new Headers();

  for (const header of request.headers ?? []) {
    if (!header.key.trim()) continue;
    if (FORBIDDEN_HEADERS.has(header.key.trim().toLowerCase())) continue;
    headers.set(header.key, header.value);
  }

  const auth = authHeader(request);
  if (auth && !FORBIDDEN_HEADERS.has(auth.key.toLowerCase())) {
    headers.set(auth.key, auth.value);
  }

  return headers;
}

function responseHeaders(headers: Headers): WidgetHeader[] {
  return [...headers.entries()].map(([key, value]) => ({ key, value }));
}

function byteSize(value: string): string {
  const bytes = new TextEncoder().encode(value).length;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatBody(value: string, contentType?: string | null): string {
  const shouldTryJson = contentType?.includes('json') || /^[\s\n]*(?:\[|\{)/.test(value);
  if (!shouldTryJson) return value;

  try {
    return JSON.stringify(JSON.parse(value), null, 2);
  } catch {
    return value;
  }
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Request failed';
}

export function widgetErrorResponse(error: unknown, startedAt = performance.now()): WidgetResponse {
  const message = errorMessage(error);
  return {
    status: 0,
    statusText: 'Network Error',
    headers: [],
    body: JSON.stringify(
      {
        error: message,
        hint: 'The browser may have blocked this request because of CORS or network policy.',
      },
      null,
      2,
    ),
    timeMs: Math.round(performance.now() - startedAt),
    size: '0 B',
    error: message,
  };
}

export async function executeWidgetRequest(request: WidgetRequest): Promise<WidgetResponse> {
  const startedAt = performance.now();

  try {
    const response = await fetch(request.url, {
      method: request.method,
      headers: requestHeaders(request),
      body: request.body && request.method !== 'GET' ? request.body : undefined,
    });
    const rawBody = await response.text();
    const body = formatBody(rawBody, response.headers.get('content-type'));

    return {
      status: response.status,
      statusText: response.statusText || (response.ok ? 'OK' : 'Error'),
      headers: responseHeaders(response.headers),
      body,
      timeMs: Math.round(performance.now() - startedAt),
      size: byteSize(rawBody),
    };
  } catch (error) {
    return widgetErrorResponse(error, startedAt);
  }
}

export function mockWidgetResponse(request: WidgetRequest): WidgetResponse {
  const body =
    request.sampleResponse ??
    JSON.stringify(
      {
        ok: true,
        request: request.title,
      },
      null,
      2,
    );

  return {
    status: 200,
    statusText: 'OK',
    headers: [
      { key: 'content-type', value: 'application/json' },
      { key: 'cache-control', value: 'no-store' },
    ],
    body,
    timeMs: 142,
    size: byteSize(body),
  };
}
