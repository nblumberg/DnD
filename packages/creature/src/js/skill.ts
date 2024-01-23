import { Abilities, AbilityType } from "./ability";

const KnownSkills = [
  "Acrobatics",
  "AnimalHandling",
  "Arcana",
  "Athletics",
  "Deception",
  "History",
  "Insight",
  "Intimidation",
  "Investigation",
  "Medicine",
  "Nature",
  "Perception",
  "Performance",
  "Persuasion",
  "Religion",
  "SleightOfHand",
  "Stealth",
  "Survival",
] as const;

type KnownSkill = (typeof KnownSkills)[number];

const abilityMap: Record<KnownSkill, AbilityType> = {
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
} as const;

export interface Skill {
  name: string;
  modifier: number;
  ability?: AbilityType;
  proficient?: true;
  expertise?: true;
  jackOfAllTrades?: true;
}

export type Skills = Record<KnownSkill | string, Skill>;

export type SkillsParams = Record<KnownSkill | string, number | Skill>;

function createSkill(
  name: string,
  modifier: number,
  ability?: AbilityType,
  proficient = false,
  expertise = false,
  jackOfAllTrades = false
): Skill {
  const skill: Skill = {
    name,
    modifier,
    ability,
  };
  if (proficient) {
    skill.proficient = true;
  }
  if (expertise) {
    skill.expertise = true;
  }
  if (jackOfAllTrades) {
    skill.jackOfAllTrades = true;
  }
  return skill;
}

export function createSkills(
  abilities: Abilities,
  params?: SkillsParams
): Skills {
  const skills: Skills = {};
  // Create default skills
  for (const [name, ability] of Object.entries(abilityMap)) {
    const entry = params?.[name];
    let modifier: number = abilities[ability];
    let proficient = false;
    let passedAbility: AbilityType | undefined;
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

    skills[name] = createSkill(
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
        skills[name] = { name, modifier: args };
        skills[name] = createSkill(name, args);
      } else if (args) {
        const {
          modifier,
          proficient = false,
          ability,
          expertise = false,
          jackOfAllTrades = false,
        } = args;
        skills[name] = createSkill(
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
