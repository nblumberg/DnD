import { CastMember, castMemberDoSomething } from "creature";
import { ChangeState, UndoStateChange, getHistoryHandle } from "./stateChange";

const { pushStateChange, popStateHistory } =
  getHistoryHandle<CastMember>("CastMember");

export const giveCastMemberTemporaryHitPoints: ChangeState<CastMember> = (
  castMember,
  amount: number
) => {
  if (amount <= castMember.hpTemp) {
    castMemberDoSomething(
      castMember,
      `keeps ${castMember.hpTemp} temporary Hit Points`
    );
    return castMember;
  }
  castMemberDoSomething(castMember, `gains ${amount} temporary Hit Points`);
  pushStateChange(
    castMember,
    "giveCastMemberTemporaryHitPoints",
    "hpTemp",
    castMember.hpTemp,
    amount
  );
  return {
    ...castMember,
    hpTemp: amount,
  };
};

export const undo_giveCastMemberTemporaryHitPoints: UndoStateChange<
  CastMember,
  "hpTemp"
> = (change, castMember) => {
  popStateHistory(change);
  return {
    ...castMember,
    hpTemp: change.oldValue ?? 0,
  };
};
