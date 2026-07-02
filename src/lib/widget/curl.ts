import type { HttpMethod } from '@/types';
import type { WidgetAuth, WidgetHeader, WidgetRequest } from './types';

const HTTP_METHODS: HttpMethod[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
const DATA_FLAGS = new Set(['-d', '--data', '--data-raw', '--data-binary', '--data-ascii']);
const HEADER_FLAGS = new Set(['-H', '--header']);
const METHOD_FLAGS = new Set(['-X', '--request']);
const URL_FLAGS = new Set(['--url']);
const AUTH_HEADER = 'authorization';
const BEARER_PREFIX = 'Bearer ';

function joinLineContinuations(input: string): string {
  return input.replace(/\\\s*\n\s*/g, ' ').trim();
}

function normalizeInput(input: string): string {
  return input
    .trim()
    .replace(/^```(?:bash|sh|shell|zsh|curl)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .replace(/^\s*[$>]\s*/gm, '')
    .replace(/\\n/g, '\n')
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'");
}

function tokenize(input: string): string[] {
  const tokens: string[] = [];
  let token = '';
  let quote: '"' | "'" | null = null;
  let escaped = false;
  const source = joinLineContinuations(normalizeInput(input));

  const pushToken = () => {
    if (!token) return;
    tokens.push(token);
    token = '';
  };

  for (let i = 0; i < source.length; i++) {
    const char = source[i];

    if (escaped) {
      token += char;
      escaped = false;
      continue;
    }

    if (char === '\\' && quote !== "'") {
      const next = source[i + 1];
      if (!quote && next === 'n') {
        pushToken();
        i++;
        continue;
      }
      if (!quote && next && /\s/.test(next)) {
        pushToken();
        while (i + 1 < source.length && /\s/.test(source[i + 1])) i++;
        continue;
      }
      escaped = true;
      continue;
    }

    if ((char === '"' || char === "'") && (!quote || quote === char)) {
      quote = quote ? null : char;
      continue;
    }

    if (!quote && /\s/.test(char)) {
      pushToken();
      continue;
    }

    token += char;
  }

  if (escaped) token += '\\';
  pushToken();
  return tokens;
}

function stripCurlCommand(tokens: string[]): string[] {
  const firstCurl = tokens.findIndex((token) => token === 'curl' || token.endsWith('/curl'));
  return firstCurl >= 0 ? tokens.slice(firstCurl + 1) : tokens;
}

function isUrl(value: string): boolean {
  return /^(?:https?:\/\/\S+|\/\S*|[A-Za-z0-9.-]+\.[A-Za-z]{2,}\S*)$/.test(value);
}

function normalizeUrl(value: string): string {
  if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('/')) {
    return value;
  }
  return `https://${value}`;
}

function normalizeMethod(value: string): HttpMethod | null {
  const method = value.toUpperCase();
  return (HTTP_METHODS as string[]).includes(method) ? (method as HttpMethod) : null;
}

function parseHeader(value: string): WidgetHeader | null {
  const colon = value.indexOf(':');
  if (colon < 0) return null;
  return {
    key: value.slice(0, colon).trim(),
    value: value.slice(colon + 1).trim(),
  };
}

function authFromHeaders(headers: WidgetHeader[]): WidgetAuth | undefined {
  const authHeader = headers.find((header) => header.key.toLowerCase() === AUTH_HEADER);
  if (!authHeader) return undefined;

  if (authHeader.value.toLowerCase().startsWith(BEARER_PREFIX.toLowerCase())) {
    return { type: 'bearer', token: authHeader.value.slice(BEARER_PREFIX.length) };
  }

  return { type: 'apiKey', key: authHeader.key, value: authHeader.value, in: 'header' };
}

function formatJsonIfPossible(body: string): string {
  try {
    return JSON.stringify(JSON.parse(body), null, 2);
  } catch {
    return body;
  }
}

/**
 * Parse a cURL command into a WidgetRequest. Returns null if no URL is found.
 * Supports common shell quoting, escaped quotes, --url, repeated data flags,
 * header flags, and Authorization auth extraction.
 */
export function parseCurl(input: string): WidgetRequest | null {
  const tokens = stripCurlCommand(tokenize(input));
  if (tokens.length === 0) return null;

  const headers: WidgetHeader[] = [];
  const bodies: string[] = [];
  let method: HttpMethod | null = null;
  let url = '';

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const next = tokens[i + 1];

    if (METHOD_FLAGS.has(token) && next) {
      method = normalizeMethod(next) ?? method;
      i++;
      continue;
    }

    if (token.startsWith('-X') && token.length > 2) {
      method = normalizeMethod(token.slice(2)) ?? method;
      continue;
    }

    if (HEADER_FLAGS.has(token) && next) {
      const header = parseHeader(next);
      if (header) headers.push(header);
      i++;
      continue;
    }

    if (token.startsWith('-H') && token.length > 2) {
      const header = parseHeader(token.slice(2));
      if (header) headers.push(header);
      continue;
    }

    if (DATA_FLAGS.has(token) && next !== undefined) {
      bodies.push(next);
      i++;
      continue;
    }

    const dataFlag = [...DATA_FLAGS].find((flag) => token.startsWith(`${flag}=`));
    if (dataFlag) {
      bodies.push(token.slice(dataFlag.length + 1));
      continue;
    }

    if (URL_FLAGS.has(token) && next) {
      url = normalizeUrl(next);
      i++;
      continue;
    }

    if (token.startsWith('--url=')) {
      url = normalizeUrl(token.slice('--url='.length));
      continue;
    }

    if (!token.startsWith('-') && isUrl(token)) {
      url = normalizeUrl(token);
    }
  }

  if (!url) return null;

  const body = bodies.length ? formatJsonIfPossible(bodies.join('&')) : '';
  const inferredMethod: HttpMethod = method ?? (body ? 'POST' : 'GET');
  const auth = authFromHeaders(headers);

  return {
    title: 'Imported request',
    method: inferredMethod,
    url,
    headers: auth
      ? headers.filter((header) => header.key.toLowerCase() !== AUTH_HEADER)
      : headers,
    auth,
    body: body || undefined,
  };
}
