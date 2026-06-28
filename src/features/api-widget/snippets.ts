import type { WidgetRequest, WidgetHeader, SnippetLanguage, WidgetAuth } from './types';
import type { CodeLanguage } from '@/lib/highlight';

export const SNIPPET_LANGUAGES: { id: SnippetLanguage; label: string }[] = [
  { id: 'curl', label: 'cURL' },
  { id: 'javascript', label: 'Javascript' },
  { id: 'python', label: 'Python' },
  { id: 'go', label: 'Go' },
];

/** Map a snippet language to the highlighter grammar. */
export function highlightFor(lang: SnippetLanguage): CodeLanguage {
  return lang === 'curl' ? 'bash' : lang;
}

function authHeader(auth?: WidgetAuth): WidgetHeader | null {
  if (!auth || auth.type === 'none') return null;
  if (auth.type === 'bearer') return { key: 'Authorization', value: `Bearer ${auth.token}` };
  return { key: auth.key, value: auth.value };
}

function headersOf(req: WidgetRequest): WidgetHeader[] {
  const auth = authHeader(req.auth);
  if (!auth) return req.headers ?? [];

  const headers = (req.headers ?? []).filter(
    (header) => header.key.toLowerCase() !== auth.key.toLowerCase(),
  );
  return [...headers, auth];
}

function curl(req: WidgetRequest): string {
  let out = `curl -X ${req.method} '${req.url}'`;
  for (const h of headersOf(req)) out += ` \\\n  -H '${h.key}: ${h.value}'`;
  if (req.body) out += ` \\\n  -d '${req.body}'`;
  return out;
}

function javascript(req: WidgetRequest): string {
  const opts: string[] = [`method: '${req.method}'`];
  const headers = headersOf(req);
  if (headers.length) {
    const entries = headers.map((h) => `    '${h.key}': '${h.value}'`).join(',\n');
    opts.push(`headers: {\n${entries}\n  }`);
  }
  if (req.body) opts.push(`body: JSON.stringify(${req.body})`);
  return [
    `const res = await fetch('${req.url}', {`,
    `  ${opts.join(',\n  ')},`,
    `});`,
    ``,
    `const data = await res.json();`,
    `console.log(data);`,
  ].join('\n');
}

function python(req: WidgetRequest): string {
  const lines: string[] = ['import requests', '', `url = "${req.url}"`];
  const callArgs: string[] = ['url'];

  const headers = headersOf(req);
  if (headers.length) {
    lines.push('', 'headers = {');
    for (const h of headers) lines.push(`    "${h.key}": "${h.value}",`);
    lines.push('}');
    callArgs.push('headers=headers');
  }

  if (req.body) {
    lines.push('', `payload = ${req.body}`);
    callArgs.push('json=payload');
  }

  lines.push(
    '',
    `response = requests.${req.method.toLowerCase()}(${callArgs.join(', ')})`,
    'print(response.json())',
  );
  return lines.join('\n');
}

function go(req: WidgetRequest): string {
  const imports = ['"fmt"', '"io"', '"net/http"'];
  if (req.body) imports.push('"strings"');

  const lines: string[] = ['package main', '', 'import ('];
  for (const imp of imports) lines.push(`\t${imp}`);
  lines.push(')', '', 'func main() {');

  if (req.body) {
    lines.push(`\tpayload := strings.NewReader(\`${req.body}\`)`);
    lines.push(`\treq, _ := http.NewRequest("${req.method}", "${req.url}", payload)`);
  } else {
    lines.push(`\treq, _ := http.NewRequest("${req.method}", "${req.url}", nil)`);
  }

  for (const h of headersOf(req)) {
    lines.push(`\treq.Header.Set("${h.key}", "${h.value}")`);
  }

  lines.push(
    '\tres, _ := http.DefaultClient.Do(req)',
    '\tdefer res.Body.Close()',
    '',
    '\tbody, _ := io.ReadAll(res.Body)',
    '\tfmt.Println(string(body))',
    '}',
  );
  return lines.join('\n');
}

export function generateSnippet(req: WidgetRequest, lang: SnippetLanguage): string {
  switch (lang) {
    case 'curl':
      return curl(req);
    case 'javascript':
      return javascript(req);
    case 'python':
      return python(req);
    case 'go':
      return go(req);
  }
}
