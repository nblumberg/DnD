import { CastMember } from "creature";
import {
  ChangeState,
  StateChange,
  applyHistoryEntry,
  createStateChange,
  getHistoryHandle,
} from "./stateChange";

const { pushStateHistory } = getHistoryHandle<CastMember>("CastMember");

export const endTurn: ChangeState<CastMember> = (castMember) => {
  if (!castMember.myTurn) {
    return castMember;
  }
  const change = endTurnChange(castMember);
  pushStateHistory(change);
  return applyHistoryEntry(change, castMember);
};

export function endTurnChange(
  castMember: CastMember
): StateChange<CastMember, "myTurn"> {
  return createStateChange(castMember, "endTurn", "myTurn", true, false);
}
