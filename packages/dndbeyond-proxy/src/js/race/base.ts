import { JSDOM } from "jsdom";
import fs from "node:fs";
import path from "node:path";
import { ajax } from "../ajax";
import { fileRelativeToData } from "../root";

async function listRaces(): Promise<Record<string, string>> {
  const url = "https://www.dndbeyond.com/races";
  const html = await ajax(url, {}, "Races list");
  const doc = new JSDOM(html).window.document;
  const links = Array.from(
    doc.querySelectorAll(
      "#content .listing-body .listing-card-race > div > a.listing-card__link"
    ) as unknown as Array<HTMLAnchorElement | null>
  ).filter((element) => !!element);
  const races = links
    .map((element) => [
      element
        .querySelector(".listing-card__body .listing-card__header > div > h3")
        ?.textContent?.trim() || "unknown",
      new URL(element.href, "https://dndbeyond.com").toString(),
    ])
    .reduce((acc, [name, url]) => ({ ...acc, [name]: url }), {});

  return races;
}

async function saveRace(name: string, url: string): Promise<void> {
  const html = await ajax(url, {}, `Race ${name}`);
  const file = fileRelativeToData(path.join("races", "html", `${name}.html`));
  if (!fs.existsSync(path.dirname(file))) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
  }
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, html, "utf8");
    console.log(`\tWrote ${file}`);
  }
}

export async function saveRaces(): Promise<void> {
  const backgrounds = await listRaces();
  for (const [name, url] of Object.entries(backgrounds)) {
    await saveRace(name, url);
  }
}
