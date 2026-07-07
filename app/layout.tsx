import type { Metadata } from "next";
import "@scalar/api-reference-react/style.css";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Rimbun Developer Docs",
    template: "%s | Rimbun Docs",
  },
  description: "Developer documentation for Rimbun's financial intelligence APIs.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
