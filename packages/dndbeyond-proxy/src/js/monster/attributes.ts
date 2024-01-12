import { getElementText } from "../dom";
import { getSpeeds, Speeds } from "./speeds";

export function getAttributes(parentElement: HTMLElement): {
  ac: number;
  hp: number;
  hd: string;
  speeds: Speeds;
} {
  const attributesParent: HTMLElement | null = parentElement.querySelector(
    ".mon-stat-block__attributes"
  );
  if (!attributesParent) {
    throw new Error(`Could not find ${name} attributes`);
  }

  const attributes = Array.from(
    attributesParent.querySelectorAll(".mon-stat-block__attribute")
  );
  let ac: number | undefined;
  let hp: number | undefined;
  let hd: string | undefined;
  let speeds: Speeds | undefined;
  for (const attribute of attributes) {
    let element: Element | null = attribute.querySelector(
      ".mon-stat-block__attribute-label"
    );
    const label = element ? getElementText(element) : "";
    element = attribute.querySelector(".mon-stat-block__attribute-data-value");
    const value = element ? getElementText(element) : "";
    element = attribute.querySelector(".mon-stat-block__attribute-data-extra");
    const extra = element ? getElementText(element) : "";
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
