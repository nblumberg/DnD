import { CastMember } from "creature";
import { createStateChange } from "../createChange";
import { ChangeHistoryEntry } from "../types";

export function giveCastMemberTemporaryHitPoints(
  castMember: CastMember,
  amount: number
): ChangeHistoryEntry<CastMember> | undefined {
  if (amount <= castMember.hpTemp) {
    return;
  }
  return createStateChange(
    castMember,
    "giveCastMemberTemporaryHitPoints",
    "hpTemp",
    castMember.hpTemp,
    amount
  );
}
