# Contributing to Xendr

Thanks for your interest in contributing to Xendr.

## Development Setup

Install dependencies:

```bash
npm ci
```

Start the local playground:

```bash
npm run dev
```

Run the full validation suite:

```bash
npm run check
```

## Project Structure

- `src/components/widget`: npm package components.
- `src/lib/widget`: parser, request, snippet, and execution logic.
- `src/app`: website and hosted playground only.
- `src/styles`: shared package and site styles.

Keep package code independent from `src/app`. Website and playground internals should not be exported from `@xendr/react`.

## Pull Requests

- Keep changes focused and small.
- Include screenshots or screen recordings for visible UI changes.
- Run `npm run check` before opening a PR.
- Update `README.md` when public props, usage, or behavior changes.
- Update `CHANGELOG.md` for user-visible changes.

## Bug Reports

Please include:

- Xendr version.
- React version.
- Browser and OS.
- A minimal reproduction or code snippet.
- Expected behavior and actual behavior.

## Feature Requests

Describe the user problem first, then the proposed API or UI. If the feature affects the npm package, include how it should work in React usage examples.
