import { ActiveCondition, CastMember, castMemberDoSomething } from "creature";
import {
  ChangeState,
  StateChange,
  applyHistoryEntry,
  createStateChange,
  getHistoryHandle,
} from "./stateChange";

const { pushStateHistory } = getHistoryHandle<CastMember>("CastMember");

export function findCondition(
  castMember: CastMember,
  condition: ActiveCondition
): ActiveCondition {
  const actualCondition = Object.values(castMember.conditions).find(
    ({ id }) => id === condition.id
  );
  if (!actualCondition) {
    throw new Error(`Condition ${condition.id} not found on ${castMember.id}`);
  }
  return actualCondition;
}

export const expireCondition: ChangeState<CastMember> = (
  castMember,
  condition: ActiveCondition
) => {
  const actualCondition = findCondition(castMember, condition);
  const change = removeConditionChange(castMember, actualCondition);
  pushStateHistory(change);
  castMemberDoSomething(castMember, `stops being ${actualCondition.condition}`);
  return applyHistoryEntry(change, castMember);
};

export function removeConditionChange(
  castMember: CastMember,
  condition: ActiveCondition
): StateChange<CastMember, "conditions"> {
  const actualCondition = findCondition(castMember, condition);
  return createStateChange(
    castMember,
    "removeCondition",
    "conditions",
    { [actualCondition.id]: actualCondition },
    undefined,
    "c-"
  );
}
