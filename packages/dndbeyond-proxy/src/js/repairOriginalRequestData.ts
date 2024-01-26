import { CreatureParams } from "creature";
import { existsSync, readFileSync, readdirSync, writeFileSync } from "fs";
import { basename, join } from "path";
import { checkMemoryUsage } from "./memory";

export function repairOriginalRequestData(): void {
  const baseFilePath = join(__dirname, "..", "..", "data", "monsters");
  const old = join(baseFilePath, "old");
  const html = join(baseFilePath, "html");
  const files = readdirSync(html);
  for (const file of files) {
    console.log(file);
    const htmlFile = join(html, file);
    const content = readFileSync(htmlFile, "utf8");
    const name = basename(file, ".html");
    const oldFile = join(old, `${name}.json`);
    let url = "unknown";
    if (existsSync(oldFile)) {
      const json = readFileSync(oldFile, "utf8");
      const creatureParams: CreatureParams = JSON.parse(json);
      url = creatureParams.url;
    }
    writeFileSync(
      htmlFile,
      `${content}\n<!-- ORIGINAL_REQUEST_DATA: ${JSON.stringify({
        name,
        url,
      })} -->`,
      "utf8"
    );
    checkMemoryUsage();
  }
}
