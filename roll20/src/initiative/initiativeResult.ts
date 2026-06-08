import { Id } from "../builtIns";
import { debug } from "./debug";
import { getCharacterInitiative } from "./getCharacterInitiative";
import { rollSingleInitiative } from "./rollSingleInitiative";

export interface InitiativeResult {
  bonus: number;
  dex: number;
  graphic: Graphic;
  id: Id;
  summonOf?: string;
  roll: number;
}

export function tokenIdToResult(
  tokenId: Id,
  existingRoll?: number
): InitiativeResult | undefined {
  const graphic = getObj("graphic", tokenId);
  if (!graphic) {
    debug(`Couldn't find graphic for token ${tokenId}`);
    return;
  }
  const { bonus, dex } = getCharacterInitiative(graphic);
  const roll = existingRoll ?? rollSingleInitiative(bonus);
  return { bonus, dex, graphic, id: tokenId, roll };
}
