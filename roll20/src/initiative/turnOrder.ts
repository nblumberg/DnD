import { getCurrentPageId } from "../utilities";
import { debug } from "./debug";

export function getTurnOrder(): TurnOrder {
  const existingTurnOrderJson = Campaign().get("turnorder") || "[]";
  debug(`Existing turn order JSON: ${existingTurnOrderJson}`);
  try {
    return JSON.parse(existingTurnOrderJson);
  } catch (e) {
    debug(`Error parsing existing turn order JSON: ${e}`);
  }
  return [];
}

export function setTurnOrder(turnOrder: TurnOrder): void {
  const pageId = getCurrentPageId();
  const turnOrderJson = JSON.stringify(turnOrder);
  debug(
    `Setting initiative page to ${pageId} and turn order to ${turnOrderJson}`
  );
  Campaign().set({
    initiativepage: pageId,
    turnorder: turnOrderJson,
  });
}
