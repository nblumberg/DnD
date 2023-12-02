import { getElementText } from "../dom";

export function getAbility(
  parentElement: HTMLElement,
  ability: string
): number {
  const scoreElement: HTMLElement = parentElement.querySelector(
    `.ability-block__stat--${ability} .ability-block__data .ability-block__score`
  );
  const scoreText = getElementText(scoreElement);
  const score = parseInt(scoreText, 10);
  if (!score) {
    throw new Error(`Failed to parse ${ability}`);
  }
  return score;
}
