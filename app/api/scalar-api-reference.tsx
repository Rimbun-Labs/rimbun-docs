"use client";

import { ApiReferenceReact } from "@scalar/api-reference-react";

export default function ScalarApiReference() {
  return (
    <ApiReferenceReact
      configuration={{
        title: "Rimbun API",
        url: "/openapi/rimbun.json",
        layout: "modern",
        theme: "default",
        darkMode: true,
        forceDarkModeState: "dark",
        hideDarkModeToggle: true,
        showDeveloperTools: "never",
        agent: { disabled: true },
        mcp: { disabled: true },
        hideClientButton: true,
        hideTestRequestButton: true,
        isEditable: false,
        showSidebar: true,
        defaultOpenAllTags: false,
        operationTitleSource: "summary",
        servers: [{ url: "https://api.rimbun.co", description: "Production" }],
        _integration: "nextjs",
      }}
    />
  );
}
