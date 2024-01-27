import {
  existsSync,
  readdirSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from "fs";
import { join } from "path";
import { parseMonsterHTML } from "./monsters";
import { fileRelativeToData, PathParam } from "./root";
import { parseSpellHTML } from "./spells";
import { parseRegExpGroups } from "./utils";

const originalRequestRegExp =
  /<!-- ORIGINAL_REQUEST_DATA: (?<data>[^}]+}) -->$/m;

export function parseHTML(
  path: PathParam,
  names?: string[],
  startAfter?: string
): void {
  const baseFilePath = fileRelativeToData(path);
  const bookmarkFile = join(baseFilePath, ".last-written");
  const htmlPath = join(baseFilePath, "html");
  const files = names?.map((name) => `${name}.html`) ?? readdirSync(htmlPath);
  if (!startAfter && existsSync(bookmarkFile)) {
    startAfter = readFileSync(bookmarkFile, "utf8");
  }
  let skip = startAfter && !names;
  for (const filename of files) {
    if (skip) {
      if (filename.endsWith(`${startAfter}.html`)) {
        skip = false;
      }
      continue;
    }
    if (
      !names &&
      existsSync(join(baseFilePath, filename.replace(".html", ".json")))
    ) {
      continue;
    }
    // checkMemoryUsage();
    try {
      const rawHtml = readFileSync(join(htmlPath, filename), "utf8");
      const { data } = parseRegExpGroups(
        "originalRequestRegExp",
        originalRequestRegExp,
        rawHtml
      );
      const { name, url } = JSON.parse(data);
      console.log(name);

      switch (path) {
        case "monsters":
          parseMonsterHTML(rawHtml, name, url);
          break;
        case "spells":
          parseSpellHTML(rawHtml, name, url);
          break;
        default:
          throw new Error("Not implemented");
      }
      writeFileSync(bookmarkFile, name, "utf8");
    } catch (e) {
      // ignore errors
      if ((e as any).purchased === false) {
        continue;
      }
      throw e;
    }
  }
  if (!names) {
    unlinkSync(bookmarkFile);
  }
}
