import Link from "next/link";
import { DocsShell } from "./docs-shell";

export default function NotFoundPage() {
  return (
    <DocsShell>
      <section className="page-section narrow">
        <span className="eyebrow">404</span>
        <h2>Documentation page not found.</h2>
        <p>The page may have moved as the API documentation structure evolves.</p>
        <p>
          <Link className="topbar-link" href="/">
            Back to docs
          </Link>
        </p>
      </section>
    </DocsShell>
  );
}
