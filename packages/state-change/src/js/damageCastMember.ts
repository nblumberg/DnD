import { CastMember, DamageType, castMemberDoSomething } from "creature";
import { ChangeState, getHistoryHandle } from "./stateChange";

const { pushStateChange } = getHistoryHandle<CastMember>("CastMember");

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

export const damageCastMemberTempHp: ChangeState<CastMember> = (
  castMember,
  amount: number,
  type: DamageType
) => {
  if (!castMember.hpTemp || !amount) {
    return castMember;
  }
  const tmpAmount = damageToTempDamage(castMember, amount);
  castMemberDoSomething(
    castMember,
    `takes ${tmpAmount} ${type} damage from temporary Hit Points`
  );
  const hpTemp = castMember.hpTemp - tmpAmount;
  pushStateChange(
    castMember,
    "damageCastMemberTempHp",
    "hpTemp",
    castMember.hpTemp,
    hpTemp
  );
  return {
    ...castMember,
    hpTemp,
  };
};

/**
 * Potentially push a StateChange of hpTemp first, then hpCurrent.
 */
export const damageCastMember: ChangeState<CastMember> = (
  castMember,
  amount: number,
  type: DamageType
) => {
  const tmpState = damageCastMemberTempHp(castMember, amount, type);
  const actualAmount =
    damageToRelativeDamage(castMember, amount, type) -
    damageToTempDamage(castMember, amount);
  castMemberDoSomething(castMember, `takes ${actualAmount} ${type} damage`);
  if (!actualAmount) {
    return tmpState;
  }
  const hpCurrent = castMember.hpCurrent - actualAmount;
  pushStateChange(
    castMember,
    "damageCastMember",
    "hpCurrent",
    castMember.hpCurrent,
    hpCurrent
  );

  return {
    ...tmpState,
    hpCurrent,
  };
};
