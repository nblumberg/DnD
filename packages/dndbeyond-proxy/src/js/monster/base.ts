import fs from "node:fs";
import path from "node:path";
import { fileRelativeToData } from "../root";
import { saveImage } from "../saveImage";

interface Monster {
  name: string;
  image?: string;
}

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

export async function parseMonsters(): Promise<void> {
  const monstersDirectory = fileRelativeToData("monsters");
  const imagesDirectory = path.join(monstersDirectory, "images");
  const jsonFiles = fs
    .readdirSync(monstersDirectory)
    .filter((file) => file.endsWith(".json"));
  for (const jsonFile of jsonFiles) {
    const { name, image }: Monster = JSON.parse(
      fs.readFileSync(path.join(monstersDirectory, jsonFile), "utf8")
    );
    console.log(name);
    if (!image) {
      console.log(`\tNo image for ${name}`);
      continue;
    }
    const imageExtension = path.basename(image).split(".").pop();
    const imageFile = path.join(imagesDirectory, `${name}.${imageExtension}`);
    if (!fs.existsSync(path.dirname(imageFile))) {
      fs.mkdirSync(path.dirname(imageFile), { recursive: true });
    }
    if (!fs.existsSync(imageFile)) {
      await saveImage(image, imageFile);
      console.log(`\tWrote ${imageFile}`);
    }
  }
}
