import { CastMember, castMemberDoSomething } from "creature";
import { RemoveFromState, getHistoryHandle } from "./stateChange";

const { pushStateRemove } = getHistoryHandle<CastMember>("CastMember");

export const removeCastMember: RemoveFromState<CastMember> = (
  castMember: CastMember
) => {
  castMemberDoSomething(castMember, "leaves the game");
  pushStateRemove(castMember, "removeCastMember");
  return { ...castMember };
};
