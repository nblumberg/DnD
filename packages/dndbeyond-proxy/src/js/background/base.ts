import { JSDOM } from "jsdom";
import fs from "node:fs";
import path from "node:path";
import { ajax } from "../ajax";
import { fileRelativeToData } from "../root";

async function listBackgrounds(): Promise<Record<string, string>> {
  const url = "https://www.dndbeyond.com/backgrounds";
  const html = await ajax(url, {}, "Backgrounds list");
  const doc = new JSDOM(html).window.document;
  const backgrounds = (
    Array.from(
      doc.querySelectorAll(
        "#content .listing .list-row .list-row-name .list-row-name-primary-text .link"
      )
    ) as Array<HTMLAnchorElement | null>
  )
    .filter((element) => !!element)
    .map((element) => [
      element.textContent?.trim() || "unknown",
      new URL(element.href, "https://www.dndbeyond.com").toString(),
    ])
    .reduce((acc, [name, url]) => ({ ...acc, [name]: url }), {});
  return backgrounds;
}

async function saveBackground(name: string, url: string): Promise<void> {
  const html = await ajax(url, {}, `Background ${name}`);
  const file = fileRelativeToData(
    path.join("backgrounds", "html", `${name}.html`)
  );
  if (!fs.existsSync(path.dirname(file))) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
  }
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, html, "utf8");
    console.log(`\tWrote ${file}`);
  }
}

export async function saveBackgrounds(): Promise<void> {
  const backgrounds = await listBackgrounds();
  for (const [name, url] of Object.entries(backgrounds)) {
    await saveBackground(name, url);
  }
}
