import type { HttpMethod } from '@/types';

export interface WidgetHeader {
  key: string;
  value: string;
}

export type WidgetAuth =
  | { type: 'none' }
  | { type: 'bearer'; token: string }
  | { type: 'apiKey'; key: string; value: string; in: 'header' };

/** A single documented API request that powers a widget. */
export interface WidgetRequest {
  /** Caption shown above the snippet card (e.g. "Get Users"). */
  title: string;
  method: HttpMethod;
  url: string;
  headers?: WidgetHeader[];
  /** Authentication config used by snippets and the interactive console. */
  auth?: WidgetAuth;
  /** Request body as a string (typically JSON). */
  body?: string;
  /** Example response body (JSON string) shown under the snippet. */
  sampleResponse?: string;
}

export interface WidgetResponse {
  status: number;
  statusText: string;
  headers: WidgetHeader[];
  body: string;
  timeMs: number;
  size: string;
  error?: string;
}

export type WidgetSendHandler = (request: WidgetRequest) => Promise<WidgetResponse> | WidgetResponse;

export type SnippetLanguage = 'curl' | 'javascript' | 'python' | 'go';
