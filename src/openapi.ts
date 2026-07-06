export type OpenApiSpec = {
  openapi: string;
  info: {
    title: string;
    version: string;
    description?: string;
  };
  servers?: Array<{ url: string; description?: string }>;
  paths: Record<string, PathItem>;
  components?: {
    schemas?: Record<string, unknown>;
    securitySchemes?: Record<string, unknown>;
  };
};

type PathItem = Partial<Record<HttpMethod, Operation>>;

export type HttpMethod =
  | "get"
  | "post"
  | "put"
  | "patch"
  | "delete"
  | "options"
  | "head";

export type Operation = {
  tags?: string[];
  summary?: string;
  description?: string;
  operationId?: string;
  parameters?: Array<unknown>;
  requestBody?: unknown;
  responses?: Record<string, unknown>;
  security?: Array<Record<string, string[]>>;
};

export type ApiOperation = {
  id: string;
  path: string;
  method: HttpMethod;
  tag: string;
  summary: string;
  description?: string;
  operation: Operation;
};

const METHODS: HttpMethod[] = ["get", "post", "put", "patch", "delete", "options", "head"];

export function flattenOperations(spec: OpenApiSpec): ApiOperation[] {
  return Object.entries(spec.paths)
    .flatMap(([path, pathItem]) =>
      METHODS.flatMap((method) => {
        const operation = pathItem[method];
        if (!operation) return [];

        return [
          {
            id: `${method.toUpperCase()} ${path}`,
            path,
            method,
            tag: operation.tags?.[0] ?? "API",
            summary: operation.summary ?? operation.operationId ?? path,
            description: operation.description,
            operation,
          },
        ];
      }),
    )
    .sort((a, b) => a.path.localeCompare(b.path) || a.method.localeCompare(b.method));
}

export function methodLabel(method: HttpMethod): string {
  return method.toUpperCase();
}

export function createCurlExample(operation: ApiOperation): string {
  const method = methodLabel(operation.method);
  const path = operation.path.replace(/\{([^}]+)\}/g, (_, name: string) => samplePathValue(name));
  const lines = [
    `curl -X ${method} "https://api.rimbun.co${path}"`,
    `  -H "Authorization: Bearer rbk_live_..."`,
    `  -H "Content-Type: application/json"`,
  ];

  if (["post", "put", "patch"].includes(operation.method)) {
    lines.push(`  -d '{ "example": true }'`);
  }

  return lines.join(" \\\n");
}

function samplePathValue(name: string): string {
  const normalized = name.toLowerCase();
  if (normalized.includes("customer")) return "cust_123";
  if (normalized.includes("partner")) return "partner_123";
  if (normalized.includes("tenant")) return "tenant_123";
  if (normalized.includes("account")) return "acct_123";
  if (normalized.includes("id")) return "id_123";
  return "example";
}

export async function loadOpenApiSpec(): Promise<OpenApiSpec> {
  const response = await fetch("/openapi/rimbun.json");
  if (!response.ok) {
    throw new Error(`Failed to load OpenAPI contract: ${response.status}`);
  }
  return response.json();
}
