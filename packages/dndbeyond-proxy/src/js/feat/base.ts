import { JSDOM } from "jsdom";
import fs from "node:fs";
import path from "node:path";
import { ajax } from "../ajax";
import { fileRelativeToData } from "../root";

async function listFeats(): Promise<Record<string, string>> {
  const url = "https://www.dndbeyond.com/feats";
  const html = await ajax(url, {}, "Feats list");
  const doc = new JSDOM(html).window.document;
  const links = Array.from(
    doc.querySelectorAll(
      "#content .listing-body .list-row-name-primary > div > a"
    ) as unknown as Array<HTMLAnchorElement | null>
  ).filter((element) => !!element);
  const feats = links
    .map((element) => [
      element.textContent?.trim() || "unknown",
      new URL(element.href, "https://dndbeyond.com").toString(),
    ])
    .reduce((acc, [name, url]) => ({ ...acc, [name]: url }), {});

  return feats;
}

async function saveFeat(name: string, url: string): Promise<void> {
  const html = await ajax(url, {}, `Race ${name}`);
  const file = fileRelativeToData(path.join("feats", "html", `${name}.html`));
  if (!fs.existsSync(path.dirname(file))) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
  }
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, html, "utf8");
    console.log(`\tWrote ${file}`);
  }
}

export async function saveFeats(): Promise<void> {
  const backgrounds = await listFeats();
  for (const [name, url] of Object.entries(backgrounds)) {
    await saveFeat(name, url);
  }
}
