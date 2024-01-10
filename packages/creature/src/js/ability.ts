export interface Abilities {
  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
}

export type AbilityParam = "str" | "dex" | "con" | "int" | "wis" | "cha";

export class Ability {
  score: number;
  modifier: number;
  constructor(score: number) {
    this.score = score;
    this.modifier = Math.max(Math.floor((score - 10) / 2), -5);
  }
}
