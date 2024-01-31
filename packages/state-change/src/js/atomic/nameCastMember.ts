import { CastMember } from "creature";
import {
  ChangeState,
  StateChange,
  applyHistoryEntry,
  createStateChange,
  getHistoryHandle,
} from "./stateChange";

const { pushStateHistory } = getHistoryHandle<CastMember>("CastMember");

export const nameCastMember: ChangeState<CastMember> = (
  castMember,
  nickname: string
) => {
  const change = nameCastMemberChange(castMember, nickname);
  pushStateHistory(change);
  return applyHistoryEntry(change, castMember);
};

export function nameCastMemberChange(
  castMember: CastMember,
  nickname: string
): StateChange<CastMember, "nickname"> {
  return createStateChange(
    castMember,
    "nameCastMember",
    "nickname",
    castMember.nickname,
    nickname
  );
}
