import { CastMember } from "creature";
import { createStateRemove } from "../createChange";
import { StateRemove } from "../types";

export function removeCastMember(
  castMember: CastMember
): StateRemove<CastMember> {
  return createStateRemove(castMember, "removeCastMember");
}
