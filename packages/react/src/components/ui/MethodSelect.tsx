import React from 'react';
import { Select } from './Select';
import type { SelectItem } from './Select';
import type { HttpMethod } from '@/types';

interface MethodSelectProps {
  value: HttpMethod;
  onChange: (method: HttpMethod) => void;
  /** Methods to offer. Defaults to the full set. */
  methods?: HttpMethod[];
  disabled?: boolean;
  className?: string;
}

const DEFAULT_METHODS: HttpMethod[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

/** Per-method text color, matching the MethodBadge tones. */
const methodColor: Record<HttpMethod, string> = {
  GET: 'text-[#52b788]',
  POST: 'text-sky-400',
  PUT: 'text-amber-400',
  PATCH: 'text-primary',
  DELETE: 'text-red-400',
};

const methodItems = (methods: HttpMethod[]): SelectItem<HttpMethod>[] =>
  methods.map((method) => ({
    id: method,
    label: method,
    className: `${methodColor[method]} font-semibold`,
  }));

/** Color-coded HTTP method dropdown for the request bar. */
export const MethodSelect: React.FC<MethodSelectProps> = ({
  value,
  onChange,
  methods = DEFAULT_METHODS,
  disabled,
  className,
}) => (
  <Select
    value={value}
    onChange={onChange}
    items={methodItems(methods)}
    disabled={disabled}
    minWidthClassName="min-w-[7rem]"
    className={className}
  />
);
