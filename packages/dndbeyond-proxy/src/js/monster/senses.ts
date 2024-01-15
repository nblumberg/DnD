import { parseRegExpGroups } from "../utils";

export interface Senses {
  "Passive Perception": number;
  [x: string]: number;
}

const sensesRegExp = /(?<means>.+)\s(?<range>\d+)(\s*ft\.)?/;

export function getSenses(parentElement: HTMLElement): Senses {
  const senses: Senses = { "Passive Perception": 0 };

  const entries = parentElement.textContent?.trim().split(",") ?? [];
  entries.forEach((entry) => {
    const { means, range } = parseRegExpGroups(
      "sensesRegExp",
      sensesRegExp,
      entry.trim()
    );
    senses[means] = parseInt(range, 10);
  });
  return senses;
}