import { getElementText } from "../dom";

export function getAbility(
  parentElement: HTMLElement,
  ability: string
): number {
  const scoreElement: HTMLElement | null = parentElement.querySelector(
    `.ability-block__stat--${ability} .ability-block__data .ability-block__score`
  );
  if (!scoreElement) {
    throw new Error("Could not find Ability score element");
  }
  const scoreText = getElementText(scoreElement);
  const score = parseInt(scoreText, 10);
  if (!score) {
    throw new Error(`Failed to parse ${ability}`);
  }
  return score;
}
