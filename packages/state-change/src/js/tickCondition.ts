import { ActiveCondition, CastMember } from "creature";
import { expireCondition, findCondition } from "./expireCondition";
import { ChangeState, getHistoryHandle } from "./stateChange";

const { pushStateChange } = getHistoryHandle<CastMember>("CastMember");

export const tickCondition: ChangeState<CastMember> = (
  castMember,
  condition: ActiveCondition
) => {
  const actualCondition = findCondition(castMember, condition);
  let { duration } = actualCondition;
  if (duration) {
    duration--;
    if (duration <= 0) {
      return expireCondition(castMember, actualCondition);
    }
  }
  pushStateChange(
    castMember,
    "tick",
    "conditions",
    { [condition.id]: actualCondition },
    { [condition.id]: { ...actualCondition, duration } }
  );
  return {
    ...castMember,
    conditions: Object.fromEntries(
      Object.entries(castMember.conditions).map(([id, c]) =>
        id === actualCondition.id ? [id, { ...c, duration }] : [id, c]
      )
    ),
  };
};

export const startTurn: ChangeState<CastMember> = (
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

export const endTurn: ChangeState<CastMember> = (
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
