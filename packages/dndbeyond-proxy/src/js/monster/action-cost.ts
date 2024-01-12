import { ActionParams } from "creature";
import { parseRegExpGroups } from "../utils";

const perDayRegExp = /(?<perDay>\d+)\/Day/;
const rechargeRegExp = /Recharge (?<recharge>\d+)/;
const legendaryRegExp = /Costs (?<legendary>\d+) Actions/;

export function parseCost(cost: string, type: string) : ActionParams["cost"] | { nameSuffix: string; } {
  const { perDay } = parseRegExpGroups("TODO", perDayRegExp, cost, true);
  if (perDay) {
    return {
      available: true,
      perDay: {
        used: 0,
        total: parseInt(perDay, 10)
      }
    };
  }
  const { recharge } = parseRegExpGroups("TODO", rechargeRegExp, cost, true);
  if (recharge) {
    return {
      available: true,
      recharge: {
        min: parseInt(recharge, 10),
        die: 6, // TODO: are all recharges 1d6?
      }
    };
  }
  const { legendary } = parseRegExpGroups("TODO", legendaryRegExp, cost, true);
  if (legendary || type === "Legendary Actions" || type === "Mythic Actions") {
    return {
      available: true,
      legendary: {
        actions: parseInt(legendary ?? "1", 10),
        pool: 3, // TODO: are all legenday actions a pool of 3?
      }
    };
  }

  return { nameSuffix: ` (${cost})` };
}
