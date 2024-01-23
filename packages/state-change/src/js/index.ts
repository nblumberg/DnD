import { CastMember } from "packages/creature/dist/js";
import { addCastMember } from "./addCastMember";
import { addCondition } from "./addCondition";
import { damageCastMember, damageCastMemberTempHp } from "./damageCastMember";
import { delayInitiative } from "./delayInitiative";
import { expireCondition } from "./expireCondition";
import { giveCastMemberTemporaryHitPoints } from "./giveCastMemberTemporaryHitPoints";
import { healCastMember } from "./healCastMember";
import { nameCastMember } from "./nameCastMember";
import { removeCastMember } from "./removeCastMember";
import { setInitiative } from "./setInitiative";
import { AddToState, ChangeState, RemoveFromState } from "./stateChange";
import { tickCondition } from "./tickCondition";

export const stateChanges: Record<
  string,
  AddToState<CastMember> | RemoveFromState<CastMember> | ChangeState<CastMember>
> = {
  addCastMember,
  addCondition,
  damageCastMember,
  damageCastMemberTempHp,
  delayInitiative,
  expireCondition,
  giveCastMemberTemporaryHitPoints,
  healCastMember,
  nameCastMember,
  removeCastMember,
  setInitiative,
  tickCondition,
};
