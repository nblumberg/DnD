import { JSDOM } from "jsdom";
import fs from "node:fs";
import path from "node:path";
import { fileRelativeToData } from "../root";
import { saveImage } from "../saveImage";
import { parseAttunement } from "./attunement";
import { parseDescription } from "./description";
import { parseImage } from "./image";
import { parseName } from "./name";
import { parseSource } from "./source";
import { parseSummary } from "./summary";

interface MagicItem {
  name: string;
  type: string;
  subtype?: string;
  rarity: string;
  requiresAttunement: boolean;
  attunementPrerequisite?: string;
  description: string;
  source: string;
  image: string;
}

function parseMagicItem(file: string): MagicItem {
  console.log(path.basename(file));

  const content = fs.readFileSync(file, "utf8");
  const dom = new JSDOM(content);
  const {
    window: { document },
  } = dom;

  let name: string;
  try {
    name = parseName(document);
  } catch (e) {
    console.error(`\tError parsing name for ${file}: ${e}`);
    throw e;
  }
  const requiresAttunement = parseAttunement(document);

  const main = document.querySelector("#content") as HTMLElement;
  if (!main) {
    throw new Error("Couldn't find main element");
  }
  const summary = main
    .querySelector(".item-info .details span")
    ?.textContent?.trim();
  if (!summary) {
    throw new Error("Couldn't find summary");
  }

  const {
    type,
    subtype,
    rarity,
    attunement: stringAttunement,
    attunementPrerequisite,
  } = parseSummary(summary);

  if (requiresAttunement !== stringAttunement) {
    throw new Error(
      `Mismatch between attunement in summary and attunement in details: ${requiresAttunement} !== ${stringAttunement}`
    );
  }

  const description = parseDescription(main);

  const source = parseSource(main);

  const image = parseImage(main);

  return {
    name,
    type,
    subtype,
    rarity,
    requiresAttunement,
    attunementPrerequisite,
    description,
    source,
    image,
  };
}

const ignoreImages = [
  "https://www.dndbeyond.com/attachments/2/666/armor.jpg",
  "https://www.dndbeyond.com/attachments/2/667/potion.jpg",
  "https://www.dndbeyond.com/attachments/2/669/rod.jpg",
  "https://www.dndbeyond.com/attachments/2/662/staff.jpg",
  "https://www.dndbeyond.com/attachments/2/664/weapon.jpg",
  "https://www.dndbeyond.com/attachments/2/665/wondrousitem.jpg",
];

async function saveMagicItem(magicItem: MagicItem): Promise<void> {
  const jsonFile = fileRelativeToData(
    path.join("magic-items", `${magicItem.name}.json`)
  );
  if (fs.existsSync(jsonFile)) {
    return;
  }
  fs.writeFileSync(jsonFile, JSON.stringify(magicItem, undefined, 2), "utf8");
  console.log(`\tWrote ${jsonFile}`);

  const { image } = magicItem;
  if (image.startsWith("https://www.dndbeyond.com/attachments/")) {
    // Placeholder image
    return;
  }
  const imageExtension = path.basename(image).split(".").pop();
  const imageFile = fileRelativeToData(
    path.join("magic-items", "images", `${magicItem.name}.${imageExtension}`)
  );
  if (!fs.existsSync(path.dirname(imageFile))) {
    fs.mkdirSync(path.dirname(imageFile), { recursive: true });
  }
  if (!fs.existsSync(imageFile)) {
    await saveImage(image, imageFile);
    console.log(`\tWrote ${imageFile}`);
  }
}

export async function parseMagicItems(): Promise<void> {
  const magicItemsDirectory = fileRelativeToData("magic-items");
  const htmlDirectory = path.join(magicItemsDirectory, "html");
  const htmlFiles = fs.readdirSync(htmlDirectory);
  for (const htmlFile of htmlFiles) {
    let magicItem: MagicItem;
    try {
      magicItem = parseMagicItem(path.join(htmlDirectory, htmlFile));
    } catch {
      continue;
    }
    await saveMagicItem(magicItem);
  }
}
