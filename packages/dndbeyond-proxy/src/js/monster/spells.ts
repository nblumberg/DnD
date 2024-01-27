import {
  AbilityType,
  ActionParams,
  CreatureParams,
  SpellLevel,
  Spells,
} from "creature";
import { getElementText } from "../dom";
import { parseRegExpGroups } from "../utils";

const castPerDayRegExp = /^(?<perDay>\d+|At will)(\/day)?/;
const spellLevelRegExp =
  /(?<level>\d|C)(st level|nd level|rd level|th level|antrips)\s+\((?<slots>\d+\s+slots?|at will)\):/;
const casterLevelRegExp =
  /is a (?<casterLevel>\d+)(st|nd|rd|th)-level spellcaster/;
const spellCastingAbilityRegExp =
  /spellcasting ability is (?<abilityLong1>\w+)|using (?<abilityLong2>\w+) as the spellcasting ability/;
const spellDCRegExp = /spell save DC (?<dc>\d+)/;
const spellAttackRegExp = /\+(?<attack>\d+) to hit with spell attacks/;

const spellCastingAbilityMap: Record<string, AbilityType> = {
  Charisma: "cha",
  Constitution: "con",
  Dexterity: "dex",
  Intelligence: "int",
  Strength: "str",
  Wisdom: "wis",
};

export function getSpells(
  parentElement: HTMLElement,
  features: ActionParams[] = [],
  actions: CreatureParams["actions"] = {}
): Spells | undefined {
  const spells = {} as Spells;
  const innate = {} as Spells["innate"];

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

  const text =
    features.map(({ description }) => description).join("\n") +
    "\n" +
    Object.values(actions ?? {})
      .flat()
      .map(({ description }) => description)
      .join("\n");

  const { casterLevel } = parseRegExpGroups(
    "casterLevelRegExp",
    casterLevelRegExp,
    text,
    true
  );
  if (casterLevel) {
    spells.casterLevel = parseInt(casterLevel, 10);
  } else {
    console.warn(`\tNo caster level found`);
    spells.casterLevel = -1;
  }

  const { abilityLong1, abilityLong2 } = parseRegExpGroups(
    "spellCastingAbilityRegExp",
    spellCastingAbilityRegExp,
    text,
    true
  );
  const abilityLong = abilityLong1 ?? abilityLong2;
  if (abilityLong) {
    if (!spellCastingAbilityMap[abilityLong]) {
      throw new Error(`Unknown spellcasting ability: ${abilityLong}`);
    }
    spells.ability = spellCastingAbilityMap[abilityLong];
  } else {
    console.warn(`\tNo spellcasting ability found`);
    spells.ability = "wis";
  }

  const { dc } = parseRegExpGroups("spellDCRegExp", spellDCRegExp, text, true);
  if (dc) {
    spells.dc = parseInt(dc, 10);
  } else {
    console.warn(`\tNo spell DC found`);
    spells.dc = -1;
  }

  const { attack } = parseRegExpGroups(
    "spellAttackRegExp",
    spellAttackRegExp,
    text,
    true
  );
  if (attack) {
    spells.attack = parseInt(attack, 10);
  } else {
    console.warn(`\tNo spell attack found`);
    spells.attack = -1;
  }

  if (!Object.keys(spells).length) {
    return undefined;
  }

  // if (!spells.casterLevel || !spells.ability || !spells.dc || !spells.attack) {
  //   throw new Error(`Incomplete spellcasting: ${JSON.stringify(spells)}`);
  // }

  return spells;
}
