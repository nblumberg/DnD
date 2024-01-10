import { Abilities, AbilityParam } from "./ability";

export class Skill {
  name: string;
  modifier: number;
  ability?: AbilityParam;
  proficient?: true;
  expertise?: true;
  jackOfAllTrades?: true;

  constructor(
    name: string,
    modifier: number,
    ability?: AbilityParam,
    proficient = false,
    expertise = false,
    jackOfAllTrades = false
  ) {
    this.name = name;
    this.modifier = modifier;
    if (ability) {
      this.ability = ability;
    } else {
      this.ability = abilityMap[name];
    }
    if (proficient) {
      this.proficient = true;
    }
    if (expertise) {
      this.expertise = true;
    }
    if (jackOfAllTrades) {
      this.jackOfAllTrades = true;
    }
  }
}

export interface SkillsParams extends Record<string, number | Skill> {
  Acrobatics: number;
  AnimalHandling: number;
  Arcana: number;
  Athletics: number;
  Deception: number;
  History: number;
  Insight: number;
  Intimidation: number;
  Investigation: number;
  Medicine: number;
  Nature: number;
  Perception: number;
  Performance: number;
  Persuasion: number;
  Religion: number;
  SleightOfHand: number;
  Stealth: number;
  Survival: number;
}

export interface Skills extends Record<string, Skill> {
  Acrobatics: Skill;
  AnimalHandling: Skill;
  Arcana: Skill;
  Athletics: Skill;
  Deception: Skill;
  History: Skill;
  Insight: Skill;
  Intimidation: Skill;
  Investigation: Skill;
  Medicine: Skill;
  Nature: Skill;
  Perception: Skill;
  Performance: Skill;
  Persuasion: Skill;
  Religion: Skill;
  SleightOfHand: Skill;
  Stealth: Skill;
  Survival: Skill;
}

export function createSkills(
  abilities: Abilities,
  params?: SkillsParams
): Skills {
  const skills: Skills = {} as Skills;
  // Create default skills
  for (const [name, ability] of Object.entries(abilityMap)) {
    const entry = params?.[name];
    let modifier: number = abilities[ability];
    let proficient = false;
    let passedAbility: AbilityParam | undefined;
    let expertise = false;
    let jackOfAllTrades = false;
    if (typeof entry === "number") {
      modifier = entry;
    } else if (typeof entry?.modifier === "number") {
      ({
        modifier,
        proficient = false,
        ability: passedAbility,
        expertise = false,
        jackOfAllTrades = false,
      } = entry);
    }

    skills[name] = new Skill(
      name,
      modifier,
      passedAbility ?? ability,
      proficient,
      expertise,
      jackOfAllTrades
    );
  }

  // Create custom skills
  if (params) {
    for (const [name, args] of Object.entries(params)) {
      if (Object.prototype.hasOwnProperty.call(abilityMap, name)) {
        continue;
      }
      if (typeof args === "number") {
        skills[name] = new Skill(name, args);
      } else {
        const {
          modifier,
          proficient = false,
          ability,
          expertise = false,
          jackOfAllTrades = false,
        } = args;
        skills[name] = new Skill(
          name,
          modifier,
          ability,
          proficient,
          expertise,
          jackOfAllTrades
        );
      }
    }
  }
  return skills;
}

const abilityMap: Record<keyof Skills, AbilityParam> = {
  Acrobatics: "dex",
  AnimalHandling: "wis",
  Arcana: "int",
  Athletics: "str",
  Deception: "cha",
  History: "int",
  Insight: "wis",
  Intimidation: "cha",
  Investigation: "int",
  Medicine: "wis",
  Nature: "int",
  Perception: "wis",
  Performance: "cha",
  Persuasion: "cha",
  Religion: "int",
  SleightOfHand: "dex",
  Stealth: "dex",
  Survival: "wis",
};
