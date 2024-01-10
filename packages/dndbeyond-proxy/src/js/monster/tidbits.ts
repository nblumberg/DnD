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
} {
  const tidbits = parentElement.querySelectorAll(
    ".mon-stat-block__tidbits .mon-stat-block__tidbit"
  );
  if (!tidbits.length) {
    throw new Error(`Could not find ${name} tidbits`);
  }

  let saves: Record<string, number>;
  let skills: Record<string, number>;
  let senses: Senses;
  let languages: string[];
  let cr: number;
  let proficiency = 0;
  for (let i = 0; i < tidbits.length; i++) {
    const tidbit = tidbits[i];
    const label = getElementText(
      tidbit.querySelector(".mon-stat-block__tidbit-label")
    );
    const data: HTMLElement = tidbit.querySelector(
      ".mon-stat-block__tidbit-data"
    );
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

  return { saves, skills, senses, languages, cr, proficiency };
}
