import { CastMember } from "creature";
import { delayInitiative } from ".";
import { createStateChange } from "../createChange";
import { StateChange } from "../types";

export function setInitiative(
  castMember: CastMember,
  initiativeOrder: number
): StateChange<CastMember, "delayInitiative" | "initiativeOrder">[] {
  const changes: StateChange<
    CastMember,
    "delayInitiative" | "initiativeOrder"
  >[] = [];
  if (castMember.delayInitiative) {
    changes.push(delayInitiative(castMember, false));
  }
  changes.push(
    createStateChange<CastMember, "initiativeOrder">(
      castMember,
      "setInitiative",
      "initiativeOrder",
      castMember.initiativeOrder,
      initiativeOrder
    )
  );
  return changes;
}
