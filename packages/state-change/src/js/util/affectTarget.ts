import { AttackEffect, CastMember, SpellEffect, idCastMember } from "creature";
import { RollHistory } from "roll";
import { addConditionChange } from "../atomic/addCondition";
import { StateChange } from "../atomic/stateChange";

export function affectTarget(
  attacker: CastMember,
  target: CastMember,
  effect: AttackEffect | SpellEffect,
  targetSave?: RollHistory,
  log?: (message: string) => void
): StateChange<CastMember, keyof CastMember>[] {
  const { condition, dc, dcType, description, duration } = {
    dc: Infinity,
    dcType: undefined,
    ...effect,
  };
  if (!condition) {
    console.warn(`effect ${description} has no condition`);
    return [];
  }
  const targetName = idCastMember(target);
  const onSave = dc && dcType ? { dc, dcType } : undefined;
  if (onSave) {
    if (!targetSave) {
      throw new Error(
        `Expected ${targetName}'s saving throw for ${description}`
      );
    }
    if (targetSave.total >= dc) {
      if (log) {
        log(`does not affect ${targetName} who saves against ${condition}`);
      }
      return [];
    }
    if (log) {
      log(`affects ${targetName} who fails to save against ${condition}`);
    }
  } else {
    if (log) {
      log(`affects ${targetName} with ${condition}`);
    }
  }
  let onTurnStart: string | undefined;
  if (effect.onTurnStart) {
    if (effect.onTurnStart === "attacker") {
      onTurnStart = attacker.id;
    } else {
      onTurnStart = target.id;
    }
  }
  let onTurnEnd: string | undefined;
  if (effect.onTurnEnd) {
    if (effect.onTurnEnd === "attacker") {
      onTurnStart = attacker.id;
    } else {
      onTurnStart = target.id;
    }
  }
  const change = addConditionChange(target, {
    condition,
    onSave,
    duration,
    onTurnStart,
    onTurnEnd,
    source: attacker.id,
  });
  return [change];
}
