import { CastMember, DamageType, castMemberDoSomething } from "creature";
import { createStateChange } from "../createChange";
import { StateChange } from "../types";

function damageToRelativeDamage(
  castMember: CastMember,
  amount: number,
  type: DamageType
): number {
  let actualAmount = amount;
  if (castMember.damageImmunities.includes(type)) {
    castMemberDoSomething(castMember, `is immune to ${type} damage`);
    return 0;
  } else if (castMember.damageResistances.includes(type)) {
    castMemberDoSomething(castMember, `resists half ${type} damage`);
    actualAmount = Math.floor(amount / 2);
  } else if (castMember.damageVulnerabilities.includes(type)) {
    castMemberDoSomething(castMember, `takes double ${type} damage`);
    actualAmount = amount * 2;
  }
  return actualAmount;
}

function damageToTempDamage(castMember: CastMember, amount: number): number {
  return castMember.hpTemp ? Math.min(castMember.hpTemp, amount) : 0;
}

export function damageCastMemberTempHp(
  castMember: CastMember,
  totalDamage: number
): StateChange<CastMember, "hpTemp"> | undefined {
  if (!castMember.hpTemp || !totalDamage) {
    return undefined;
  }
  const tmpAmount = damageToTempDamage(castMember, totalDamage);
  const hpTemp = castMember.hpTemp - tmpAmount;
  return createStateChange(
    castMember,
    "damageCastMemberTempHp",
    "hpTemp",
    castMember.hpTemp,
    hpTemp
  );
}

export function damageCastMember(
  castMember: CastMember,
  amount: number,
  type: DamageType
): StateChange<CastMember, "hpTemp" | "hpCurrent">[] {
  const changes: StateChange<CastMember, "hpTemp" | "hpCurrent">[] = [];
  const actualAmount = damageToRelativeDamage(castMember, amount, type);
  const tmpChange = damageCastMemberTempHp(castMember, actualAmount);
  if (tmpChange) {
    changes.push(tmpChange);
  }
  const remainingAmount =
    actualAmount - damageToTempDamage(castMember, actualAmount);
  if (!remainingAmount) {
    return changes;
  }
  const hpCurrent = castMember.hpCurrent - remainingAmount;
  changes.push(
    createStateChange(
      castMember,
      "damageCastMember",
      "hpCurrent",
      castMember.hpCurrent,
      hpCurrent
    )
  );
  return changes;
}
