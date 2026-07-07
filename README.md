# Rimbun Docs

Developer documentation for Rimbun's API platform, built with Next.js and Scalar.

This site is intentionally separate from the API runtime. The backend remains the source of truth for the OpenAPI contract, and this docs app renders a versioned copy of that contract.

## Routes

```text
/                 Documentation home
/api              Generated API reference rendered by Scalar
/quickstart       Integration quickstart
/authentication   Authentication guide
```

## Local Development

```bash
npm install
npm run openapi:refresh
npm run dev
```

## OpenAPI Contract

The rendered API reference reads:

```text
public/openapi/rimbun.json
```

Refresh it from the backend repo with:

```bash
npm run openapi:refresh
```

The refresh script copies:

```text
../rimbun-main/docs/openapi.json
```

Do not hand-edit endpoint reference pages. Update the backend contract, regenerate OpenAPI in `rimbun-main`, then refresh this artifact.

## Framework

This app uses:

```text
Next.js               App Router and document pages
Scalar                OpenAPI reference renderer
public/openapi/*.json Versioned OpenAPI artifacts
```

## Deployment

This is a server-rendered Next.js app (no `output: "export"`), so it needs a
Node host — not a static bucket.

The published API reference is read from the **committed** artifact
`public/openapi/rimbun.json`. The `openapi:refresh` script only runs locally
(it pulls from a sibling `rimbun-main` checkout that does not exist in CI), so
commit an up-to-date `public/openapi/rimbun.json` before deploying.

### Render (primary — matches the rest of the stack)

Create a **Web Service** from this repo:

```text
Runtime         Node
Build command   npm ci && npm run build
Start command   npm start
```

Notes:

- `next start` binds to the `PORT` Render provides; no extra config needed.
- Do not put `openapi:refresh` in the build command (no `rimbun-main` on the
  build host). The committed `public/openapi/rimbun.json` is the source.
- Add a custom domain `docs.rimbun.co` in the Render service settings and point
  a CNAME at the Render hostname.

### Vercel (alternative — native Next.js)

Import the repo; Vercel auto-detects Next.js (`npm run build`, no start command
needed). Add `docs.rimbun.co` under the project's Domains tab.

### URLs

```text
docs.rimbun.co       -> this app
docs.rimbun.co/api   -> generated API reference
www.rimbun.co        -> product frontend
```
