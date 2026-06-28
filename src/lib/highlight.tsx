import React from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-go';
// javascript, markup, css, clike ship with prismjs core.

export type CodeLanguage = 'json' | 'bash' | 'javascript' | 'python' | 'go' | 'plain';

const grammars: Partial<Record<CodeLanguage, Prism.Grammar>> = {
  json: Prism.languages.json,
  bash: Prism.languages.bash,
  javascript: Prism.languages.javascript,
  python: Prism.languages.python,
  go: Prism.languages.go,
};

/** Recursively render a Prism token into themed <span>s (.token.<type>). */
function renderToken(token: string | Prism.Token, key: number): React.ReactNode {
  if (typeof token === 'string') return token;
  const children = Array.isArray(token.content)
    ? token.content.map((child, i) => renderToken(child, i))
    : renderToken(token.content, 0);
  return (
    <span key={key} className={`token ${token.type}`}>
      {children}
    </span>
  );
}

/**
 * Tokenize a single line with Prism and render it as themed React nodes.
 * Per-line on purpose: CodeBlock owns line numbers and the staggered reveal, so
 * Prism only colors the text — numbering and animation are untouched.
 */
export function highlightLine(line: string, language: CodeLanguage): React.ReactNode {
  const grammar = language === 'plain' ? undefined : grammars[language];
  if (!grammar || !line) return line;
  return Prism.tokenize(line, grammar).map((token, i) => renderToken(token, i));
}
