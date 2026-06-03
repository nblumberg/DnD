import type { ControlledObject, Id } from "../builtIns";

/**
 * Checks whether the given player can control the APIObject
 * @param {Character | Graphic} apiObject
 * @param {Player | string} player
 * @returns {boolean}
 */
export function isControlledBy(apiObject: Character | Graphic, player: Player | Id): boolean {
  const playerId = typeof player === "string" ? player : player.get("id");
  return ((apiObject as ControlledObject).get("controlledby") ?? "").split(",").includes(playerId);
}
