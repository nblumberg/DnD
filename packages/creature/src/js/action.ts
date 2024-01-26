import { Attack } from "./attack";

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
