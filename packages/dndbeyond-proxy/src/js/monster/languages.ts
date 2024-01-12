import { getElementText } from "../dom";

export function getLanguages(parentElement: HTMLElement): string[] {
  return getElementText(parentElement)
    .trim()
    .split(",")
    .map((language) => language.trim());
}
