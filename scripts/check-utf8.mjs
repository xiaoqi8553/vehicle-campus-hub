import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { extname } from "node:path";

const textExtensions = new Set([
  ".cjs",
  ".css",
  ".env",
  ".example",
  ".js",
  ".json",
  ".md",
  ".mjs",
  ".prisma",
  ".sql",
  ".toml",
  ".ts",
  ".tsx",
  ".txt",
  ".yaml",
  ".yml",
]);

const trackedFiles = execFileSync(
  "git",
  ["ls-files", "-z", "--cached", "--others", "--exclude-standard"],
  { encoding: "utf8" },
)
  .split("\0")
  .filter(Boolean);
const decoder = new TextDecoder("utf-8", { fatal: true });
const failures = [];

for (const file of trackedFiles) {
  if (!existsSync(file)) continue;
  if (!textExtensions.has(extname(file)) && !file.endsWith(".env.example")) continue;

  try {
    const contents = decoder.decode(readFileSync(file));
    if (contents.includes("\uFFFD"))
      failures.push(`${file}: contains Unicode replacement characters`);
  } catch (error) {
    failures.push(`${file}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

if (failures.length > 0) {
  console.error(`UTF-8 validation failed:\n${failures.join("\n")}`);
  process.exit(1);
}

console.log(`UTF-8 validation passed for ${trackedFiles.length} tracked files.`);
