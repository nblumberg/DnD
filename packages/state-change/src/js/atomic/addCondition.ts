import { ActiveCondition, CastMember, castMemberDoSomething } from "creature";
import { getUniqueId } from "../util/unique";
import {
  ChangeState,
  StateChange,
  applyHistoryEntry,
  createStateChange,
  getHistoryHandle,
} from "./stateChange";

const { pushStateHistory } = getHistoryHandle<CastMember>("CastMember");

export const addCondition: ChangeState<CastMember> = (
  castMember,
  condition: Omit<ActiveCondition, "id">
) => {
  if (castMember.conditionImmunities.includes(condition.condition)) {
    castMemberDoSomething(
      castMember,
      `is immune to being ${condition.condition}`
    );
    return castMember;
  }
  castMemberDoSomething(castMember, `starts being ${condition.condition}`);
  const change = addConditionChange(castMember, condition);
  pushStateHistory(change);
  return applyHistoryEntry(change, castMember);
};

export function addConditionChange(
  castMember: CastMember,
  condition: Omit<ActiveCondition, "id">
): StateChange<CastMember, "conditions"> {
  const existingConditions = Object.keys(castMember.conditions);
  const id = getUniqueId();
  if (existingConditions.includes(id)) {
    throw new Error(`Condition ${id} already exists on ${castMember.id}`);
  }
  const fullCondition: ActiveCondition = { ...condition, id };
  return createStateChange(
    castMember,
    "addCondition",
    "conditions",
    undefined,
    { [id]: fullCondition },
    "c+"
  );
}
