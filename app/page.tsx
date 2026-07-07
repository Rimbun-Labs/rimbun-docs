import Link from "next/link";
import { DocsShell } from "./docs-shell";

export default function HomePage() {
  return (
    <DocsShell>
      <TopBar />
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
            <h3>API first, product visible</h3>
            <p>
              The API is the integration surface. The product frontend remains where partners can configure access,
              inspect outputs, and operate workflows when they do not want to build every surface themselves.
            </p>
            <p>
              <Link className="topbar-link" href="/api">
                Open API reference
              </Link>
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
    </DocsShell>
  );
}

function TopBar() {
  return (
    <header className="topbar">
      <div>
        <span className="eyebrow">Financial intelligence APIs</span>
        <h1>Rimbun Developer Docs</h1>
      </div>
      <Link className="topbar-link" href="/openapi/rimbun.json">
        OpenAPI JSON
      </Link>
    </header>
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
