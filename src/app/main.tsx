import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/styles/global.css'
import Landing from '@/features/landing/Landing'
import { ThemeProvider } from '@/theme'
import { ComponentPreview, type PreviewSection } from './pages/ComponentPreview'
import { WidgetDemo } from './pages/WidgetDemo'

function previewSection(pathname: string): PreviewSection | null {
  if (pathname === '/preview' || pathname === '/preview/preview') return 'preview'
  if (pathname === '/preview/components' || pathname === '/preview/component') return 'components'
  if (pathname === '/preview/widgets' || pathname === '/preview/widget') return 'widgets'
  return null
}

// Simple path-based routing: /preview/* (preview surfaces), /widget (widget demo), else app.
const path = window.location.pathname.replace(/\/+$/, '')
const section = previewSection(path)

const page =
  section ? (
    <ThemeProvider fullscreen>
      <ComponentPreview section={section} />
    </ThemeProvider>
  ) : path === '/widget' ? (
    <ThemeProvider fullscreen>
      <WidgetDemo />
    </ThemeProvider>
  ) : (
    <Landing />
  )

createRoot(document.getElementById('root')!).render(<StrictMode>{page}</StrictMode>)
