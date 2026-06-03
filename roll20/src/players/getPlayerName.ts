import type { Id } from "../builtIns";
import { getPlayer } from "./players";

/**
 *
 * @param {string} playerId
 * @returns The Player's displayname or "unknown" if the Player is not recognized
 */
export function getPlayerName(playerId: Id): string {
  const player = getPlayer(playerId);
  if (!player) {
    return "unknown";
  }
  return player.get("displayname");
}
