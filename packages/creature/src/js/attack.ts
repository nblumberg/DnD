import { Action, ActionParams } from ".";
import { actionParamsToAction } from "./action";

export const DamageTypes = [
  "bludgeoning",
  "piercing",
  "slashing",
  "acid",
  "cold",
  "fire",
  "force",
  "lightning",
  "necrotic",
  "radiant",
  "thunder",
] as const;

export const Effects = ["bleeding", "hasted", "slowed"] as const;
export type Effect = (typeof Effects)[number];

export type DamageType = (typeof DamageTypes)[number];

export type AttackType = "melee" | "ranged" | "melee or ranged";

export interface Attack extends Action {
  type: AttackType;
  weapon?: true;
  toHit: {
    modifier: number | "∞";
    target?: string;
    reach?: number | "∞";
    range?: number | [number, number];
  };
  onHit?: {
    amount: string;
    type: DamageType;
    effect?: string;
  };
}

export function actionParamsToAttack(params: ActionParams): Attack {
  const action = actionParamsToAction(params) as Attack;
  const { attack } = params;
  if (!attack) {
    throw new Error(
      `ActionParams for ${action.name} do not describe an Attack`
    );
  }
  action.type = attack.type;
  if (attack.weapon) {
    action.weapon = true;
  }
  action.toHit = { ...attack.toHit };
  if (attack.onHit) {
    action.onHit = { ...attack.onHit };
  }
  return action;
}
