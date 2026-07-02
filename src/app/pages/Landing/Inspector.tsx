import { useEffect, useState } from 'react'
import type { ApiPlaygroundMode, ApiPlaygroundResponseExample } from '@ragrails/api-playground-react'
import { CodeBlock, ColorField, Icon, Select, Switch, Tabs, TextField, Tooltip } from '@/components/ui'
import type { IconName } from '@/components/ui'
import { cn } from '@/lib/cn'
import type { PlaygroundConfig } from './playground'

const accentButton =
  'flex w-full items-center rounded-md bg-primary px-3.5 py-2.5 text-primary-contrast transition hover:brightness-95 active:scale-[1.01]'

const embedButton =
  'hover:scale-[1.015] hover:shadow-[0_10px_24px_color-mix(in_srgb,var(--primary)_24%,transparent)]'

const MODE_TABS: { id: ApiPlaygroundMode; label: string }[] = [
  { id: 'dark', label: 'Dark' },
  { id: 'light', label: 'Light' },
  { id: 'system', label: 'Auto' },
]

function targetLabel(icon: IconName, text: string) {
  return (
    <span className="flex items-center gap-1.5">
      <Icon name={icon} className="h-3.5 w-3.5" />
      {text}
    </span>
  )
}

const EMBED_TARGETS = [
  { id: 'react', label: targetLabel('react', 'React') },
  { id: 'iframe', label: targetLabel('code', 'iframe') },
] as const

type EmbedTarget = (typeof EMBED_TARGETS)[number]['id']

// One-line "which should I pick" guidance shown under the target tabs.
const TARGET_INFO: Record<EmbedTarget, string> = {
  react: 'Best for React apps — install the package and render the component.',
  iframe: 'Works on any site — paste the snippet, no install or build step.',
}

// Common HTTP status codes with their standard reason phrases.
const HTTP_STATUS: { code: number; text: string }[] = [
  { code: 100, text: 'Continue' },
  { code: 101, text: 'Switching Protocols' },
  { code: 200, text: 'OK' },
  { code: 201, text: 'Created' },
  { code: 202, text: 'Accepted' },
  { code: 204, text: 'No Content' },
  { code: 206, text: 'Partial Content' },
  { code: 301, text: 'Moved Permanently' },
  { code: 302, text: 'Found' },
  { code: 304, text: 'Not Modified' },
  { code: 307, text: 'Temporary Redirect' },
  { code: 308, text: 'Permanent Redirect' },
  { code: 400, text: 'Bad Request' },
  { code: 401, text: 'Unauthorized' },
  { code: 402, text: 'Payment Required' },
  { code: 403, text: 'Forbidden' },
  { code: 404, text: 'Not Found' },
  { code: 405, text: 'Method Not Allowed' },
  { code: 406, text: 'Not Acceptable' },
  { code: 408, text: 'Request Timeout' },
  { code: 409, text: 'Conflict' },
  { code: 410, text: 'Gone' },
  { code: 415, text: 'Unsupported Media Type' },
  { code: 422, text: 'Unprocessable Entity' },
  { code: 429, text: 'Too Many Requests' },
  { code: 500, text: 'Internal Server Error' },
  { code: 501, text: 'Not Implemented' },
  { code: 502, text: 'Bad Gateway' },
  { code: 503, text: 'Service Unavailable' },
  { code: 504, text: 'Gateway Timeout' },
]

/* ── Layout primitives (design-tool inspector) ────────────────────────────── */

interface Hint {
  /** Short explanation of what the control does. */
  text: string
  /** The `<ApiPlayground />` prop it maps to, e.g. `title` or `customization.primary`. */
  configKey?: string
}

const hintBubbleClass = 'max-w-[210px] whitespace-normal text-left text-[12px] font-normal leading-snug'

function hintContent({ text, configKey }: Hint) {
  return (
    <>
      <span className="block">{text}</span>
      {configKey && (
        <code className="mt-1 inline-block rounded bg-content/10 px-1.5 py-0.5 font-mono text-[11px] font-medium text-content">
          {configKey}
        </code>
      )}
    </>
  )
}

// Wraps a label in its hint tooltip (hover/focus the label itself — no icon).
function WithHint({ hint, children }: { hint?: Hint; children: React.ReactElement }) {
  if (!hint) return children
  return (
    <Tooltip side="top" align="start" className={hintBubbleClass} content={hintContent(hint)}>
      {children}
    </Tooltip>
  )
}

// Sections read as blocks via a bold heading + generous top padding — no
// dividers or bordered containers (per the design brief's spacing rhythm).
function Section({ title, hint, children }: { title: string; hint?: Hint; children: React.ReactNode }) {
  return (
    <section className="pb-2">
      <h3 className="px-4 pb-2 pt-2.5 text-[14px] font-semibold text-content">
        <WithHint hint={hint}>
          <span>{title}</span>
        </WithHint>
      </h3>
      {children}
    </section>
  )
}

function Row({
  icon,
  label,
  align = 'center',
  hint,
  children,
}: {
  icon: IconName
  label: string
  align?: 'center' | 'start'
  hint?: Hint
  children: React.ReactNode
}) {
  return (
    <div className={cn('flex justify-between gap-4 px-4 py-2', align === 'start' ? 'items-start' : 'items-center')}>
      <WithHint hint={hint}>
        <span
          className={cn(
            'flex shrink-0 items-center gap-2 text-[13px] font-medium text-content',
            align === 'start' && 'pt-2',
          )}
        >
          <Icon name={icon} className="h-3.5 w-3.5 text-muted" />
          {label}
        </span>
      </WithHint>
      <div className="flex min-w-0 flex-1 justify-end">{children}</div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1.5 text-[12px] font-medium text-muted">{label}</div>
      {children}
    </div>
  )
}

// Editor for the per-status sample responses shown in the widget's snippet and
// console. Drives cfg.responseExamples, which flows straight into the widget.
// One tab per configured response (labelled by status code) + an "Add" dropdown
// of the remaining HTTP codes; the active tab's body is edited below.
function ResponsesEditor({ cfg }: { cfg: PlaygroundConfig }) {
  const { responseExamples: examples, setResponseExamples } = cfg
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (activeIndex >= examples.length) setActiveIndex(Math.max(0, examples.length - 1))
  }, [examples.length, activeIndex])

  const update = (index: number, patch: Partial<ApiPlaygroundResponseExample>) =>
    setResponseExamples(examples.map((ex, i) => (i === index ? { ...ex, ...patch } : ex)))

  const remove = (index: number) => {
    setResponseExamples(examples.filter((_, i) => i !== index))
    if (index <= activeIndex) setActiveIndex((current) => Math.max(0, current - 1))
  }

  const add = (value: string) => {
    const code = Number(value)
    const found = HTTP_STATUS.find((s) => s.code === code)
    setResponseExamples([...examples, { status: code, statusText: found?.text ?? '', body: '{\n  \n}' }])
    setActiveIndex(examples.length)
  }

  const tabItems = examples.map((ex, i) => ({ id: `${i}`, label: `${ex.status}` }))
  const addItems = HTTP_STATUS.filter((s) => !examples.some((ex) => ex.status === s.code)).map((s) => ({
    id: `${s.code}`,
    label: `${s.code} ${s.text}`,
  }))
  const active = examples[activeIndex]

  return (
    <div className="space-y-2.5 px-4 pb-1">
      <div className="flex items-center justify-between gap-2">
        {examples.length > 0 ? (
          <Tabs
            items={tabItems}
            activeId={`${activeIndex}`}
            onChange={(id) => setActiveIndex(Number(id))}
            size="sm"
            className="min-w-0 flex-1 overflow-x-auto [&_button]:font-mono"
          />
        ) : (
          <span className="text-[12px] text-muted">No responses configured</span>
        )}
        {addItems.length > 0 && (
          <Select
            value=""
            onChange={add}
            items={addItems}
            size="sm"
            triggerLabel="Add"
            align="right"
            minWidthClassName="min-w-52"
            className="shrink-0 rounded border border-border bg-surface"
          />
        )}
      </div>

      {active && (
        <div className="space-y-2 rounded-md border border-border bg-surface-2/40 p-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[12px] font-medium text-content">
              {active.status}
              {active.statusText ? ` ${active.statusText}` : ''}
            </span>
            <button
              type="button"
              onClick={() => remove(activeIndex)}
              aria-label={`Remove ${active.status} response`}
              className="grid h-7 w-7 shrink-0 place-items-center rounded text-muted transition-colors hover:bg-surface-2 hover:text-content"
            >
              <Icon name="trash" className="h-3.5 w-3.5" />
            </button>
          </div>
          <textarea
            value={active.body}
            onChange={(e) => update(activeIndex, { body: e.target.value })}
            spellCheck={false}
            rows={5}
            aria-label={`${active.status} response body`}
            className="w-full resize-none rounded border border-border bg-surface p-2 font-mono text-[11px] leading-relaxed text-content focus:border-primary focus:outline-none"
          />
        </div>
      )}
    </div>
  )
}

/* ── Config view ──────────────────────────────────────────────────────────── */

function Controls({ cfg, onEmbed }: { cfg: PlaygroundConfig; onEmbed: () => void }) {
  return (
    <>
      <div className="border-b border-border p-3">
        <button
          type="button"
          onClick={onEmbed}
          className={cn(accentButton, embedButton, 'pg-export-button relative overflow-hidden justify-between')}
        >
          <span className="relative z-10 flex items-center gap-2 text-[14px] font-semibold">
            <Icon name="export" className="h-4 w-4" />
            Embed
            <span className="rounded-md bg-white px-1.5 py-0.5 text-[11px] font-bold leading-none text-primary">
              Widget
            </span>
          </span>
          <Icon name="arrow-right" className="relative z-10 h-4 w-4 opacity-90" />
        </button>
      </div>

      <Section title="Request">
        <Row
          icon="code"
          label="Title"
          hint={{ text: 'Heading shown above the request in the console.', configKey: 'title' }}
        >
          <TextField
            size="sm"
            value={cfg.title}
            onChange={(e) => cfg.setTitle(e.target.value)}
            placeholder="Console heading"
            containerClassName="w-full max-w-[200px]"
          />
        </Row>
        <div className="px-4 pb-1 pt-2">
          <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-muted/70">
            cURL request
          </label>
          <textarea
            value={cfg.request}
            onChange={(e) => cfg.setRequest(e.target.value)}
            spellCheck={false}
            rows={6}
            className="w-full resize-none rounded-md border border-border bg-surface-2 p-2.5 font-mono text-[12px] leading-relaxed text-content focus:border-primary focus:outline-none"
          />
        </div>
      </Section>

      <Section
        title="Responses"
        hint={{ text: 'Sample responses shown per status code in the snippet view.', configKey: 'responseExamples' }}
      >
        <ResponsesEditor cfg={cfg} />
      </Section>

      <Section title="Appearance">
        <Row
          icon={cfg.widgetMode === 'light' ? 'sun' : 'moon'}
          label="Widget mode"
          hint={{ text: 'Widget colour theme: dark, light, or follow the OS.', configKey: 'mode' }}
        >
          <Tabs
            variant="segmented"
            size="sm"
            items={MODE_TABS}
            activeId={cfg.widgetMode}
            onChange={(id) => cfg.changeWidgetMode(id as ApiPlaygroundMode)}
          />
        </Row>
        <Row
          icon="palette"
          label="Primary"
          align="start"
          hint={{ text: "The widget's brand / accent colour.", configKey: 'customization.primary' }}
        >
          <ColorField value={cfg.primary} onChange={cfg.setPrimary} className="max-w-[160px]" />
        </Row>
        <Row
          icon="palette"
          label="Widget bg"
          align="start"
          hint={{ text: 'Widget background colour for the active mode.', configKey: 'customization.{mode}.background' }}
        >
          <ColorField value={cfg.background} onChange={cfg.changeBackground} className="max-w-[160px]" />
        </Row>
      </Section>

      <Section title="Behavior">
        <Row
          icon="magic"
          label="Editable"
          hint={{ text: 'Allow editing the request in the console.', configKey: 'editable' }}
        >
          <Switch checked={cfg.editable} onChange={cfg.setEditable} />
        </Row>
        <Row
          icon="import"
          label="Allow import"
          hint={{ text: 'Show the cURL import action in the console.', configKey: 'allowImport' }}
        >
          <Switch checked={cfg.allowImport} onChange={cfg.setAllowImport} />
        </Row>
        <Row
          icon="restart"
          label="Sync snippet"
          hint={{ text: 'Keep the start snippet in sync with console edits.', configKey: 'syncSnippet' }}
        >
          <Switch checked={cfg.syncSnippet} onChange={cfg.setSyncSnippet} />
        </Row>
        <Row
          icon="code"
          label="Start console"
          hint={{ text: 'Open the widget directly in the console instead of the snippet.', configKey: 'defaultView' }}
        >
          <Switch
            checked={cfg.defaultView === 'console'}
            onChange={(checked) => cfg.setDefaultView(checked ? 'console' : 'snippet')}
          />
        </Row>
      </Section>
    </>
  )
}

/* ── Embed view ───────────────────────────────────────────────────────────── */

function EmbedPanel({ code, iframeCode, onBack }: { code: string; iframeCode: string; onBack: () => void }) {
  const [target, setTarget] = useState<EmbedTarget>('react')
  const [copied, setCopied] = useState(false)
  const copyValue = target === 'iframe' ? iframeCode : code

  const copy = () =>
    navigator.clipboard?.writeText(copyValue).then(() => {
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    })

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex items-center gap-2 border-b border-border p-3">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to controls"
          className="grid h-8 w-8 place-items-center rounded-md text-muted transition-colors hover:bg-surface-2 hover:text-content"
        >
          <Icon name="arrow-left" className="h-4 w-4" />
        </button>
        <div className="text-[14px] font-semibold">Embed widget</div>
      </div>

      <div className="flex flex-col gap-3 px-4 py-2">
        <Tabs
          variant="segmented"
          size="sm"
          items={[...EMBED_TARGETS]}
          activeId={target}
          onChange={(id) => setTarget(id as EmbedTarget)}
        />

        <p className="text-[13px] leading-relaxed text-muted">{TARGET_INFO[target]}</p>

        {target === 'react' ? (
          <>
            <Field label="1 · Install the package">
              <CodeBlock code="npm i @ragrails/api-playground-react" language="bash" />
            </Field>
            <Field label="2 · Add the component">
              <CodeBlock code={code} language="javascript" maxHeight="320px" />
            </Field>
            <button type="button" onClick={copy} className={cn(accentButton, 'justify-center gap-2 text-[14px] font-semibold')}>
              <Icon name={copied ? 'check' : 'copy'} className="h-4 w-4" />
              {copied ? 'Copied' : 'Copy component'}
            </button>
          </>
        ) : target === 'iframe' ? (
          <>
            <Field label="Paste this where the widget should appear">
              <CodeBlock code={iframeCode} language="plain" maxHeight="320px" />
            </Field>
            <p className="text-[12px] leading-relaxed text-muted">
              All your settings travel inside the URL (base64-encoded) — no backend or build step needed.
            </p>
            <button type="button" onClick={copy} className={cn(accentButton, 'justify-center gap-2 text-[14px] font-semibold')}>
              <Icon name={copied ? 'check' : 'copy'} className="h-4 w-4" />
              {copied ? 'Copied' : 'Copy iframe'}
            </button>
          </>
        ) : null}
      </div>
    </div>
  )
}

/* ── Inspector ────────────────────────────────────────────────────────────── */

export function Inspector({ cfg }: { cfg: PlaygroundConfig }) {
  const [embedOpen, setEmbedOpen] = useState(false)

  return (
    <aside className="pg-inspector flex min-h-0 flex-col overflow-y-auto bg-surface">
      {embedOpen ? (
        <EmbedPanel code={cfg.code} iframeCode={cfg.iframeCode} onBack={() => setEmbedOpen(false)} />
      ) : (
        <Controls cfg={cfg} onEmbed={() => setEmbedOpen(true)} />
      )}
    </aside>
  )
}
