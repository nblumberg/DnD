import { CastMember } from "creature";
import { createStateChange } from "../createChange";
import { ChangeHistoryEntry } from "../types";

export function healCastMember(
  castMember: CastMember,
  amount: number
): ChangeHistoryEntry<CastMember> {
  const actualAmount = Math.min(amount, castMember.hp - castMember.hpCurrent);
  const hpCurrent = castMember.hpCurrent + actualAmount;

  return createStateChange(
    castMember,
    "setInitiative",
    "hpCurrent",
    castMember.hpCurrent,
    hpCurrent
  );
}
