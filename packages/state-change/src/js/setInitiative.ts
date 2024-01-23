import { CastMember } from "creature";
import { delayInitiative } from "./delayInitiative";
import { ChangeState, getHistoryHandle } from "./stateChange";

const { pushStateChange } = getHistoryHandle<CastMember>("CastMember");

export const setInitiative: ChangeState<CastMember> = (
  castMember,
  initiativeOrder: number
) => {
  let currentCastMember = castMember;
  if (castMember.delayInitiative) {
    currentCastMember = delayInitiative(currentCastMember, false);
  }
  pushStateChange(
    currentCastMember,
    "setInitiative",
    "initiativeOrder",
    currentCastMember.initiativeOrder,
    initiativeOrder
  );
  return {
    ...currentCastMember,
    initiativeOrder,
  };
};
