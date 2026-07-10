import { DocsShell } from "../docs-shell";

export const metadata = {
  title: "Authentication",
};

export default function AuthenticationPage() {
  return (
    <DocsShell>
      <header className="topbar">
        <div>
          <span className="eyebrow">Security model</span>
          <h1>Authentication</h1>
        </div>
      </header>

      <section className="page-section narrow">
        <h2>Tenant context comes from credentials, not request bodies.</h2>
        <p>
          Rimbun partner APIs use server-side credentials. The backend derives tenant context from the authenticated
          credential and scopes every customer id to that tenant. Operator dashboard routes use Firebase identity mapped
          to <code>tenant_user</code>; they are not part of the published partner contract.
        </p>

        <div className="auth-grid">
          <div className="info-panel">
            <h3>API key</h3>
            <p>
              Used for partner reads and most writes: recommendations, goals, assessment, banking/insurance/investment
              profiles, economic profile, and product views. Store only the hash in the platform database.
            </p>
            <pre className="code-block"><code>{`Authorization: Bearer rbk_live_...`}</code></pre>
          </div>
          <div className="info-panel">
            <h3>HMAC signing</h3>
            <p>
              Required for statement ingestion (<code>POST /api/v1/partners/ingestion/statements</code>) where request
              integrity and replay protection matter.
            </p>
            <pre className="code-block"><code>{`X-Rimbun-Timestamp: 1780000000
X-Rimbun-Nonce: nonce_123
X-Rimbun-Signature: sha256=...`}</code></pre>
          </div>
        </div>

        <p className="callout">
          Production clients should treat credentials as backend secrets. Do not place partner API keys or HMAC secrets
          in browser applications.
        </p>
      </section>
    </DocsShell>
  );
}
