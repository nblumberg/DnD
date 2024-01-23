import { AttackType, DamageType } from "./attack";

interface Attack {
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

interface Cost {
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
}

export interface ActionParams {
  name: string;
  description?: string;
  attack?: Attack;
  cost?: Partial<Cost>;
}

export interface Action extends ActionParams {
  cost?: Cost;
}

export function actionParamsToAction(params: ActionParams): Action {
  const action = { ...params } as Action;
  if (params.cost) {
    action.cost = {
      ...params.cost,
      available: params.cost.available ?? true,
    } as Cost;
  }
  return action;
}
