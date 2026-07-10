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
          and one recommendation flow before adding statement ingestion and profile/goal writes.
        </p>

        <ol className="steps">
          <li>
            <span>
              <strong>Get API credentials</strong>
              <span>Use a partner API key for authenticated server requests. Tenant scope comes from the key.</span>
            </span>
          </li>
          <li>
            <span>
              <strong>Use stable customer IDs</strong>
              <span>
                Reference customers with your external customer id (same id used in ingestion as
                <code>providerAccountId</code>).
              </span>
            </span>
          </li>
          <li>
            <span>
              <strong>Ingest context, then read recommendations</strong>
              <span>
                Push statements (HMAC), assessment scores, goals, and product profiles as needed, then retrieve ranked
                banking recommendations for that customer.
              </span>
            </span>
          </li>
        </ol>

        <pre className="code-block"><code>{`# Recommendations (API key)
curl -X GET "https://api.rimbun.co/api/v1/partners/customers/cust_123/recommendations" \\
  -H "Authorization: Bearer rbk_live_..." \\
  -H "Content-Type: application/json"

# Assessment ingest (API key)
curl -X PUT "https://api.rimbun.co/api/v1/partners/customers/cust_123/assessment" \\
  -H "Authorization: Bearer rbk_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{ "riskProfile": 65, "personalityScore": 70 }'`}</code></pre>
      </section>
    </DocsShell>
  );
}
