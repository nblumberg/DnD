import { getElementText } from "../dom";
import { getChallengeRating } from "./cr";
import { getLanguages } from "./languages";
import { getProficiencyBonus } from "./proficiency";
import { getSavingThrows } from "./saves";
import { Senses, getSenses } from "./senses";
import { getSkills } from "./skills";

export function getTidbits(
  name: string,
  parentElement: HTMLElement,
  hd: string
): {
  saves?: Record<string, number>;
  skills?: Record<string, number>;
  senses: Senses;
  languages?: string[];
  cr?: number;
  proficiency: number;
  damageVulnerabilities?: string[];
  damageResistances?: string[];
  damageImmunities?: string[];
  conditionImmunities?: string[];
} {
  const tidbits = parentElement.querySelectorAll(
    ".mon-stat-block__tidbits .mon-stat-block__tidbit"
  );
  if (!tidbits.length) {
    throw new Error(`Could not find ${name} tidbits`);
  }

  let saves: Record<string, number> | undefined;
  let skills: Record<string, number> | undefined;
  let senses: Senses | undefined;
  let languages: string[] | undefined;
  let cr: number | undefined;
  let proficiency = 0;
  let damageVulnerabilities: string[] | undefined;
  let damageResistances: string[] | undefined;
  let damageImmunities: string[] | undefined;
  let conditionImmunities: string[] | undefined;
  for (let i = 0; i < tidbits.length; i++) {
    const tidbit = tidbits[i];
    const element = tidbit.querySelector(".mon-stat-block__tidbit-label");
    if (!element) {
      throw new Error("Couldn't find tidbit label element");
    }
    const label = getElementText(element);
    const data: HTMLElement | null = tidbit.querySelector(
      ".mon-stat-block__tidbit-data"
    );
    if (!data) {
      throw new Error("Couldn't find tidbit data element");
    }
    switch (label) {
      case "Saving Throws":
        saves = getSavingThrows(data);
        break;
      case "Skills":
        skills = getSkills(data);
        break;
      case "Senses":
        senses = getSenses(data);
        break;
      case "Languages":
        languages = getLanguages(data);
        break;
      case "Challenge":
        cr = getChallengeRating(data);
        break;
      case "Proficiency Bonus":
        proficiency = getProficiencyBonus(data);
        break;
      case "Damage Vulnerabilities":
        damageVulnerabilities = getElementText(data).split(/\s*,\s*/);
        break;
      case "Damage Resistances":
        damageResistances = getElementText(data).split(/\s*,\s*/);
        break;
      case "Damage Immunities":
        damageImmunities = getElementText(data).split(/\s*,\s*/);
        break;
      case "Condition Immunities":
        conditionImmunities = getElementText(data).split(/\s*,\s*/);
        break;
    }
  }

  if (!senses) {
    throw new Error("Failed to parse senses");
  }
  if (!proficiency) {
    console.warn("Proficiency bonus missing, calculated it from Hit Dice");
    const level = parseInt(hd, 10);
    proficiency = Math.floor((level - 1) / 4) + 2;
  }

  return {
    saves,
    skills,
    senses,
    languages,
    cr,
    proficiency,
    damageVulnerabilities,
    damageResistances,
    damageImmunities,
    conditionImmunities,
  };
}
