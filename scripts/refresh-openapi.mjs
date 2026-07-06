import { copyFileSync, existsSync, mkdirSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(root, "..");
const source = resolve(projectRoot, "../rimbun-main/docs/openapi.json");
const destination = resolve(projectRoot, "public/openapi/rimbun.json");

if (!existsSync(source)) {
  throw new Error(`OpenAPI source not found: ${source}`);
}

mkdirSync(dirname(destination), { recursive: true });
copyFileSync(source, destination);

const sizeKb = Math.round(statSync(destination).size / 1024);
console.log(`Copied OpenAPI contract to ${destination} (${sizeKb} KB)`);
