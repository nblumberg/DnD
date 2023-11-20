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

export interface Action {
  name: string;
  description?: string;
  attack?: {
    type: "melee" | "ranged" | "melee or ranged";
    weapon?: true;
    toHit: {
      modifier: number;
      target?: string;
      reach?: number;
      range?: number | [number, number];
    };
    onHit?: {
      amount: string;
      type: DamageType;
      effect?: string;
    };
  };
  cost?: string;
}
