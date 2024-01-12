import { getElementText } from "../dom";
import { parseRegExpGroups } from "../utils";

type SpellLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
interface PreparedSpellsByLevel {
  slots: number | "∞";
  spells: string[];
}
type InnateSpells = Record<string, number | "∞">;
export type Spells = Record<SpellLevel, PreparedSpellsByLevel> & {
  innate: InnateSpells;
};

const castPerDayRegExp = /^(?<perDay>\d+|At will)(\/day)?/;
const spellLevelRegExp =
  /(?<level>\d|C)(st level|nd level|rd level|th level|antrips)\s+\((?<slots>\d+\s+slots?|at will)\):/;

export function getSpells(parentElement: HTMLElement): Spells | undefined {
  const spells = {} as Spells;
  const innate = {} as InnateSpells;

  const spellElements = Array.from(
    parentElement.querySelectorAll(".spell-tooltip")
  );

  spellElements.forEach((spellElement) => {
    const spellName = getElementText(spellElement);

    let element: Element | null = spellElement;
    while (element && element.tagName.toLowerCase() !== "p") {
      element = element.parentElement;
    }
    if (!element) {
      // This was a spell reference inside another action, e.g. Aboleth's Lair Actions PHANTASMAL FORCE
      return;
    }

    const paragraphText = getElementText(element);

    const { perDay } = parseRegExpGroups(
      "castPerDayRegExp",
      castPerDayRegExp,
      paragraphText,
      true
    );
    if (perDay) {
      if (perDay === "At will") {
        innate[spellName] = "∞";
      } else {
        innate[spellName] = parseInt(perDay, 10);
      }
    } else {
      const { level: levelText, slots: slotsText } = parseRegExpGroups(
        "spellLevelRegExp",
        spellLevelRegExp,
        paragraphText,
        true
      );
      if (!levelText) {
        // This was a spell reference inside another action, e.g. Aboleth's Tentacle attack disease can only be cured by HEAL
        return;
      }

      const level = (
        levelText === "C" ? 0 : parseInt(levelText, 10)
      ) as SpellLevel;
      const slots = levelText === "C" ? "∞" : parseInt(slotsText, 10);
      if (!spells[level]) {
        spells[level] = { slots, spells: [] };
      }
      spells[level].spells.push(spellName);
    }
  });

  if (Object.keys(innate).length) {
    spells.innate = innate;
  }

  if (!Object.keys(spells).length) {
    return undefined;
  }

  return spells;
}
