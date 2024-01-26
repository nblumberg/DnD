import { CastMember, castMemberDoSomething } from "creature";
import { ChangeState, getHistoryHandle } from "./stateChange";

const { pushStateChange } = getHistoryHandle<CastMember>("CastMember");

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
