import { getElementText } from "../dom";

export function getLanguages(parentElement: HTMLElement): string[] {
  const lanugages: string[] = [];
  return getElementText(parentElement)
    .trim()
    .split(",")
    .map((language) => language.trim());
}
