import { getElementText } from "../dom";

export function getProficiencyBonus(parentElement: HTMLElement): number {
  return parseInt(getElementText(parentElement), 10);
}
