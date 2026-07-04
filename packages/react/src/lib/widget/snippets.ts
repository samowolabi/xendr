import type { WidgetRequest, WidgetHeader, SnippetLanguage, WidgetAuth } from './types';
import type { CodeLanguage } from '@/lib/highlight';

export const SNIPPET_LANGUAGES: { id: SnippetLanguage; label: string }[] = [
  { id: 'curl', label: 'cURL' },
  { id: 'javascript', label: 'Javascript' },
  { id: 'python', label: 'Python' },
  { id: 'go', label: 'Go' },
  { id: 'node', label: 'Node.js' },
  { id: 'cpp', label: 'C++' },
  { id: 'csharp', label: 'C#' },
  { id: 'rust', label: 'Rust' },
  { id: 'java', label: 'Java' },
  { id: 'php', label: 'PHP' },
];

export const DEFAULT_SNIPPET_LANGUAGES = SNIPPET_LANGUAGES.map((language) => language.id);
const SUPPORTED_SNIPPET_LANGUAGE_IDS = new Set<SnippetLanguage>(DEFAULT_SNIPPET_LANGUAGES);

export function normalizeSnippetLanguages(
  languages?: readonly string[],
): SnippetLanguage[] {
  if (!languages?.length) return [...DEFAULT_SNIPPET_LANGUAGES];

  const seen = new Set<SnippetLanguage>();
  const valid: SnippetLanguage[] = [];

  for (const language of languages) {
    if (!SUPPORTED_SNIPPET_LANGUAGE_IDS.has(language as SnippetLanguage)) continue;
    const typed = language as SnippetLanguage;
    if (seen.has(typed)) continue;
    seen.add(typed);
    valid.push(typed);
  }

  return valid.length ? valid : [...DEFAULT_SNIPPET_LANGUAGES];
}

export function snippetLanguageItems(languages: readonly SnippetLanguage[]) {
  return languages.map((language) => SNIPPET_LANGUAGES.find((item) => item.id === language)!).filter(Boolean);
}

export function initialSnippetLanguage(languages: readonly SnippetLanguage[]): SnippetLanguage {
  return languages.includes('curl') ? 'curl' : languages[0];
}

/** Map a snippet language to the highlighter grammar. */
export function highlightFor(lang: SnippetLanguage): CodeLanguage {
  if (lang === 'curl') return 'bash';
  if (lang === 'node') return 'javascript';
  if (lang === 'rust') return 'rust';
  if (lang === 'cpp' || lang === 'csharp' || lang === 'java' || lang === 'php') return 'clike';
  return lang;
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

function singleQuote(value: string): string {
  return value.replaceAll("'", "'\\''");
}

function doubleQuote(value: string): string {
  return value.replaceAll('\\', '\\\\').replaceAll('"', '\\"');
}

function javaTextBlock(value: string): string {
  return value.replaceAll('\\', '\\\\').replaceAll('"""', '\\"\\"\\"');
}

function rawStringDelimiter(value: string, base = 'JSON'): string {
  let delimiter = base;
  while (value.includes(`)${delimiter}"`)) delimiter += '_';
  return delimiter;
}

function indent(value: string, spaces: number): string {
  const prefix = ' '.repeat(spaces);
  return value
    .split('\n')
    .map((line) => `${prefix}${line}`)
    .join('\n');
}

function formatBody(value: string): string {
  try {
    return JSON.stringify(JSON.parse(value), null, 2);
  } catch {
    return value.trim();
  }
}

function jsonArgument(value: string, spaces: number): string {
  return indent(formatBody(value), spaces).trimStart();
}

function csharpMethod(method: string): string {
  if (method === 'PATCH') return 'Patch';
  return `${method[0]}${method.slice(1).toLowerCase()}`;
}

function curl(req: WidgetRequest): string {
  let out = `curl -X ${req.method} '${singleQuote(req.url)}'`;
  for (const h of headersOf(req)) out += ` \\\n  -H '${singleQuote(`${h.key}: ${h.value}`)}'`;
  if (req.body) out += ` \\\n  -d '${singleQuote(formatBody(req.body))}'`;
  return out;
}

function javascript(req: WidgetRequest): string {
  const opts: string[] = [`method: '${req.method}'`];
  const headers = headersOf(req);
  if (headers.length) {
    const entries = headers.map((h) => `    '${h.key}': '${h.value}'`).join(',\n');
    opts.push(`headers: {\n${entries}\n  }`);
  }
  if (req.body) opts.push(`body: JSON.stringify(${jsonArgument(req.body, 2)})`);
  return [
    `const res = await fetch('${req.url}', {`,
    `  ${opts.join(',\n  ')},`,
    `});`,
    ``,
    `const data = await res.json();`,
    `console.log(data);`,
  ].join('\n');
}

function node(req: WidgetRequest): string {
  const opts: string[] = [`method: '${req.method}'`];
  const headers = headersOf(req);
  if (headers.length) {
    const entries = headers.map((h) => `    '${h.key}': '${h.value}'`).join(',\n');
    opts.push(`headers: {\n${entries}\n  }`);
  }
  if (req.body) opts.push(`body: JSON.stringify(${jsonArgument(req.body, 2)})`);
  return [
    `const response = await fetch('${req.url}', {`,
    `  ${opts.join(',\n  ')},`,
    `});`,
    ``,
    `const data = await response.json();`,
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
    lines.push('', `payload = ${formatBody(req.body)}`);
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
    lines.push(`\tpayload := strings.NewReader(\`${formatBody(req.body)}\`)`);
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

function cpp(req: WidgetRequest): string {
  const body = req.body ? formatBody(req.body) : '';
  const delimiter = body ? rawStringDelimiter(body) : 'JSON';
  const lines = [
    '#include <curl/curl.h>',
    '#include <iostream>',
    '',
    'int main() {',
    '  CURL* curl = curl_easy_init();',
    '  if (!curl) return 1;',
    '',
    `  curl_easy_setopt(curl, CURLOPT_URL, "${doubleQuote(req.url)}");`,
    `  curl_easy_setopt(curl, CURLOPT_CUSTOMREQUEST, "${req.method}");`,
  ];

  if (body) {
    lines.push('', `  const char* payload = R"${delimiter}(`, indent(body, 2), `  )${delimiter}";`);
    lines.push('  curl_easy_setopt(curl, CURLOPT_POSTFIELDS, payload);');
  }

  const headers = headersOf(req);
  if (headers.length) {
    lines.push('', '  struct curl_slist* headers = nullptr;');
    for (const h of headers) {
      lines.push(`  headers = curl_slist_append(headers, "${doubleQuote(`${h.key}: ${h.value}`)}");`);
    }
    lines.push('  curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);');
  }

  lines.push(
    '',
    '  CURLcode result = curl_easy_perform(curl);',
    '  if (result != CURLE_OK) std::cerr << curl_easy_strerror(result) << std::endl;',
  );

  if (headers.length) lines.push('  curl_slist_free_all(headers);');
  lines.push('  curl_easy_cleanup(curl);', '  return 0;', '}');
  return lines.join('\n');
}

function csharp(req: WidgetRequest): string {
  const lines = [
    'using System.Net.Http;',
    'using System.Text;',
    '',
    'using var client = new HttpClient();',
    'using var request = new HttpRequestMessage(',
    `    HttpMethod.${csharpMethod(req.method)},`,
    `    "${doubleQuote(req.url)}");`,
  ];

  for (const h of headersOf(req)) {
    lines.push(`request.Headers.TryAddWithoutValidation("${doubleQuote(h.key)}", "${doubleQuote(h.value)}");`);
  }

  if (req.body) {
    lines.push(
      '',
      'request.Content = new StringContent(',
      '    """',
      indent(formatBody(req.body), 4),
      '    """,',
      '    Encoding.UTF8,',
      '    "application/json");',
    );
  }

  lines.push(
    '',
    'using var response = await client.SendAsync(request);',
    'var body = await response.Content.ReadAsStringAsync();',
    'Console.WriteLine(body);',
  );
  return lines.join('\n');
}

function rust(req: WidgetRequest): string {
  const body = req.body ? formatBody(req.body) : '';
  const hashCount = body ? Math.max(1, ...[...body.matchAll(/"#+/g)].map((match) => match[0].length)) : 1;
  const hashes = '#'.repeat(hashCount);
  const lines = [
    '#[tokio::main]',
    'async fn main() -> Result<(), Box<dyn std::error::Error>> {',
    '    let client = reqwest::Client::new();',
    `    let response = client.request(reqwest::Method::${req.method}, "${doubleQuote(req.url)}")`,
  ];

  for (const h of headersOf(req)) {
    lines.push(`        .header("${doubleQuote(h.key)}", "${doubleQuote(h.value)}")`);
  }

  if (body) {
    lines.push(`        .body(r${hashes}"`, indent(body, 12), `        "${hashes})`);
  }

  lines.push(
    '        .send()',
    '        .await?;',
    '',
    '    let body = response.text().await?;',
    '    println!("{}", body);',
    '    Ok(())',
    '}',
  );
  return lines.join('\n');
}

function java(req: WidgetRequest): string {
  const body = req.body ? formatBody(req.body) : '';
  const lines = [
    'import java.net.URI;',
    'import java.net.http.HttpClient;',
    'import java.net.http.HttpRequest;',
    'import java.net.http.HttpResponse;',
    '',
    'HttpClient client = HttpClient.newHttpClient();',
    `HttpRequest.Builder builder = HttpRequest.newBuilder()`,
    `    .uri(URI.create("${doubleQuote(req.url)}"));`,
  ];

  for (const h of headersOf(req)) {
    lines.push(`builder.header("${doubleQuote(h.key)}", "${doubleQuote(h.value)}");`);
  }

  const bodyPublisher = body
    ? [
        'HttpRequest.BodyPublishers.ofString(',
        '        """',
        indent(javaTextBlock(body), 8),
        '        """)',
      ].join('\n')
    : 'HttpRequest.BodyPublishers.noBody()';

  lines.push(
    'HttpRequest request = builder',
    `    .method("${req.method}", ${bodyPublisher})`,
    '    .build();',
    '',
    'HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());',
    'System.out.println(response.body());',
  );
  return lines.join('\n');
}

function php(req: WidgetRequest): string {
  const body = req.body ? formatBody(req.body) : '';
  const lines = [
    '<?php',
    '',
    '$ch = curl_init();',
    '',
    'curl_setopt_array($ch, [',
    `    CURLOPT_URL => "${doubleQuote(req.url)}",`,
    '    CURLOPT_RETURNTRANSFER => true,',
    `    CURLOPT_CUSTOMREQUEST => "${req.method}",`,
  ];

  const headers = headersOf(req);
  if (headers.length) {
    lines.push('    CURLOPT_HTTPHEADER => [');
    for (const h of headers) {
      lines.push(`        "${doubleQuote(`${h.key}: ${h.value}`)}",`);
    }
    lines.push('    ],');
  }

  if (body) {
    lines.push('    CURLOPT_POSTFIELDS => <<<\'JSON\'', body, 'JSON,');
  }

  lines.push(
    ']);',
    '',
    '$response = curl_exec($ch);',
    'curl_close($ch);',
    '',
    'echo $response;',
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
    case 'node':
      return node(req);
    case 'cpp':
      return cpp(req);
    case 'csharp':
      return csharp(req);
    case 'rust':
      return rust(req);
    case 'java':
      return java(req);
    case 'php':
      return php(req);
  }
}
