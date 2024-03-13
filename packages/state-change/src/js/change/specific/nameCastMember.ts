import { CastMember } from "creature";
import { createStateChange } from "../createChange";
import { StateChange } from "../types";

export function nameCastMember(
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
