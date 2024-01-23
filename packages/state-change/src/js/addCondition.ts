import { ActiveCondition, CastMember, castMemberDoSomething } from "creature";
import {
  ChangeState,
  UndoStateChange,
  applyStateChange,
  getHistoryHandle,
} from "./stateChange";

const { pushStateChange, popStateHistory } =
  getHistoryHandle<CastMember>("CastMember");

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
  const change = pushStateChange(
    castMember,
    "addCondition",
    "conditions",
    undefined,
    { [id]: fullCondition }
  );
  return applyStateChange(change, castMember);
};

export const undo_addCondition: UndoStateChange<CastMember, "conditions"> = (
  change,
  castMember
) => {
  popStateHistory(change);
  const [[id]] = Object.entries(change.newValue!);
  return {
    ...castMember,
    conditions: Object.fromEntries(
      Object.entries(castMember.conditions).filter(
        ([conditionId]) => conditionId !== id
      )
    ),
  };
};
