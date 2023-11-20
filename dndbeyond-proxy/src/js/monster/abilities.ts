import { getElementText } from "../dom";

export function getAbility(
  parentElement: HTMLElement,
  ability: string
): number {
  const scoreElement: HTMLElement = parentElement.querySelector(
    `.ability-block__stat--${ability} .ability-block__data .ability-block__score`
  );
  const scoreText = getElementText(scoreElement);
  return parseInt(scoreText, 10);
}
