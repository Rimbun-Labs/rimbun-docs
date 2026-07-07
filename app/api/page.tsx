import type { Metadata } from "next";
import Link from "next/link";
import ScalarApiReference from "./scalar-api-reference";

export const metadata: Metadata = {
  title: "API Reference",
  description: "Generated Rimbun API reference rendered from the OpenAPI contract.",
};

export default function ApiReferencePage() {
  return (
    <div className="api-page">
      <header className="api-topbar">
        <Link className="docs-brand" href="/">
          <span className="brand-mark">R</span>
          <strong>Rimbun Docs</strong>
        </Link>

        <nav className="api-nav" aria-label="API reference navigation">
          <Link href="/">Docs</Link>
          <Link href="/quickstart">Quickstart</Link>
          <Link href="/openapi/rimbun.json">OpenAPI JSON</Link>
        </nav>
      </header>

      <div className="api-reference-shell">
        <ScalarApiReference />
      </div>
    </div>
  );
}
