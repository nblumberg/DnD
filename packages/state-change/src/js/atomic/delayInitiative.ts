import { CastMember } from "creature";
import {
  ChangeState,
  StateChange,
  applyHistoryEntry,
  createStateChange,
  getHistoryHandle,
} from "./stateChange";

const { pushStateHistory } = getHistoryHandle<CastMember>("CastMember");

export const delayInitiative: ChangeState<CastMember> = (
  castMember,
  delayInitiative: boolean
) => {
  const change = delayInitiativeChange(castMember, delayInitiative);
  pushStateHistory(change);
  return applyHistoryEntry(change, castMember);
};

export function delayInitiativeChange(
  castMember: CastMember,
  delayInitiative = true
): StateChange<CastMember, "delayInitiative"> {
  return createStateChange<CastMember, "delayInitiative">(
    castMember,
    "delayInitiative",
    "delayInitiative",
    castMember.delayInitiative,
    delayInitiative
  );
}
