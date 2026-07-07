import { DocsShell } from "../docs-shell";

export const metadata = {
  title: "Quickstart",
};

export default function QuickstartPage() {
  return (
    <DocsShell>
      <header className="topbar">
        <div>
          <span className="eyebrow">Integration path</span>
          <h1>Quickstart</h1>
        </div>
      </header>

      <section className="page-section narrow">
        <h2>Start with one partner credential and one recommendation flow.</h2>
        <p>
          A production integration should start with server-to-server authentication, stable external IDs, and a narrow
          first use case that proves the end-to-end data and decision path.
        </p>

        <ol className="steps">
          <li>
            <span>
              <strong>Create partner credentials</strong>
              <span>Issue an API key and, for signed ingestion, an HMAC secret for the partner environment.</span>
            </span>
          </li>
          <li>
            <span>
              <strong>Send customer and financial signals</strong>
              <span>Ingest normalized transaction, account, and product context with stable external IDs.</span>
            </span>
          </li>
          <li>
            <span>
              <strong>Request intelligence output</strong>
              <span>Read recommendation, prioritization, and explanation outputs through versioned API routes.</span>
            </span>
          </li>
        </ol>

        <pre className="code-block"><code>{`curl -X GET "https://api.rimbun.co/api/v1/partners/customers/cust_123/recommendations" \\
  -H "Authorization: Bearer rbk_live_..." \\
  -H "Content-Type: application/json"`}</code></pre>
      </section>
    </DocsShell>
  );
}
