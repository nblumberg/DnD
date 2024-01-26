import { CastMember, castMemberDoSomething } from "creature";
import {
  RemoveFromState,
  StateRemove,
  createStateRemove,
  getHistoryHandle,
} from "./stateChange";

const { pushStateHistory } = getHistoryHandle<CastMember>("CastMember");

export const removeCastMember: RemoveFromState<CastMember> = (
  castMember: CastMember
) => {
  castMemberDoSomething(castMember, "leaves the game");
  removeCastMemberChange(castMember);
  pushStateHistory(removeCastMemberChange(castMember));
  return { ...castMember };
};

export function removeCastMemberChange(
  castMember: CastMember
): StateRemove<CastMember> {
  return createStateRemove(castMember, "removeCastMember");
}
