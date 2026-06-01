import fs from "node:fs";

export function readFile(filePath: string): string {
  return fs.readFileSync(filePath, "utf8");
}
