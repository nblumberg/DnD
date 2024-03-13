import { CastMember } from "creature";
import { createStateChange } from "../createChange";
import { StateChange } from "../types";

export function delayInitiative(
  castMember: CastMember,
  delayInitiative = true
): StateChange<CastMember, "delayInitiative"> {
  return createStateChange<CastMember, "delayInitiative">(
    castMember,
    "delayInitiative",
    "delayInitiative",
    castMember.delayInitiative,
    delayInitiative
  );
}
