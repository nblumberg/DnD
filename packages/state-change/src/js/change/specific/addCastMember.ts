import { CastMember } from "creature";
import { createStateAdd } from "../createChange";
import { StateAdd } from "../types";

export function addCastMember(castMember: CastMember): StateAdd<CastMember> {
  return createStateAdd(castMember, "addCastMember");
}
