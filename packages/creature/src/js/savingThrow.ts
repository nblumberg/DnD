import { AbilityType } from "./ability";

export interface SavingThrow {
  dc: number;
  dcType: AbilityType;
  halfDamage?: true;
}
