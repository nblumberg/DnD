import { Roll } from "roll";
import { AbilityType, getAbilityModifier } from "./ability";
import { CastMember } from "./castMember";

export function makeCheck(
  extra: number,
  crits?: number
): { result: number; roll: Roll } {
  const roll = new Roll({ dieCount: 1, dieSides: 20, extra, crits });
  const result = roll.roll();
  return { result, roll };
}

export function makeAbilityCheck(
  params: CastMember | number,
  ability?: AbilityType
): ReturnType<typeof makeCheck> {
  if (typeof params !== "number" && !ability) {
    throw new Error("Ability check requires an ability");
  }
  const score = typeof params === "number" ? params : params[ability!];
  const modifier = getAbilityModifier(score);
  return makeCheck(modifier);
}

export function makeSkillCheck(
  castMember: CastMember,
  skill: string
): ReturnType<typeof makeCheck> {
  if (castMember.skills[skill] === undefined) {
    throw new Error(`Cast member ${castMember.id} has no skill ${skill}`);
  }
  return makeCheck(castMember.skills[skill].modifier);
}
