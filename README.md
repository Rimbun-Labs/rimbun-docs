# Rimbun Docs

Developer documentation for Rimbun's API platform.

This site is intentionally separate from the API runtime. The backend remains the source of truth for the OpenAPI contract, and this docs app renders a versioned copy of that contract.

## Routes

```text
/                 Documentation home
/api              Generated API reference
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

## Deployment

Recommended URLs:

```text
docs.rimbun.co       -> this app
docs.rimbun.co/api   -> generated API reference
www.rimbun.co        -> product frontend
```
