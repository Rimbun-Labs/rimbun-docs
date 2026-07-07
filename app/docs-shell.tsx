import Link from "next/link";

const navItems = [
  { href: "/", label: "Overview" },
  { href: "/quickstart", label: "Quickstart" },
  { href: "/authentication", label: "Authentication" },
  { href: "/api", label: "API Reference" },
];

export function DocsShell({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="docs-shell">
      <header className="docs-header">
        <Link className="docs-brand" href="/">
          <span className="brand-mark">R</span>
          <strong>Rimbun Docs</strong>
        </Link>

        <nav className="docs-nav" aria-label="Documentation navigation">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      <main>{children}</main>
    </div>
  );
}
