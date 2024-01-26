import { CastMember } from "creature";
import { delayInitiative } from "./delayInitiative";
import {
  ChangeState,
  StateChange,
  applyHistoryEntry,
  createStateChange,
  getHistoryHandle,
} from "./stateChange";

const { pushStateHistory } = getHistoryHandle<CastMember>("CastMember");

export const setInitiative: ChangeState<CastMember> = (
  castMember,
  initiativeOrder: number
) => {
  let currentCastMember = castMember;
  if (castMember.delayInitiative) {
    currentCastMember = delayInitiative(currentCastMember, false);
  }
  const change = setInitiativeChange(currentCastMember, initiativeOrder);
  pushStateHistory(change);
  return applyHistoryEntry(change, currentCastMember);
};

export function setInitiativeChange(
  castMember: CastMember,
  initiativeOrder: number
): StateChange<CastMember, "initiativeOrder"> {
  return createStateChange<CastMember, "initiativeOrder">(
    castMember,
    "setInitiative",
    "initiativeOrder",
    castMember.initiativeOrder,
    initiativeOrder
  );
}
