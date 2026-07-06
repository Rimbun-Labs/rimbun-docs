import { useEffect, useMemo, useState } from "react";
import {
  ApiOperation,
  createCurlExample,
  flattenOperations,
  loadOpenApiSpec,
  methodLabel,
  OpenApiSpec,
} from "./openapi";

type Page = "overview" | "quickstart" | "auth" | "reference";

const NAV: Array<{ page: Page; label: string; description: string }> = [
  { page: "overview", label: "Overview", description: "What Rimbun exposes and why it exists." },
  { page: "quickstart", label: "Quickstart", description: "The first integration path." },
  { page: "auth", label: "Authentication", description: "API keys, HMAC signing, and environments." },
  { page: "reference", label: "API Reference", description: "Generated from OpenAPI." },
];

function getInitialPage(): Page {
  const path = window.location.pathname;
  if (path.includes("/quickstart")) return "quickstart";
  if (path.includes("/authentication")) return "auth";
  if (path.includes("/api")) return "reference";
  return "overview";
}

export default function App() {
  const [page, setPage] = useState<Page>(getInitialPage);
  const [spec, setSpec] = useState<OpenApiSpec | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    loadOpenApiSpec()
      .then(setSpec)
      .catch((error: unknown) => {
        setLoadError(error instanceof Error ? error.message : "Failed to load OpenAPI contract");
      });
  }, []);

  function navigate(nextPage: Page) {
    setPage(nextPage);
    const path = pageToPath(nextPage);
    window.history.pushState(null, "", path);
  }

  useEffect(() => {
    const listener = () => setPage(getInitialPage());
    window.addEventListener("popstate", listener);
    return () => window.removeEventListener("popstate", listener);
  }, []);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="/" onClick={(event) => handleNavClick(event, "overview", navigate)}>
          <span className="brand-mark">R</span>
          <span>
            <strong>Rimbun Docs</strong>
            <small>Developer platform</small>
          </span>
        </a>

        <nav className="nav-list" aria-label="Documentation navigation">
          {NAV.map((item) => (
            <a
              key={item.page}
              className={page === item.page ? "nav-item active" : "nav-item"}
              href={pageToPath(item.page)}
              onClick={(event) => handleNavClick(event, item.page, navigate)}
            >
              <span>{item.label}</span>
              <small>{item.description}</small>
            </a>
          ))}
        </nav>

        <div className="sidebar-note">
          <strong>Contract source</strong>
          <span>{spec ? `Rimbun API ${spec.info.version}` : "Loading OpenAPI..."}</span>
        </div>
      </aside>

      <main className="content">
        <TopBar spec={spec} />
        {page === "overview" && <Overview />}
        {page === "quickstart" && <Quickstart />}
        {page === "auth" && <Authentication />}
        {page === "reference" && <ApiReference spec={spec} loadError={loadError} />}
      </main>
    </div>
  );
}

function pageToPath(page: Page): string {
  switch (page) {
    case "quickstart":
      return "/quickstart";
    case "auth":
      return "/authentication";
    case "reference":
      return "/api";
    default:
      return "/";
  }
}

function handleNavClick(
  event: React.MouseEvent<HTMLAnchorElement>,
  page: Page,
  navigate: (page: Page) => void,
) {
  event.preventDefault();
  navigate(page);
}

function TopBar({ spec }: { spec: OpenApiSpec | null }) {
  return (
    <header className="topbar">
      <div>
        <span className="eyebrow">Financial intelligence APIs</span>
        <h1>Rimbun API</h1>
      </div>
      <a className="topbar-link" href="/openapi/rimbun.json" target="_blank" rel="noreferrer">
        OpenAPI JSON
      </a>
    </header>
  );
}

function Overview() {
  return (
    <section className="page-section">
      <div className="hero">
        <span className="eyebrow">Decisioning layer</span>
        <h2>Explainable customer intelligence for financial institutions.</h2>
        <p>
          Rimbun turns account, transaction, product, and customer signals into structured outputs that banks,
          partners, and RM tools can consume through APIs.
        </p>
      </div>

      <div className="process-grid">
        <ProcessStep title="Data in" body="Partner-provided account, transaction, customer, and product data." />
        <ProcessStep title="Enrich" body="Normalize formats, classify spend, attach confidence, and detect gaps." />
        <ProcessStep title="Score" body="Apply versioned rules, product-fit logic, risk flags, and prioritization." />
        <ProcessStep title="Output" body="Return structured actions, reason codes, summaries, and evidence." />
      </div>

      <div className="split-section">
        <div>
          <h3>API first, UI optional</h3>
          <p>
            The API is the source of truth. Dashboards, widgets, RM tools, CRM integrations, and bank-owned channels are
            consumers of the same structured intelligence.
          </p>
        </div>
        <pre className="code-block"><code>{`{
  "customer_id": "cust_123",
  "priority_bucket": "high_value_upsell",
  "recommended_action": "home_financing_conversation",
  "reason_codes": ["salary_growth", "rent_payments"],
  "confidence": 0.84,
  "summary": "Customer shows rising income and recurring rent payments."
}`}</code></pre>
      </div>
    </section>
  );
}

function Quickstart() {
  return (
    <section className="page-section narrow">
      <h2>Quickstart</h2>
      <p>
        A production integration should start with one tenant credential, one ingestion shape, and one recommendation
        retrieval flow. Keep API authentication server-to-server.
      </p>

      <ol className="steps">
        <li>
          <strong>Create partner credentials</strong>
          <span>Issue an API key and, for signed ingestion, an HMAC secret for the partner environment.</span>
        </li>
        <li>
          <strong>Send customer and financial signals</strong>
          <span>Ingest normalized transaction, account, and product context with stable external IDs.</span>
        </li>
        <li>
          <strong>Request intelligence output</strong>
          <span>Read recommendation, prioritization, and explanation outputs through versioned API routes.</span>
        </li>
      </ol>

      <pre className="code-block"><code>{`curl -X GET "https://api.rimbun.co/api/v1/partners/customers/cust_123/recommendations" \\
  -H "Authorization: Bearer rbk_live_..." \\
  -H "Content-Type: application/json"`}</code></pre>
    </section>
  );
}

function Authentication() {
  return (
    <section className="page-section narrow">
      <h2>Authentication</h2>
      <p>
        Rimbun partner APIs use server-side credentials. Tenant context is derived from the authenticated credential,
        never from a request body or query string.
      </p>

      <div className="auth-grid">
        <div className="info-panel">
          <h3>API key</h3>
          <p>Used for server-to-server reads and partner workflows. Store only the hash in the platform database.</p>
          <pre className="code-block compact"><code>{`Authorization: Bearer rbk_live_...`}</code></pre>
        </div>
        <div className="info-panel">
          <h3>HMAC signing</h3>
          <p>Used where request integrity and replay protection matter, especially ingestion and partner callbacks.</p>
          <pre className="code-block compact"><code>{`X-Rimbun-Timestamp: 1780000000
X-Rimbun-Nonce: nonce_123
X-Rimbun-Signature: sha256=...`}</code></pre>
        </div>
      </div>

      <p className="callout">
        Production clients should treat credentials as backend secrets. Do not place partner API keys or HMAC secrets in
        browser applications.
      </p>
    </section>
  );
}

function ApiReference({ spec, loadError }: { spec: OpenApiSpec | null; loadError: string | null }) {
  const operations = useMemo(() => (spec ? flattenOperations(spec) : []), [spec]);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return operations;
    return operations.filter((operation) =>
      [operation.id, operation.summary, operation.tag].some((value) => value.toLowerCase().includes(needle)),
    );
  }, [operations, query]);

  const selected = useMemo<ApiOperation | null>(() => {
    if (filtered.length === 0) return null;
    return filtered.find((operation) => operation.id === selectedId) ?? filtered[0];
  }, [filtered, selectedId]);

  if (loadError) {
    return <p className="error-state">{loadError}</p>;
  }

  if (!spec) {
    return <p className="loading-state">Loading API reference...</p>;
  }

  return (
    <section className="reference-layout">
      <div className="endpoint-list">
        <label className="search-label">
          <span>Search endpoints</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="recommendations, health, partners" />
        </label>
        <div className="endpoint-count">{filtered.length} endpoints</div>
        <div className="endpoint-scroll">
          {filtered.map((operation) => (
            <button
              key={operation.id}
              className={selected?.id === operation.id ? "endpoint-button active" : "endpoint-button"}
              onClick={() => setSelectedId(operation.id)}
            >
              <span className={`method method-${operation.method}`}>{methodLabel(operation.method)}</span>
              <span className="endpoint-path">{operation.path}</span>
              <small>{operation.summary}</small>
            </button>
          ))}
        </div>
      </div>

      <div className="endpoint-detail">
        {selected ? <EndpointDetail operation={selected} /> : <p>No endpoints match this search.</p>}
      </div>
    </section>
  );
}

function EndpointDetail({ operation }: { operation: ApiOperation }) {
  const responses = Object.keys(operation.operation.responses ?? {});

  return (
    <article className="endpoint-article">
      <div className="endpoint-heading">
        <span className={`method method-${operation.method}`}>{methodLabel(operation.method)}</span>
        <code>{operation.path}</code>
      </div>
      <h2>{operation.summary}</h2>
      {operation.description && <p>{operation.description}</p>}

      <h3>Request</h3>
      <pre className="code-block"><code>{createCurlExample(operation)}</code></pre>

      <h3>Responses</h3>
      <div className="response-list">
        {responses.length > 0 ? (
          responses.map((status) => <span key={status} className="status-pill">{status}</span>)
        ) : (
          <span>No response metadata in OpenAPI contract.</span>
        )}
      </div>

      <details className="raw-details">
        <summary>OpenAPI operation</summary>
        <pre className="code-block"><code>{JSON.stringify(operation.operation, null, 2)}</code></pre>
      </details>
    </article>
  );
}

function ProcessStep({ title, body }: { title: string; body: string }) {
  return (
    <div className="process-step">
      <h3>{title}</h3>
      <p>{body}</p>
    </div>
  );
}
