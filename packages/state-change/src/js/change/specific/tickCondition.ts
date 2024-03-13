import { ActiveCondition, CastMember } from "creature";
import { createStateChange } from "../createChange";
import { StateChange } from "../types";
import { findCondition, removeCondition } from "./expireCondition";

export function tickCondition(
  castMember: CastMember,
  condition: ActiveCondition
): StateChange<CastMember, "conditions"> | undefined {
  const actualCondition = findCondition(castMember, condition);
  let { duration } = actualCondition;
  if (typeof duration !== "number") {
    return undefined;
  }
  duration--;
  if (duration <= 0) {
    return removeCondition(castMember, actualCondition);
  }
  return createStateChange(
    castMember,
    "tick",
    "conditions",
    { [condition.id]: actualCondition },
    { [condition.id]: { ...actualCondition, duration } }
  );
}

export function startTurnCondition(
  castMember: CastMember,
  condition: ActiveCondition
): StateChange<CastMember, "conditions"> | undefined {
  if (
    condition.onTurnStart === castMember.id ||
    condition.source === castMember.id // TODO: should we be checking source?
  ) {
    return tickCondition(castMember, condition);
  }
  return undefined;
}

export function endTurnCondition(
  castMember: CastMember,
  condition: ActiveCondition
): StateChange<CastMember, "conditions"> | undefined {
  if (
    condition.onTurnEnd === castMember.id ||
    condition.source === castMember.id // TODO: should we be checking source?
  ) {
    return tickCondition(castMember, condition);
  }
  return undefined;
}
