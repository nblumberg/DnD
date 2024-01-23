import { ActiveCondition, CastMember, castMemberDoSomething } from "creature";
import {
  ChangeState,
  StateChange,
  applyStateChange,
  getHistoryHandle,
} from "./stateChange";

const { pushStateHistory } = getHistoryHandle<CastMember>("CastMember");

let nextConditionId = 1;

export const addCondition: ChangeState<CastMember> = (
  castMember,
  condition: Omit<ActiveCondition, "id">,
  testingForceId?: string
) => {
  if (castMember.conditionImmunities.includes(condition.condition)) {
    castMemberDoSomething(
      castMember,
      `is immune to being ${condition.condition}`
    );
    return castMember;
  }
  const existingConditions = Object.keys(castMember.conditions);
  const id = testingForceId
    ? (condition as ActiveCondition).id
    : `condition_${condition.condition}_${nextConditionId++}`;
  if (existingConditions.includes(id)) {
    throw new Error(`Condition ${id} already exists on ${castMember.id}`);
  }
  const fullCondition: ActiveCondition = { ...condition, id };
  castMemberDoSomething(castMember, `starts being ${condition.condition}`);
  const change = pushStateHistory({
    type: "c+",
    action: "addCondition",
    object: castMember.id,
    property: "conditions",
    newValue: { [id]: fullCondition },
  });
  return applyStateChange(
    change as StateChange<CastMember, "conditions">,
    castMember
  );
};
