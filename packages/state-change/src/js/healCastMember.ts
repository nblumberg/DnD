import { CastMember, castMemberDoSomething } from "creature";
import { ChangeState, UndoStateChange, getHistoryHandle } from "./stateChange";

const { pushStateChange, popStateHistory } =
  getHistoryHandle<CastMember>("CastMember");

export const healCastMember: ChangeState<CastMember> = (
  castMember,
  amount: number
) => {
  const actualAmount = Math.min(amount, castMember.hp - castMember.hpCurrent);
  castMemberDoSomething(castMember, `heals ${actualAmount} damage`);
  const hpCurrent = castMember.hpCurrent + actualAmount;

  pushStateChange(
    castMember,
    "setInitiative",
    "hpCurrent",
    castMember.hpCurrent,
    hpCurrent
  );
  return {
    ...castMember,
    hpCurrent,
  };
};

export const undo_healCastMember: UndoStateChange<CastMember, "hpCurrent"> = (
  change,
  castMember
) => {
  popStateHistory(change);
  return {
    ...castMember,
    hpCurrent: change.oldValue!,
  };
};
