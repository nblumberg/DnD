import { getElementText } from "../dom";
import { getSpeeds, Speeds } from "./speeds";

export function getAttributes(parentElement: HTMLElement): {
  ac: number;
  hp: number;
  hd: string;
  speeds: Speeds;
} {
  const attributesParent: HTMLElement = parentElement.querySelector(
    ".mon-stat-block__attributes"
  );
  if (!attributesParent) {
    throw new Error(`Could not find ${name} attributes`);
  }

  const attributes = Array.from(
    attributesParent.querySelectorAll(".mon-stat-block__attribute")
  );
  let ac: number;
  let hp: number;
  let hd: string;
  let speeds: Speeds;
  for (const attribute of attributes) {
    const label = getElementText(
      attribute.querySelector(".mon-stat-block__attribute-label")
    );
    const value = getElementText(
      attribute.querySelector(".mon-stat-block__attribute-data-value")
    );
    const extra = getElementText(
      attribute.querySelector(".mon-stat-block__attribute-data-extra")
    );
    switch (label) {
      case "Armor Class":
        ac = parseInt(value, 10);
        break;
      case "Hit Points":
        hp = parseInt(value, 10);
        hd = extra.trim();
        hd = hd.substring(1, hd.length - 1);
        break;
      case "Speed":
        speeds = getSpeeds(value);
        break;
    }
  }

  if (!ac) {
    throw new Error("Failed to parse Armor Class");
  }
  if (!hp) {
    throw new Error("Failed to parse Hit Points");
  }
  if (!hd) {
    throw new Error("Failed to parse Hit Dice");
  }
  if (!speeds) {
    throw new Error("Failed to parse speeds");
  }

  return { ac, hp, hd, speeds };
}
