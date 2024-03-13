import { CastMember } from "creature";
import { createStateChange } from "../createChange";
import { StateChange } from "../types";

export function endTurn(
  castMember: CastMember
): StateChange<CastMember, "myTurn"> {
  return createStateChange(castMember, "endTurn", "myTurn", true, false);
}
