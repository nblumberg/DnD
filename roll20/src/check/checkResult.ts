import { Id } from "../builtIns";
import { debug } from "./debug";

export interface CheckResult {
  bonus: number;
  graphic: Graphic;
  id: Id;
  roll: number;
  success?: boolean;
}

export function tokenIdToResult(
  tokenId: Id,
  attribute: keyof Character,
  dc?: number
): CheckResult | undefined {
  const graphic = getObj("graphic", tokenId);
  if (!graphic) {
    debug(`Couldn't find graphic for token ${tokenId}`);
    return;
  }
  const characterId = graphic.get("represents");
  let bonus = 0;
  if (characterId) {
    const attributeString = `${getAttrByName(characterId, attribute)}` || "0";
    bonus = parseInt(attributeString, 10) || 0;
  }
  const roll = randomInteger(20) + bonus;
  return {
    bonus,
    graphic,
    id: tokenId,
    roll,
    success: dc !== undefined ? roll >= dc : undefined,
  };
}
