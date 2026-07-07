import { copyFileSync, existsSync, mkdirSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(root, "..");
// Consume the partner-audience contract, not the full internal spec.
// Regenerate it in the backend first: npm run openapi:public
const source = resolve(projectRoot, "../rimbun-main/docs/openapi.partner.json");
const destination = resolve(projectRoot, "public/openapi/rimbun.json");

if (!existsSync(source)) {
  throw new Error(`OpenAPI source not found: ${source}`);
}

mkdirSync(dirname(destination), { recursive: true });
copyFileSync(source, destination);

const sizeKb = Math.round(statSync(destination).size / 1024);
console.log(`Copied OpenAPI contract to ${destination} (${sizeKb} KB)`);
