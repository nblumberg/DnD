import { CastMember, Damage, idCastMember } from "creature";
import { Roll, RollHistory } from "roll";
import { damageCastMemberChange } from "../atomic/damageCastMember";
import { StateChange } from "../atomic/stateChange";

export function damageTarget(
  target: CastMember,
  damageRolls: RollHistory[],
  damageTypes: Damage[],
  log?: (message: string) => void
): StateChange<CastMember, keyof CastMember>[] {
  const changes: StateChange<CastMember, keyof CastMember>[] = [];
  if (damageRolls.length !== damageTypes.length) {
    throw new Error(
      `Expected ${damageRolls.length} damage rolls, got ${damageTypes.length}`
    );
  }
  damageRolls.forEach((roll, i) => {
    const maxDamage = new Roll(damageTypes[i].amount).max();
    if (roll.total > maxDamage) {
      console.warn(`Max damage is ${maxDamage}, got ${roll.total}`);
    }

    const damageType = damageTypes[i].type;
    const damageChanges = damageCastMemberChange(
      target,
      roll.total,
      damageType
    );
    changes.push(...damageChanges);
    const tmpDamage =
      damageChanges.length === 2
        ? damageChanges[0]!.oldValue! - damageChanges[0]!.newValue!
        : 0;
    const damageIndex = damageChanges.length === 2 ? 1 : 0;
    const realDamage =
      damageChanges[damageIndex]!.oldValue! -
      damageChanges[damageIndex]!.newValue!;
    if (log) {
      log(
        `hits ${idCastMember(target)} for ${
          tmpDamage ? `${tmpDamage} temporary hit point damage and ` : ""
        }${realDamage} ${damageType} damage`
      );
    }
  });

  return changes;
}
