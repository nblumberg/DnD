export interface Abilities {
  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
}

export const AbilitiesList = [
  "str",
  "dex",
  "con",
  "int",
  "wis",
  "cha",
] as const;

export type AbilityType = (typeof AbilitiesList)[number];

export function getAbilityModifier(score: number): number {
  return Math.max(Math.floor((score - 10) / 2), -5);
}
