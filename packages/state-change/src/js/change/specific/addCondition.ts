import { ActiveCondition, CastMember } from "creature";
import { getUniqueId } from "../../util/unique";
import { createStateChange } from "../createChange";
import { StateChange } from "../types";

export function addCondition(
  castMember: CastMember,
  condition: Omit<ActiveCondition, "id">
): StateChange<CastMember, "conditions"> | undefined {
  const existingConditions = Object.keys(castMember.conditions);
  const id = getUniqueId();
  if (castMember.conditionImmunities?.includes(condition.condition)) {
    return undefined;
  }
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
