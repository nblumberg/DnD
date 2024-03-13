import {
  CastMember,
  Damage,
  castMemberDoSomething,
  idCastMember,
} from "creature";
import { RollHistory } from "roll";
import { StateChange } from "../change";
import { damageTarget } from "./damageTarget";

export function attackTarget(
  attacker: CastMember,
  attackName: string,
  toHit: RollHistory,
  damageRolls: RollHistory[],
  damageTypes: Damage[],
  target: CastMember
): { hit: boolean; changes: StateChange<CastMember, keyof CastMember>[] } {
  if (damageRolls.length !== damageTypes.length) {
    throw new Error(
      `Expected ${damageRolls.length} damage rolls, got ${damageTypes.length}`
    );
  }

  const targetName = idCastMember(target);
  const output = `'s ${attackName} `;
  if (toHit.total < target.ac) {
    castMemberDoSomething(attacker, `${output}misses ${targetName}`);
    return { hit: false, changes: [] };
  }

  const changes = damageTarget(target, damageRolls, damageTypes, (message) => {
    castMemberDoSomething(attacker, `${output}${message}`);
  });

  return { hit: true, changes };
}
