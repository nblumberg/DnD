import { ClassMembers, Serializable } from "serializable";

export interface Abilities {
  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
}

export type AbilityParam = "str" | "dex" | "con" | "int" | "wis" | "cha";

export class Ability extends Serializable<AbilityRaw> {
  score: number;
  modifier: number;

  constructor(...args: [number] | [AbilityRaw]) {
    super();
    this.score = typeof args[0] === "number" ? args[0] : args[0].score;
    this.modifier = Math.max(Math.floor((this.score - 10) / 2), -5);
  }
}

export type AbilityRaw = ClassMembers<Ability>;
