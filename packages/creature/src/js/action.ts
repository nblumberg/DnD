import { ClassMembers } from "packages/serializable/dist/js";
import { AttackType, DamageType } from "./attack";

export interface ActionParams {
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
    onHit?: {
      amount: string;
      type: DamageType;
      effect?: string;
    };
  };
  cost?: {
    available: boolean;
    perDay?: {
      used: number;
      total: number;
    };
    recharge?: {
      min: number;
      die: number;
    };
    legendary?: {
      actions: number;
      pool: number;
    };
    lair?: true;
  };
}

export class Action implements ActionParams {
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
    onHit?: {
      amount: string;
      type: DamageType;
      effect?: string;
    };
  };
  cost?: {
    available: boolean;
    perDay?: {
      used: number;
      total: number;
    };
    recharge?: {
      min: number;
      die: number;
    };
    legendary?: {
      actions: number;
      pool: number;
    };
    lair?: true;
  };

  constructor(params: ActionParams) {
    this.name = params.name;
    this.description = params.description;
    if (params.cost) {
      this.cost = {
        available: true,
      };
      if (params.cost.perDay) {
        this.cost.perDay = { ...params.cost.perDay };
      } else if (params.cost.recharge) {
        this.cost.recharge = { ...params.cost.recharge };
      } else if (params.cost.legendary) {
        this.cost.legendary = { ...params.cost.legendary };
      } else if (params.cost.lair) {
        this.cost.lair = true;
      }
    }
  }
}

export type ActionRaw = ClassMembers<Action>;
