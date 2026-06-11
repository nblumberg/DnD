export const CHECK_API_PREFIX = "CheckAPI";

export const CHECK_API_KEY = "!check";

export const CHECK_TYPES = ["ability", "save", "skill"];

export const ABILITY_NAME_TO_ABBREVIATION: Record<string, string> = {
  strength: "str",
  dexterity: "dex",
  constitution: "con",
  intelligence: "int",
  wisdom: "wis",
  charisma: "cha",
};

export const ABILITY_TYPES: Record<string, [string, keyof Character]> = {
  str: ["Strength check", "strength_mod"],
  dex: ["Dexterity check", "dexterity_mod"],
  con: ["Constitution check", "constitution_mod"],
  int: ["Intelligence check", "intelligence_mod"],
  wis: ["Wisdom check", "wisdom_mod"],
  cha: ["Charisma check", "charisma_mod"],
};

export const SAVE_TYPES: Record<string, [string, keyof Character]> = {
  str: ["Strength save", "strength_save_bonus"],
  dex: ["Dexterity save", "dexterity_save_bonus"],
  con: ["Constitution save", "constitution_save_bonus"],
  int: ["Intelligence save", "intelligence_save_bonus"],
  wis: ["Wisdom save", "wisdom_save_bonus"],
  cha: ["Charisma save", "charisma_save_bonus"],
};

export const SKILL_TYPES: Record<string, [string, keyof Character]> = {
  acrobatics: ["Acrobatics check", "acrobatics_bonus"],
  "animal handling": ["Animal Handling check", "animal_handling_bonus"],
  arcana: ["Arcana check", "arcana_bonus"],
  athletics: ["Athletics check", "athletics_bonus"],
  deception: ["Deception check", "deception_bonus"],
  history: ["History check", "history_bonus"],
  insight: ["Insight check", "insight_bonus"],
  intimidation: ["Intimidation check", "intimidation_bonus"],
  investigation: ["Investigation check", "investigation_bonus"],
  medicine: ["Medicine check", "medicine_bonus"],
  nature: ["Nature check", "nature_bonus"],
  perception: ["Perception check", "perception_bonus"],
  performance: ["Performance check", "performance_bonus"],
  persuasion: ["Persuasion check", "persuasion_bonus"],
  religion: ["Religion check", "religion_bonus"],
  "sleight of hand": ["Sleight of Hand check", "sleight_of_hand_bonus"],
  stealth: ["Stealth check", "stealth_bonus"],
  survival: ["Survival check", "survival_bonus"],
};
