import { addCastMember } from "./addCastMember";
import { addCondition, undo_addCondition } from "./addCondition";
import {
  damageCastMember,
  damageCastMemberTempHp,
  undo_damageCastMember,
  undo_damageCastMemberTempHp,
} from "./damageCastMember";
import { delayInitiative, undo_delayInitiative } from "./delayInitiative";
import { expireCondition } from "./expireCondition";
import {
  giveCastMemberTemporaryHitPoints,
  undo_giveCastMemberTemporaryHitPoints,
} from "./giveCastMemberTemporaryHitPoints";
import { healCastMember, undo_healCastMember } from "./healCastMember";
import { nameCastMember } from "./nameCastMember";
import { removeCastMember } from "./removeCastMember";
import { setInitiative } from "./setInitiative";
import { tickCondition, undo_tickCondition } from "./tickCondition";

export const stateChanges = {
  addCastMember: [addCastMember],
  addCondition: [addCondition, undo_addCondition],
  damageCastMember: [damageCastMember, undo_damageCastMember],
  damageCastMemberTempHp: [damageCastMemberTempHp, undo_damageCastMemberTempHp],
  delayInitiative: [delayInitiative, undo_delayInitiative],
  expireCondition: [expireCondition],
  giveCastMemberTemporaryHitPoints: [
    giveCastMemberTemporaryHitPoints,
    undo_giveCastMemberTemporaryHitPoints,
  ],
  healCastMember: [healCastMember, undo_healCastMember],
  nameCastMember: [nameCastMember],
  removeCastMember: [removeCastMember],
  setInitiative: [setInitiative],
  tickCondition: [tickCondition, undo_tickCondition],
};
