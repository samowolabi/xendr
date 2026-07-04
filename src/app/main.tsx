import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import '@/styles/global.css'
import { ThemeProvider } from '@/theme'
import Embed from './pages/Embed/Embed'
import Landing from './pages/Landing/Landing'
import { ComponentLibrary, type ComponentLibrarySection } from './pages/ComponentLibrary/ComponentLibrary'

function appSection(pathname: string): ComponentLibrarySection | null {
  if (pathname === '/preview' || pathname === '/preview/playground') return 'preview'
  if (pathname === '/preview/component') return 'component'
  if (pathname === '/preview/widget') return 'widget'
  return null
}

// Simple path-based routing: / and /playground are public demos, /preview is the internal demo parent.
const path = window.location.pathname.replace(/\/+$/, '')
const section = appSection(path)

const page =
  path === '/embed' ? (
    <Embed />
  ) : path === '' || path === '/playground' ? (
    <Landing />
  ) : section ? (
    <ThemeProvider fullscreen>
      <ComponentLibrary section={section} />
    </ThemeProvider>
  ) : (
    <Landing />
  )

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {page}
    <Analytics />
  </StrictMode>,
)
