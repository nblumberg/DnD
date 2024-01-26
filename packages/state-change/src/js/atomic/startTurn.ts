import { CastMember } from "creature";
import {
  ChangeState,
  StateChange,
  applyHistoryEntry,
  createStateChange,
  getHistoryHandle,
} from "./stateChange";

const { pushStateHistory } = getHistoryHandle<CastMember>("CastMember");

export const startTurn: ChangeState<CastMember> = (castMember) => {
  if (castMember.myTurn) {
    return castMember;
  }
  const change = startTurnChange(castMember);
  pushStateHistory(change);
  return applyHistoryEntry(change, castMember);
};

export function startTurnChange(
  castMember: CastMember
): StateChange<CastMember, "myTurn"> {
  return createStateChange(castMember, "startTurn", "myTurn", false, true);
}
