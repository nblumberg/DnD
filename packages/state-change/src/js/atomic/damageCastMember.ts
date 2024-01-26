import { CastMember, DamageType, castMemberDoSomething } from "creature";
import {
  ChangeState,
  StateChange,
  applyHistoryEntry,
  createStateChange,
  getHistoryHandle,
} from "./stateChange";

const { pushStateHistory } = getHistoryHandle<CastMember>("CastMember");

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
  const change = damageCastMemberTempHpChange(castMember, amount);
  if (!change) {
    return castMember;
  }
  pushStateHistory(change);
  castMemberDoSomething(
    castMember,
    `takes ${
      castMember.hpTemp - change.newValue!
    } ${type} damage from temporary Hit Points`
  );
  return applyHistoryEntry(change, castMember);
};

export function damageCastMemberTempHpChange(
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

/**
 * Potentially push a StateChange of hpTemp first, then hpCurrent.
 */
export const damageCastMember: ChangeState<CastMember> = (
  castMember,
  amount: number,
  type: DamageType
) => {
  const changes = damageCastMemberChange(castMember, amount, type);
  changes.forEach((change) => pushStateHistory(change));
  if (changes.length === 2) {
    castMemberDoSomething(
      castMember,
      `takes ${
        castMember.hpTemp - changes[0].newValue!
      } ${type} damage from temporary Hit Points`
    );
  }
  const actualDamageChange = changes[changes.length - 1];
  const actualDamage = actualDamageChange
    ? actualDamageChange.oldValue! - actualDamageChange.newValue!
    : 0;
  castMemberDoSomething(castMember, `takes ${actualDamage} ${type} damage`);
  return changes.reduce(
    (castMember, change) => applyHistoryEntry(change, castMember),
    castMember
  );
};

export function damageCastMemberChange(
  castMember: CastMember,
  amount: number,
  type: DamageType
): StateChange<CastMember, "hpTemp" | "hpCurrent">[] {
  const changes: StateChange<CastMember, "hpTemp" | "hpCurrent">[] = [];
  const actualAmount = damageToRelativeDamage(castMember, amount, type);
  const tmpChange = damageCastMemberTempHpChange(castMember, actualAmount);
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
