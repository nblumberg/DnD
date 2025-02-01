import fs from "node:fs";

export function writeFile(filePath: string, content: string): void {
  return fs.writeFileSync(filePath, content, "utf8");
}
