import { ClassMembers } from "serializable";
import { Action, ActionParams } from ".";

export const DamageTypes = [
  "bludgeoning",
  "piercing",
  "slashing",
  "acid",
  "fire",
  "force",
  "lightning",
  "necrotic",
  "radiant",
  "thunder",
] as const;

export type DamageType = (typeof DamageTypes)[number];

export type AttackType = "melee" | "ranged" | "melee or ranged";

export class Attack extends Action {
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

  constructor(params: ActionParams) {
    super(params);
    const { attack } = params;
    if (!attack) {
      throw new Error(
        `ActionParams for ${this.name} do not describe an Attack`
      );
    }
    this.type = attack.type;
    if (attack.weapon) {
      this.weapon = true;
    }
    this.toHit = { ...attack.toHit };
    if (attack.onHit) {
      this.onHit = { ...attack.onHit };
    }
  }
}

export type AttackRaw = ClassMembers<Attack>;
