import { ActiveCondition, CastMember } from "creature";
import { createStateChange } from "../createChange";
import { StateChange } from "../types";

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

export function removeCondition(
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
