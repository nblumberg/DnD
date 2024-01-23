import { ActiveCondition, CastMember, castMemberDoSomething } from "creature";
import { ChangeState, getHistoryHandle } from "./stateChange";

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
  pushStateHistory({
    type: "c-",
    action: "expireCondition",
    object: castMember.id,
    property: "conditions",
    oldValue: { [actualCondition.id]: actualCondition },
  });
  castMemberDoSomething(castMember, `stops being ${actualCondition.condition}`);
  return {
    ...castMember,
    conditions: Object.fromEntries(
      Object.entries(castMember.conditions).filter(
        ([id]) => id !== actualCondition.id
      )
    ),
  };
};
