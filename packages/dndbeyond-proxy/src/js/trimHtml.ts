import { readFileSync, readdirSync, writeFileSync } from "fs";
import { JSDOM } from "jsdom";
import { join } from "path";
import { stripScripts } from "./dom";

export function trimHtml(after?: string): void {
  const baseFilePath = join(__dirname, "..", "..", "data", "monsters", "html");
  const files = readdirSync(baseFilePath).filter((file) =>
    file.endsWith(".html")
  );
  let found = !after;
  for (const file of files) {
    if (file === after) {
      found = true;
    }
    if (!found) {
      continue;
    }
    const filePath = join(baseFilePath, file);
    const rawHTML = readFileSync(filePath, "utf8");
    const trimmedHTML = stripScripts(new JSDOM(rawHTML));
    console.log(
      `${file} saved ${rawHTML.length - trimmedHTML.length} characters`
    );
    writeFileSync(filePath, trimmedHTML, "utf8");
  }
}
