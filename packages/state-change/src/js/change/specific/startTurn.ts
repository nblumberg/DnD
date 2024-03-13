import { CastMember } from "creature";
import { createStateChange } from "../createChange";
import { StateChange } from "../types";

export function startTurn(
  castMember: CastMember
): StateChange<CastMember, "myTurn"> {
  return createStateChange(castMember, "startTurn", "myTurn", false, true);
}
