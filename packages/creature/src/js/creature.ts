import { Roll } from "roll";
import { Serializable } from "serializable";
import { Abilities, Ability } from "./ability";
import { ActionParams } from "./action";
import { Alignment, AlignmentParam } from "./alignment";
import { Size } from "./size";
import { Skill, Skills, SkillsParams, createSkills } from "./skill";
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

class Check extends Roll {
  modifier: number;

  constructor(extra: number, crits?: number) {
    super({
      dieCount: 1,
      dieSides: 20,
      extra,
      crits,
    });
    this.modifier = extra;
  }
}

export interface CreatureParams extends Abilities {
  name: string;
  url: string;
  image: string;
  size: Size;
  type: string;
  subtype?: string;
  alignment: AlignmentParam;
  ac: number;
  hp: number;
  hd: number;
  initiative?: number;
  speeds: Speeds;
  saves?: Partial<Abilities>;
  skills?: SkillsParams;
  senses: Senses;
  languages?: string[];
  cr?: number;
  proficiency: number;
  description: string;
  environment: string;
  source: string;
  features?: ActionParams[];
  actions?: Record<string, ActionParams[]>;
  spells?: Spells;
}

export class Creature extends Serializable {
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
  hd: number;
  speeds: Speeds;

  str: Ability;
  dex: Ability;
  con: Ability;
  int: Ability;
  wis: Ability;
  cha: Ability;

  initiative: Check;

  saves: Abilities;

  skills: Skills;

  senses: Senses;
  languages: string[];
  cr: number;
  proficiency: number;

  environment?: string;
  source?: string;

  features: ActionParams[];
  actions: Record<string, ActionParams[]>;
  spells?: Spells;

  constructor(params: CreatureParams | Creature) {
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
    this.hd = params.hd;
    this.speeds = params.speeds;

    this.senses = { ...params.senses };
    this.languages = [...(params.languages ?? [])];
    this.cr = params.cr ?? this.hd;
    this.proficiency = params.proficiency;

    this.environment = params.environment;
    this.source = params.source;

    this.features = [...(params?.features ?? [])];
    this.actions = { ...(params?.actions ?? {}) };
    if (params.spells) {
      this.spells = { ...params.spells };
    }

    if (params instanceof Creature) {
      this.alignment = params.alignment;

      this.str = new Ability(params.str.modifier);
      this.dex = new Ability(params.dex.modifier);
      this.con = new Ability(params.con.modifier);
      this.int = new Ability(params.int.modifier);
      this.wis = new Ability(params.wis.modifier);
      this.cha = new Ability(params.cha.modifier);

      this.saves = {
        ...params.saves,
      };

      this.skills = {} as Skills;
      Object.entries(params.skills).forEach(([name, skill]) => {
        this.skills[name] = new Skill(
          skill.name,
          skill.modifier,
          skill.ability,
          skill.proficient,
          skill.expertise,
          skill.jackOfAllTrades
        );
      });
    } else {
      this.alignment = new Alignment(params.alignment);

      this.str = new Ability(params.str);
      this.dex = new Ability(params.dex);
      this.con = new Ability(params.con);
      this.int = new Ability(params.int);
      this.wis = new Ability(params.wis);
      this.cha = new Ability(params.cha);

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

      this.skills = createSkills(abilityModifiers, params.skills);
    }

    this.initiative = new Check(
      params.initiative instanceof Check
        ? params.initiative.modifier
        : params.initiative ?? this.dex.modifier
    );
  }
}
