import { Roll } from "roll";
import { ClassMembers } from "serializable";
import { Abilities, AbilityParam } from "./ability";

export class Skill extends Roll {
  name: string;
  modifier: number;
  ability?: AbilityParam;
  proficient: boolean;
  expertise: boolean;
  jackOfAllTrades: boolean;

  constructor(params: Partial<SkillRaw> & { name: string; modifier: number }) {
    super({ dieCount: 1, dieSides: 20, extra: params.modifier });
    const {
      name,
      modifier,
      ability,
      proficient = false,
      expertise = false,
      jackOfAllTrades = false,
    } = params;
    this.name = name;
    this.modifier = modifier;
    if (ability) {
      this.ability = ability;
    } else {
      this.ability = abilityMap[name];
    }
    this.proficient = proficient;
    this.expertise = expertise;
    this.jackOfAllTrades = jackOfAllTrades;
  }
}

export type SkillRaw = Omit<ClassMembers<Skill>, keyof ClassMembers<Roll>>;

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

type ToSkill<T> = { [K in keyof T]: Skill };

export type Skills = Record<string, Skill> & ToSkill<SkillsParams>;

type ToSkillRaw<T> = { [K in keyof T]: SkillRaw };

export type SkillsRaw = Record<string, SkillRaw> & ToSkillRaw<Skills>;

export function createSkills(
  abilities: Abilities,
  params?: Partial<SkillsParams>
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

    skills[name] = new Skill({
      name,
      modifier,
      ability: passedAbility ?? ability,
      proficient,
      expertise,
      jackOfAllTrades,
    });
  }

  // Create custom skills
  if (params) {
    for (const [name, args] of Object.entries(params)) {
      if (Object.prototype.hasOwnProperty.call(abilityMap, name)) {
        continue;
      }
      if (typeof args === "number") {
        skills[name] = new Skill({ name, modifier: args });
      } else if (args) {
        const {
          modifier,
          proficient = false,
          ability,
          expertise = false,
          jackOfAllTrades = false,
        } = args;
        skills[name] = new Skill({
          name,
          modifier,
          ability,
          proficient,
          expertise,
          jackOfAllTrades,
        });
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
