# Rimbun Docs

Developer documentation for Rimbun's API platform, built with Next.js.

This site is intentionally separate from the API runtime. The backend remains the source of truth for the OpenAPI contract, and this docs app renders a versioned copy of that contract.

## Routes

```text
/                 Documentation home
/api              API reference written into the page at build time
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

The API reference is generated from:

```text
public/openapi/rimbun.json
```

Refresh it from the backend repo with:

```bash
npm run openapi:refresh
```

The refresh script copies:

```text
../rimbun-main/docs/openapi.partner.json
```

That is the **partner-audience** contract (not the full internal `docs/openapi.json`). Regenerate it in the backend first:

```bash
cd ../rimbun-main && npm run openapi:public
```

Do not hand-edit endpoint reference pages. Update the backend contract, regenerate OpenAPI in `rimbun-main`, then refresh this artifact.

## Framework

This app uses:

```text
Next.js               App Router, static export
public/openapi/*.json Versioned OpenAPI artifacts, rendered into /api HTML at build
```

## Deployment

`next.config.ts` sets `output: "export"`. `npm run build` writes the site,
including the API reference, to `out/`. Publish that folder as static files.

The API page is built from the committed artifact `public/openapi/rimbun.json`.
The `openapi:refresh` script only runs locally (it pulls from a sibling
`rimbun-main` checkout that does not exist in CI), so commit an up-to-date
`public/openapi/rimbun.json` before deploying. Do not put `openapi:refresh` in
the build command.

### Render

Publish the `out/` directory as a static site. Point `docs.rimbun.co` at that
host.

### Vercel (alternative — native Next.js)

Import the repo; Vercel auto-detects Next.js (`npm run build`, no start command
needed). Add `docs.rimbun.co` under the project's Domains tab.

### URLs

```text
docs.rimbun.co       -> this app
docs.rimbun.co/api   -> generated API reference
www.rimbun.co        -> product frontend
```
