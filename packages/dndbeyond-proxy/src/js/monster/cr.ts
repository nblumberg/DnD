import { getElementText } from "../dom";

export function getChallengeRating(parentElement: HTMLElement): number {
  const text = getElementText(parentElement);
  const [cr] = text.split("(");
  if (cr.includes("/")) {
    const denominator = parseInt(cr.split("/")[1], 10);
    return 1 / denominator;
  }
  return parseInt(cr, 10);
}
