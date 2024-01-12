export type DamageType =
  | "bludgeoning"
  | "piercing"
  | "slashing"
  | "acid"
  | "fire"
  | "force"
  | "lightning"
  | "necrotic"
  | "radiant"
  | "thunder";

export type AttackType = "melee" | "ranged" | "melee or ranged";

export interface OnHit {
  amount: string;
  type: DamageType;
  effect?: string;
}

export interface Action {
  name: string;
  description?: string;
  attack?: {
    type: AttackType;
    weapon?: true;
    toHit: {
      modifier: number | "∞";
      target?: string;
      reach?: number | "∞";
      range?: number | [number, number];
    };
    onHit?: OnHit;
  };
  cost?: string;
}
