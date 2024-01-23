import { CastMember, castMemberDoSomething } from "creature";
import { ChangeState, getHistoryHandle } from "./stateChange";

const { pushStateChange } = getHistoryHandle<CastMember>("CastMember");

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
