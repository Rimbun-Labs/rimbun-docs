import { DocsShell } from "../docs-shell";

export const metadata = {
  title: "Quickstart",
};

export default function QuickstartPage() {
  return (
    <DocsShell>
      <header className="topbar">
        <div>
          <span className="eyebrow">First request</span>
          <h1>Quickstart</h1>
        </div>
      </header>

      <section className="page-section narrow">
        <h2>Make your first authenticated request.</h2>
        <p>
          Rimbun APIs are designed for server-to-server use. Start with a partner API key, stable customer identifiers,
          and one recommendation flow before adding broader ingestion and automation.
        </p>

        <ol className="steps">
          <li>
            <span>
              <strong>Get API credentials</strong>
              <span>Use a partner API key for authenticated server requests.</span>
            </span>
          </li>
          <li>
            <span>
              <strong>Use stable customer IDs</strong>
              <span>Reference customers with identifiers that remain consistent across requests.</span>
            </span>
          </li>
          <li>
            <span>
              <strong>Read recommendations</strong>
              <span>Retrieve actions, explanations, and confidence signals for a customer.</span>
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
