import { getElementText } from "../dom";

export function getSavingThrows(
  parentElement: HTMLElement
): Record<string, number> {
  const saves: Record<string, number> = {};
  const text = getElementText(parentElement);
  const entries = text.split(",");
  entries.forEach((entry) => {
    const [ability, bonus] = entry.trim().split(/\s/);
    saves[ability.toLowerCase()] = parseInt(bonus, 10);
  });
  return saves;
}
