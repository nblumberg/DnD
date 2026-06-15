import { Id } from "../builtIns";

export interface CheckResult {
  bonus: number;
  graphic: Graphic;
  id: Id;
  roll: number;
  success?: boolean;
}

export function tokenToResult(
  graphic: Graphic,
  attribute: keyof Character,
  dc?: number
): CheckResult {
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
    id: graphic.id,
    roll,
    success: dc !== undefined ? roll >= dc : undefined,
  };
}
