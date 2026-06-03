import type { Id } from "../builtIns";
import { getPC } from "./pcs";

/**
 *
 * @param {string} characterId
 * @returns The Character's name or "unknown" if the Character is not recognized
 */
export function getPCName(characterId: Id): string {
  const pc = getPC(characterId);
  if (!pc) {
    return "unknown";
  }
  return pc.get("name");
}
