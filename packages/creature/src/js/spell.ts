import { AttackEffect, CreatureType, Damage } from ".";
import { SavingThrow } from "./savingThrow";

type SpellLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
interface PreparedSpellsByLevel {
  slots: number | "∞";
  spells: string[];
}
type InnateSpells = Record<string, number | "∞">;
export type Spells = Record<SpellLevel, PreparedSpellsByLevel> & {
  innate: InnateSpells;
};

type SpellSchool =
  | "abjuration"
  | "conjuration"
  | "divination"
  | "enchantment"
  | "evocation"
  | "illusion"
  | "necromancy"
  | "transmutation";

const DivineDomains = [
  "aracana",
  "death",
  "forge",
  "grave",
  "knowledge",
  "life",
  "light",
  "nature",
  "order",
  "peace",
  "tempest",
  "trickery",
  "twilight",
  "war",
] as const;

const DruidCircles = [
  "circle of dreams",
  "circle of spores",
  "circle of stars",
  "circle of the land (artic)",
  "circle of the land (coast)",
  "circle of the land (desert)",
  "circle of the land (forest)",
  "circle of the land (grassland)",
  "circle of the land (mountain)",
  "circle of the land (swamp)",
  "circle of the land (underdark)",
  "circle of the moon",
  "circle of the shepherd",
  "circle of wildfire",
];

const CharacterClasses = [
  "bard",
  "cleric",
  "druid",
  "paladin",
  "ranger",
  "sorcerer",
  "warlock",
  "wizard",
  "artificer",
  "blood hunter",
  "circle of the land (swamp)",
  "peace domain",
  "nature domain",
  "oath of the watchers",

  "mystic",
  "psion",
  "shaman",
  "spiritualist",
  "summoner",
  "witch",
  "alchemist",
  "investigator",
  "magus",
  "medium",
  "mesmerist",
  "occultist",
  "psychic",
  "skald",
] as const;

type SpellClass =
  | (typeof CharacterClasses)[number]
  | (typeof DivineDomains)[number]
  | (typeof DruidCircles)[number];

type Resist = "melee" | "ranged" | SavingThrow;

export const CastingTimes = [
  "action",
  "bonus action",
  "reaction",
  "minute",
  "hour",
  "day",
] as const;
export type CastingTimePeriod = (typeof CastingTimes)[number];

export const SpellRanges = ["self", "touch", "sight", "unlimited"] as const;
export type SpellRange = (typeof SpellRanges)[number];

export const SpellShapes = [
  "cone",
  "cube",
  "cylinder",
  "line",
  "sphere",
  "square",
] as const;
export type SpellShape = (typeof SpellShapes)[number];

type SpellCondition = Omit<
  AttackEffect,
  keyof SavingThrow | "id" | "description" | "source"
>;

export interface Spell {
  id: string;
  name: string;
  level: SpellLevel;
  school: SpellSchool;
  castingTime: {
    count: number;
    period: CastingTimePeriod;
  };
  components: {
    V?: true;
    S?: true;
    M?: string;
    gp?: number;
  };
  resist?: Resist;
  range: number | SpellRange;
  area?: {
    size: number;
    shape: SpellShape;
  };
  duration:
    | number
    | "instantaneous"
    | "permanent"
    | "until dispelled"
    | "special";
  concentration?: true;
  ritual?: true;

  description: string;

  damage?: Damage[];
  cantripDamageIncrease?: Damage[];
  conditions?: SpellCondition[];

  unaffected?: Array<CreatureType | "object">[];

  atHigherLevels?: string;

  classes: SpellClass[];
  tags: string[];
  source: string;
}

export interface SpellAttack extends Spell {
  resist: Resist;
}
