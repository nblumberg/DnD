import { CastMember } from "creature";
import { ChangeState, getHistoryHandle } from "./stateChange";

const { pushStateChange } = getHistoryHandle<CastMember>("CastMember");

export const nameCastMember: ChangeState<CastMember> = (
  castMember,
  nickname: string
) => {
  pushStateChange(
    castMember,
    "nameCastMember",
    "nickname",
    castMember.nickname,
    nickname
  );
  return {
    ...castMember,
    nickname,
  };
};
