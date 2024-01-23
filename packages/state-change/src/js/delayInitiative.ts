import { CastMember } from "creature";
import { ChangeState, getHistoryHandle } from "./stateChange";

const { pushStateChange } = getHistoryHandle<CastMember>("CastMember");

export const delayInitiative: ChangeState<CastMember> = (
  castMember,
  delayInitiative: boolean
) => {
  pushStateChange(
    castMember,
    "delayInitiative",
    "delayInitiative",
    castMember.delayInitiative,
    delayInitiative
  );
  return {
    ...castMember,
    delayInitiative,
  };
};
