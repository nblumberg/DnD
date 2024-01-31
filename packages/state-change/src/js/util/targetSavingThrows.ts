import { SavingThrow } from "creature";
import { RollHistory } from "roll";

export function targetSavingThrows(
  savingThrow: SavingThrow,
  targetSavingThrows: RollHistory[]
): boolean[] {
  return targetSavingThrows.map((roll) => roll.total >= savingThrow.dc);
}
