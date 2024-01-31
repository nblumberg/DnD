import { Roll, RollRaw } from "roll";
import { Abilities, AbilitiesList, getAbilityModifier } from "./ability";
import { Action, ActionParams, actionParamsToAction } from "./action";
import { Alignment, alignmentParamToAlignment } from "./alignment";
import { DamageType } from "./attack";
import { Condition } from "./condition";
import { defaultImage } from "./image";
import { Size } from "./size";
import { Skills, SkillsParams, createSkills } from "./skill";
import { Spells } from "./spell";

export const CreatureTypes = [
  "aberration",
  "beast",
  "celestial",
  "construct",
  "dragon",
  "elemental",
  "fey",
  "fiend",
  "giant",
  "humanoid",
  "monstrosity",
  "ooze",
  "plant",
  "undead",
] as const;
export type CreatureType = (typeof CreatureTypes)[number];

type Speeds = Record<string, number | { rate: number; precision: string }>;

interface Senses {
  "Passive Perception": number;
  [x: string]: number;
}

interface CreatureNonOptional {
  conditionImmunities: Condition[];
  cr: number;
  damageImmunities: DamageType[];
  damageResistances: DamageType[];
  damageVulnerabilities: DamageType[];
  environment: string[];
  hpCurrent: number;
  hpTemp: number;
  initiative: number;
  languages: string[];
  saves: Partial<Abilities>;
}

interface CreatureBase extends Abilities {
  ac: number;
  description?: string;
  hp: number;
  image: string;
  name: string;
  proficiency: number;
  senses: Senses;
  size: Size;
  speeds: Speeds;
  source: string;
  subtype?: string;
  swarm?: Size;
  type: CreatureType;
  url: string;
}

export interface CreatureParams
  extends CreatureBase,
    Partial<CreatureNonOptional> {
  actions?: Record<string, ActionParams[]>;
  alignment: string;
  features?: ActionParams[];
  hd: string;
  speeds: Speeds;
  saves?: Partial<Abilities>;
  skills?: SkillsParams;
  spells?: Spells;
}

export interface Creature extends CreatureBase, CreatureNonOptional {
  actions: Record<string, Action[]>;
  alignment: Alignment;
  features: Action[];
  hd: RollRaw;
  saves: Abilities;
  skills: Skills;
  spells?: Spells;
}

export function creatureParamsToCreature(params: CreatureParams): Creature {
  const actions: Record<string, Action[]> = params.actions
    ? Object.fromEntries(
        Object.entries(params.actions).map(([category, actions]) => [
          category,
          actions.map((params) => actionParamsToAction(params)),
        ])
      )
    : {};
  const abilityModifiers: Abilities = AbilitiesList.reduce((acc, ability) => {
    return {
      ...acc,
      [ability]: getAbilityModifier(params[ability]),
    };
  }, {} as Abilities);

  const hd = new Roll(params.hd).raw();
  const creature: Creature = {
    ...params,
    actions,
    alignment: alignmentParamToAlignment(params.alignment),
    cr: hd.dieCount,
    conditionImmunities: params.conditionImmunities ?? [],
    damageImmunities: params.damageImmunities ?? [],
    damageResistances: params.damageResistances ?? [],
    damageVulnerabilities: params.damageVulnerabilities ?? [],
    environment: params.environment ?? [],
    features:
      params?.features?.map((params) => actionParamsToAction(params)) ?? [],
    hd,
    hpCurrent: params.hpCurrent ?? params.hp,
    hpTemp: params.hpTemp ?? 0,
    image: defaultImage(params.type, params.image),
    initiative: params.initiative ?? abilityModifiers.dex,
    languages: params.languages ?? [],
    saves: { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 },
    skills: createSkills(abilityModifiers, params.skills),
  };
  AbilitiesList.forEach((ability) => {
    creature.saves[ability] =
      params.saves?.[ability] ?? abilityModifiers[ability];
  });
  return creature;
}
