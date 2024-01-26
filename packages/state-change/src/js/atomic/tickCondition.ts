import { ActiveCondition, CastMember } from "creature";
import { findCondition, removeConditionChange } from "./expireCondition";
import {
  ChangeState,
  StateChange,
  applyHistoryEntry,
  createStateChange,
  getHistoryHandle,
} from "./stateChange";

const { pushStateHistory } = getHistoryHandle<CastMember>("CastMember");

export const tickCondition: ChangeState<CastMember> = (
  castMember,
  condition: ActiveCondition
) => {
  const change = tickConditionChange(castMember, condition);
  if (!change) {
    return castMember;
  }
  pushStateHistory(change);
  return applyHistoryEntry(change, castMember);
  // const actualCondition = findCondition(castMember, condition);
  // let { duration } = actualCondition;
  // if (duration) {
  //   duration--;
  //   if (duration <= 0) {
  //     return expireCondition(castMember, actualCondition);
  //   }
  // }

  // pushStateChange(
  //   castMember,
  //   "tick",
  //   "conditions",
  //   { [condition.id]: actualCondition },
  //   { [condition.id]: { ...actualCondition, duration } }
  // );
  // return {
  //   ...castMember,
  //   conditions: Object.fromEntries(
  //     Object.entries(castMember.conditions).map(([id, c]) =>
  //       id === actualCondition.id ? [id, { ...c, duration }] : [id, c]
  //     )
  //   ),
  // };
};

export function tickConditionChange(
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
    return removeConditionChange(castMember, actualCondition);
  }
  return createStateChange(
    castMember,
    "tick",
    "conditions",
    { [condition.id]: actualCondition },
    { [condition.id]: { ...actualCondition, duration } }
  );
}

export const startTurnCondition: ChangeState<CastMember> = (
  castMember,
  condition: ActiveCondition
) => {
  if (
    condition.onTurnStart === castMember.id ||
    condition.source === castMember.id // TODO: should we be checking source?
  ) {
    return tickCondition(castMember, condition);
  }
  return castMember;
};

export const endTurnCondition: ChangeState<CastMember> = (
  castMember,
  condition: ActiveCondition
) => {
  if (
    condition.onTurnEnd === castMember.id ||
    condition.source === castMember.id // TODO: should we be checking source?
  ) {
    return tickCondition(castMember, condition);
  }
  return castMember;
};
