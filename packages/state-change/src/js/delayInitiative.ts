import { CastMember } from "creature";
import { ChangeState, UndoStateChange, getHistoryHandle } from "./stateChange";

const { pushStateChange, popStateHistory } =
  getHistoryHandle<CastMember>("CastMember");

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

export const undo_delayInitiative: UndoStateChange<
  CastMember,
  "delayInitiative"
> = (change, castMember) => {
  popStateHistory(change);
  return {
    ...castMember,
    delayInitiative: change.oldValue ?? false,
  };
};
