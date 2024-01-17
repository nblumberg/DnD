import { Roll, RollRaw } from "roll";
import { Serializable } from "serializable";
import { Abilities, Ability, AbilityRaw } from "./ability";
import { ActionParams } from "./action";
import { Alignment, AlignmentParam, AlignmentRaw } from "./alignment";
import { DamageType } from "./attack";
import { Condition } from "./condition";
import { Size } from "./size";
import { Skill, Skills, SkillsParams, SkillsRaw, createSkills } from "./skill";
import { Spells } from "./spell";

type Speeds = Record<string, number | { rate: number; precision: string }>;

interface Senses {
  "Passive Perception": number;
  [x: string]: number;
}

const defaultImageBase = "https://www.dndbeyond.com/attachments/2/";
const defaultImages: Record<string, string> = {
  beast: "648/beast.jpg",
  construct: "650/construct.jpg",
  dragon: "651/dragon.jpg",
  elemental: "652/elemental.jpg",
  fiend: "654/fiend.jpg",
  humanoid: "656/humanoid.jpg",
  monstrosity: "657/monstrosity.jpg",
  ooze: "658/ooze.jpg",
  plant: "659/plant.jpg",
  undead: "660/undead.jpg",
};

export interface CreatureParams extends Abilities {
  name: string;
  url: string;
  image: string;
  size: Size;
  type: string;
  subtype?: string;
  alignment: AlignmentParam | string;
  ac: number;
  hp: number;
  hpCurrent?: number;
  hpTemp?: number;
  hd: string;
  initiative?: number;
  speeds: Speeds;
  saves?: Partial<Abilities>;
  skills?: Partial<SkillsParams>;
  senses: Senses;
  languages?: string[];
  cr?: number;
  proficiency: number;
  description: string;
  environment: string[];
  source: string;
  features?: ActionParams[];
  actions?: Record<string, ActionParams[]>;
  spells?: Spells;
  damageVulnerabilities?: DamageType[];
  damageResistances?: DamageType[];
  damageImmunities?: DamageType[];
  conditionImmunities?: Condition[];
}

export interface CreatureRaw {
  name: string;
  description?: string;

  url: string;
  image: string;

  size: Size;
  type: string;
  subtype?: string;
  alignment: AlignmentRaw;

  ac: number;
  hp: number;
  hd: RollRaw;
  speeds: Speeds;

  str: AbilityRaw;
  dex: AbilityRaw;
  con: AbilityRaw;
  int: AbilityRaw;
  wis: AbilityRaw;
  cha: AbilityRaw;

  initiativeModifier: number;

  saves: Abilities;

  damageVulnerabilities: DamageType[];
  damageResistances: DamageType[];
  damageImmunities: DamageType[];
  conditionImmunities: Condition[];

  skills: SkillsRaw;

  senses: Senses;
  languages: string[];
  cr: number;
  proficiency: number;

  environment?: string[];
  source?: string;

  features: ActionParams[];
  actions: Record<string, ActionParams[]>;
  spells?: Spells;
}

export class Creature extends Serializable<CreatureRaw> implements CreatureRaw {
  name: string;
  description?: string;

  url: string;
  image: string;

  size: Size;
  type: string;
  subtype?: string;
  alignment: Alignment;

  ac: number;
  hp: number;
  hd: Roll;
  speeds: Speeds;

  str: Ability;
  dex: Ability;
  con: Ability;
  int: Ability;
  wis: Ability;
  cha: Ability;

  initiativeModifier: number;

  saves: Abilities;

  damageVulnerabilities: DamageType[];
  damageResistances: DamageType[];
  damageImmunities: DamageType[];
  conditionImmunities: Condition[];

  skills: Skills;

  senses: Senses;
  languages: string[];
  cr: number;
  proficiency: number;

  environment?: string[];
  source?: string;

  features: ActionParams[];
  actions: Record<string, ActionParams[]>;
  spells?: Spells;

  constructor(params: CreatureParams | CreatureRaw) {
    super();
    this.name = params.name;
    this.description = params.description;

    this.url = params.url;

    this.size = params.size;
    this.type = params.type;
    this.subtype = params.subtype;

    if (params.image) {
      this.image = params.image;
    } else {
      this.image = `${defaultImageBase}${
        defaultImages[this.type.toLowerCase()]
      }`;
    }

    this.ac = params.ac;
    this.hp = params.hp;
    if (typeof params.hd === "string") {
      this.hd = new Roll(params.hd);
    } else if (typeof params.hd === "object") {
      this.hd = new Roll(params.hd);
    } else {
      throw new Error(`Invalid hd: ${params.hd}`);
    }
    this.speeds = params.speeds;

    this.senses = { ...params.senses };
    this.languages = [...(params.languages ?? [])];
    this.cr = params.cr ?? this.hd.dieCount;
    this.proficiency = params.proficiency;

    this.environment = params.environment;
    this.source = params.source;

    this.features = [...(params?.features ?? [])];
    this.actions = { ...(params?.actions ?? {}) };
    if (params.spells) {
      this.spells = { ...params.spells };
    }

    this.alignment = new Alignment(
      typeof params.alignment === "string"
        ? params.alignment
        : params.alignment.longName
    );

    function initAbility(property: keyof Abilities): Ability {
      const ability = params[property];
      const modifier: number =
        typeof ability === "number" ? ability : ability.modifier;
      return new Ability(modifier);
    }
    this.str = initAbility("str");
    this.dex = initAbility("dex");
    this.con = initAbility("con");
    this.int = initAbility("int");
    this.wis = initAbility("wis");
    this.cha = initAbility("cha");

    const abilityModifiers = {
      str: this.str.modifier,
      dex: this.dex.modifier,
      con: this.con.modifier,
      int: this.int.modifier,
      wis: this.wis.modifier,
      cha: this.cha.modifier,
    };

    this.saves = {
      ...abilityModifiers,
      ...params.saves,
    };

    if (
      Object.values((params.skills ?? {}) as Record<string, any>).find(
        (skill) => typeof skill === "number"
      )
    ) {
      // SkillsParams case
      this.skills = createSkills(
        abilityModifiers,
        params.skills as SkillsParams
      );
    } else {
      // Skills or SkillsRaw case
      this.skills = {} as Skills;
      Object.entries((params.skills ?? {}) as SkillsRaw).forEach(
        ([name, skill]) => {
          this.skills[name] = new Skill(skill);
        }
      );
    }

    if ("initiativeModifier" in params) {
      this.initiativeModifier = params.initiativeModifier;
    } else {
      this.initiativeModifier = params.initiative ?? this.dex.modifier;
    }

    this.damageVulnerabilities = params.damageVulnerabilities ?? [];
    this.damageResistances = params.damageResistances ?? [];
    this.damageImmunities = params.damageImmunities ?? [];
    this.conditionImmunities = params.conditionImmunities ?? [];
  }
}

// export type CreatureRaw = ClassMembers<
//   Omit<Creature, keyof Abilities | "alignment" | "hd" | "skills">
// > & {
//   str: AbilityRaw;
//   dex: AbilityRaw;
//   con: AbilityRaw;
//   int: AbilityRaw;
//   wis: AbilityRaw;
//   cha: AbilityRaw;

//   alignment: AlignmentRaw;
//   hd: RollRaw;
//   skills: SkillsRaw;
// };
