import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
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

// Simple path-based routing: /preview is the demo parent, else landing page.
const path = window.location.pathname.replace(/\/+$/, '')
const section = appSection(path)

const page =
  path === '/embed' ? (
    <Embed />
  ) : section ? (
    <ThemeProvider fullscreen>
      <ComponentLibrary section={section} />
    </ThemeProvider>
  ) : (
    <Landing />
  )

createRoot(document.getElementById('root')!).render(<StrictMode>{page}</StrictMode>)
