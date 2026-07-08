# Xendr

> Lightweight, embeddable API tester for developer documentation.

Xendr is a lightweight API tester you can embed in developer docs, websites, and
guides. It lets developers run documented requests — authenticate, edit params,
send, and inspect responses — right where the API is documented, instead of
copying a cURL example into Postman, Swagger, or Hoppscotch.

- Website: https://www.xendr.dev/
- Playground: https://www.xendr.dev/playground
- npm package: https://www.npmjs.com/package/@xendr/react
- Source: https://github.com/samowolabi/xendr

## Install (React)

```bash
npm i @xendr/react
```

```tsx
import { ApiPlayground } from '@xendr/react'

<ApiPlayground request="curl https://api.example.com/users" />
```

## Embed anywhere (iframe)

Any site that supports iframes — plain HTML, Mintlify, Vue, and more:

```html
<iframe
  src="https://www.xendr.dev/embed?c=YOUR_CONFIG"
  width="100%"
  height="720"
  style="border: 0; border-radius: 16px;"
></iframe>
```

## Features

- **Code snippets in multiple languages** — JavaScript, Python, Go, PHP, Ruby, Java, C#.
- **Try-it-out console** for live API requests — method, URL, auth, params, headers, body.
- **Documented error responses** — 400, 401, 403, 404, 422, 500.
- **cURL import** — paste a cURL command and get an editable request.
- **Brand customization** — primary color, background, and light/dark modes.

## At a glance

- Lightweight: ~27 KB
- Customizable: yes
- Snippet languages: 10
- No analytics or tracking in the `@xendr/react` package

## FAQ

### What is Xendr?
Xendr is a lightweight API tester you can embed in developer documentation,
websites, and guides. It lets developers test requests where the API is
documented instead of copying cURL into another tool.

### Where can I embed Xendr?
You can embed Xendr in developer docs, product websites, API guides, and internal
portals. React apps can use `@xendr/react` directly, and other sites can use the
hosted iframe embed.

### Does it replace tools like Postman or Hoppscotch?
For documentation workflows, yes. Instead of copying a cURL example into Postman,
Swagger, or Hoppscotch, users can authenticate, edit, and send the request
directly inside your docs.

### Can developers preview code in other languages?
Yes. Xendr can show the same request as cURL and other programming language
snippets, so developers can copy code that matches their stack.

### Can I document error responses?
Yes. You can add sample responses for different HTTP status codes, including error
cases, so users understand what each API response looks like.

### Can users import a new cURL request?
Yes, when cURL import is enabled. Users can paste a new cURL request and turn it
into an editable request inside the tester.

### Can I customize the widget to match my brand?
Yes. You can configure primary color, background, mode, visible snippet languages,
default view, imports, and sample responses.

### Is the npm package tracking my users?
The `@xendr/react` package is built as a standalone component and does not include
any analytics or tracking.
