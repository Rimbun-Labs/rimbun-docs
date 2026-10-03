import specJson from "../../public/openapi/rimbun.json";

type JsonSchema = {
  type?: string;
  format?: string;
  description?: string;
  enum?: string[];
  properties?: Record<string, JsonSchema>;
  required?: string[];
  items?: JsonSchema;
  $ref?: string;
};

type Parameter = {
  name: string;
  in: string;
  required?: boolean;
  description?: string;
  schema?: JsonSchema;
};

type Media = { schema?: JsonSchema };

type Operation = {
  operationId?: string;
  summary?: string;
  description?: string;
  tags?: string[];
  parameters?: Parameter[];
  requestBody?: {
    description?: string;
    required?: boolean;
    content?: Record<string, Media>;
  };
  responses?: Record<
    string,
    {
      description?: string;
      content?: Record<string, Media>;
    }
  >;
};

type Spec = {
  info: { title: string; version: string; description?: string };
  servers?: { url: string }[];
  paths: Record<string, Partial<Record<string, Operation>>>;
  components?: {
    schemas?: Record<string, JsonSchema>;
    securitySchemes?: Record<string, { type?: string; scheme?: string; description?: string }>;
  };
};

const spec = specJson as Spec;
const METHODS = ["get", "post", "put", "patch", "delete"] as const;

function schemaMap() {
  return spec.components?.schemas ?? {};
}

function resolve(schema: JsonSchema | undefined, depth = 0): JsonSchema | undefined {
  if (!schema?.$ref || depth > 5) return schema;
  const name = schema.$ref.split("/").pop() ?? "";
  const target = schemaMap()[name];
  if (!target) return schema;
  return resolve({ ...target, description: schema.description ?? target.description }, depth + 1);
}

function refName(schema: JsonSchema | undefined) {
  return schema?.$ref?.split("/").pop();
}

function typeLabel(schema: JsonSchema | undefined): string {
  if (!schema) return "object";
  const named = refName(schema);
  const resolved = resolve(schema);
  if (resolved?.enum?.length) return resolved.enum.join(" | ");
  if (resolved?.type === "array") {
    const itemName = refName(resolved.items);
    const itemType = itemName ?? resolved.items?.type ?? "object";
    return `${itemType}[]`;
  }
  if (named) return named;
  if (resolved?.format && resolved.type) return `${resolved.type} (${resolved.format})`;
  return resolved?.type ?? "object";
}

type Field = { name: string; type: string; required: boolean; description?: string };

function fieldsOf(schema: JsonSchema | undefined, prefix = ""): Field[] {
  const resolved = resolve(schema);
  if (!resolved) return [];
  if (resolved.type === "array" && resolved.items) return fieldsOf(resolved.items, prefix ? `${prefix}[]` : "");
  if (!resolved.properties) return [];

  const required = new Set(resolved.required ?? []);
  const rows: Field[] = [];
  for (const [name, property] of Object.entries(resolved.properties)) {
    const path = prefix ? `${prefix}.${name}` : name;
    rows.push({
      name: path,
      type: typeLabel(property),
      required: required.has(name),
      description: resolve(property)?.description,
    });
    if (!prefix.includes(".")) {
      const nested = resolve(property);
      if (nested?.properties) rows.push(...fieldsOf(property, path));
      else if (nested?.type === "array" && resolve(nested.items)?.properties) {
        rows.push(...fieldsOf(nested.items, `${path}[]`));
      }
    }
  }
  return rows;
}

function tagSlug(tag: string) {
  return tag
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function operationAnchor(operation: Operation, method: string, path: string) {
  if (operation.operationId) return `operation/${operation.operationId}`;
  const slug = `${method}-${path}`.replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `operation/${slug}`;
}

type ListedOperation = {
  tag: string;
  method: string;
  path: string;
  operation: Operation;
  anchor: string;
};

function operations(): ListedOperation[] {
  const listed: ListedOperation[] = [];
  for (const [path, item] of Object.entries(spec.paths)) {
    for (const method of METHODS) {
      const operation = item[method];
      if (!operation) continue;
      const tag = operation.tags?.[0] ?? "Other";
      listed.push({
        tag,
        method: method.toUpperCase(),
        path,
        operation,
        anchor: operationAnchor(operation, method, path),
      });
    }
  }
  return listed;
}

function FieldTable({ schema }: { schema: JsonSchema | undefined }) {
  const fields = fieldsOf(schema);
  if (fields.length === 0) return null;
  return (
    <table className="api-fields">
      <thead>
        <tr>
          <th>Field</th>
          <th>Type</th>
          <th>Required</th>
        </tr>
      </thead>
      <tbody>
        {fields.map((field) => (
          <tr key={field.name}>
            <td>
              <code>{field.name}</code>
              {field.description ? <span>{field.description}</span> : null}
            </td>
            <td>
              <code>{field.type}</code>
            </td>
            <td>{field.required ? "Yes" : "No"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function OpenApiReference() {
  const listed = operations();
  const tags = [...new Set(listed.map((item) => item.tag))];
  const server = spec.servers?.[0]?.url;
  const auth = Object.values(spec.components?.securitySchemes ?? {})
    .map((scheme) => scheme.description)
    .filter(Boolean);

  return (
    <div className="api-reference">
      <aside className="api-sidebar">
        <a href="#description/introduction">Introduction</a>
        {tags.map((tag) => (
          <div key={tag}>
            <a className="api-sidebar-tag" href={`#tag/${tagSlug(tag)}`}>
              {tag}
            </a>
            {listed
              .filter((item) => item.tag === tag)
              .map((item) => (
                <a key={item.anchor} href={`#${item.anchor}`}>
                  <span className={`api-method ${item.method.toLowerCase()}`}>{item.method}</span>
                  {item.operation.summary ?? item.path}
                </a>
              ))}
          </div>
        ))}
      </aside>

      <div className="api-content">
        <section id="description/introduction">
          <p className="eyebrow">{spec.info.title}</p>
          <h2>Introduction</h2>
          {spec.info.description ? <p>{spec.info.description}</p> : null}
          {server ? (
            <p>
              Base URL <code>{server}</code>
            </p>
          ) : null}
          {auth.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </section>

        {tags.map((tag) => (
          <section key={tag} id={`tag/${tagSlug(tag)}`}>
            <h2>{tag}</h2>
            {listed
              .filter((item) => item.tag === tag)
              .map((item) => {
                const body = Object.values(item.operation.requestBody?.content ?? {})[0]?.schema;
                return (
                  <article key={item.anchor} id={item.anchor}>
                    <h3>{item.operation.summary ?? item.path}</h3>
                    <p className="api-path">
                      <span className={`api-method ${item.method.toLowerCase()}`}>{item.method}</span>
                      <code>{item.path}</code>
                    </p>
                    {item.operation.description ? <p>{item.operation.description}</p> : null}
                    {item.operation.parameters?.length ? (
                      <>
                        <h4>Parameters</h4>
                        <table className="api-fields">
                          <thead>
                            <tr>
                              <th>Name</th>
                              <th>In</th>
                              <th>Type</th>
                              <th>Required</th>
                            </tr>
                          </thead>
                          <tbody>
                            {item.operation.parameters.map((parameter) => (
                              <tr key={`${parameter.in}-${parameter.name}`}>
                                <td>
                                  <code>{parameter.name}</code>
                                </td>
                                <td>{parameter.in}</td>
                                <td>
                                  <code>{typeLabel(parameter.schema)}</code>
                                </td>
                                <td>{parameter.required ? "Yes" : "No"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </>
                    ) : null}
                    {body ? (
                      <>
                        <h4>Request body</h4>
                        <FieldTable schema={body} />
                      </>
                    ) : null}
                    {item.operation.responses ? (
                      <>
                        <h4>Responses</h4>
                        {Object.entries(item.operation.responses).map(([status, response]) => {
                          const schema = Object.values(response.content ?? {})[0]?.schema;
                          return (
                            <div key={status} className="api-response">
                              <p>
                                <strong>{status}</strong>
                                {response.description ? ` ${response.description}` : ""}
                              </p>
                              <FieldTable schema={schema} />
                            </div>
                          );
                        })}
                      </>
                    ) : null}
                  </article>
                );
              })}
          </section>
        ))}
      </div>
    </div>
  );
}
