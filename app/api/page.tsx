import type { Metadata } from "next";
import { OpenApiReference } from "./openapi-reference";

export const metadata: Metadata = {
  title: "API Reference | Rimbun Docs",
  description: "Rimbun partner API reference.",
};

export default function ApiReferencePage() {
  return (
    <section className="api-page">
      <OpenApiReference />
    </section>
  );
}
