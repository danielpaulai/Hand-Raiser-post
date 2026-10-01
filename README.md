# Hand-Raiser Post Writer · AI Founder Circle

One self-contained page where a member fills five blanks and gets a ready-to-post hand-raiser package: three post variants, a DM variant, the capture line, and four reply scripts.

- Live: https://afc-hand-raiser.vercel.app
- `index.html` is the whole app. Vanilla JS, no build step, autosaves to localStorage.
- "See an Example" loads Danny's AI Founder Circle worked example.

## The AI backend (what the developer wires up)

The page makes exactly one call:

```
POST /api/generate
Content-Type: application/json

{ "prompt": "<the full writing brief, built client-side>" }
```

Expected response:

```
200 { "html": "<plain text output>" }
```

The client parses the text by its capitalized headings (POST VARIANT 1, POST VARIANT 2, POST VARIANT 3, DM VARIANT, CAPTURE LINE, REPLY 1 DELIVERY, REPLY 2 THANKS, REPLY 3 REAL QUESTION, REPLY 4 DAY-3 SILENCE) and renders one copy-button block per section.

A working reference implementation is included at `api/generate.js` (Vercel serverless, Claude claude-sonnet-5). To use it as-is, deploy on Vercel and set one environment variable: `ANTHROPIC_API_KEY`. `ACCESS_CODE` is optional (adds an `x-access-code` header gate). To replace it with FounderOS's own backend, keep the same request and response shape and nothing on the page changes.

If the endpoint is missing or errors, the page shows a fallback: the member copies the brief into Claude by hand and pastes the result back. Do not remove that path.

## Rules

- One file, no frameworks, no CDN scripts.
- Fonts: Rethink Sans, Inter, JetBrains Mono (Google Fonts).
- Brand red #E90D41. No em dashes anywhere. No third-party guru or program names.
- The five-blank shape of the post never changes: I just made THING for PERSON who wants RESULT in TIMEFRAME. One personality line. Want a copy? Drop KEYWORD in the comments.
