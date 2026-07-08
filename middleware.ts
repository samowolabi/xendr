import { next } from '@vercel/edge'

// Markdown-for-Agents content negotiation.
//
// Vercel's `vercel.json` rewrites run *after* the static filesystem, so they
// cannot intercept `/` (it always resolves to the static index.html first).
// Edge Middleware runs *before* file serving, which is the only place we can
// swap the response body based on the request's Accept header.
export const config = { matcher: '/' }

/** True when the client actively prefers markdown (ignores `text/markdown;q=0`). */
function wantsMarkdown(accept: string): boolean {
  return accept
    .split(',')
    .map((part) => part.trim().toLowerCase())
    .some((part) => {
      if (part !== 'text/markdown' && !part.startsWith('text/markdown;')) return false
      const q = /;\s*q=([0-9.]+)/.exec(part)
      return !q || Number(q[1]) > 0
    })
}

export default async function middleware(request: Request): Promise<Response> {
  const accept = request.headers.get('accept') ?? ''

  if (request.method === 'GET' && wantsMarkdown(accept)) {
    // Serve the canonical markdown rendition (single source of truth in
    // apps/www/public/index.md). Fetching it as a static asset does not
    // re-enter middleware, since the matcher only covers `/`.
    const md = await fetch(new URL('/index.md', request.url))
    if (md.ok) {
      const body = await md.text()
      return new Response(body, {
        status: 200,
        headers: {
          'content-type': 'text/markdown; charset=utf-8',
          'x-markdown-tokens': String(Math.ceil(body.length / 4)),
          vary: 'Accept',
          'cache-control': 'public, max-age=0, must-revalidate',
        },
      })
    }
  }

  // Browsers (and anything not asking for markdown) get the normal HTML SPA.
  return next()
}
