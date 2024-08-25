import { JSDOM } from "jsdom";

export function parseName(document: JSDOM["window"]["document"]): string {
  const nameElement = document.querySelector(".page-header .page-title");
  if (!nameElement) {
    throw new Error("Couldn't find name element");
  }
  const name = nameElement.textContent?.trim();
  if (!name) {
    throw new Error("Couldn't find name");
  }
  return name;
}
