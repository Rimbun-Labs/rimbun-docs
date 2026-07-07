import Link from "next/link";
import { DocsShell } from "./docs-shell";

export default function HomePage() {
  return (
    <DocsShell>
      <TopBar />
      <section className="page-section">
        <div className="hero">
          <span className="eyebrow">Financial intelligence APIs</span>
          <h2>Explainable customer signals for financial institutions.</h2>
          <p>
            Rimbun turns account, transaction, product, and customer context into ranked actions, reason codes, and
            summaries that banks and partners can embed in their own channels.
          </p>
        </div>

        <div className="process-grid">
          <ProcessStep title="Connect" body="Send customer, account, transaction, and product context." />
          <ProcessStep title="Classify" body="Normalize records, classify activity, and attach confidence." />
          <ProcessStep title="Rank" body="Prioritize customer needs, product fit, and attention queues." />
          <ProcessStep title="Explain" body="Return actions, summaries, reason codes, and supporting evidence." />
        </div>

        <div className="feature-band">
          <div>
            <h3>Built for partner channels</h3>
            <p>
              Use the API to power RM workflows, partner dashboards, and digital experiences without exposing raw
              decision logic to end users.
            </p>
            <p>
              <Link className="topbar-link" href="/api">
                Open API reference
              </Link>
            </p>
          </div>
          <pre className="code-block"><code>{`{
  "customer_id": "cust_123",
  "priority": "high",
  "action": "home_financing_conversation",
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
        <span className="eyebrow">Developer docs</span>
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
