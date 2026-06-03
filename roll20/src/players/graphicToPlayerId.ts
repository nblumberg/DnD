import type { Id } from "../builtIns";
import { extractProperties } from "../utilities";
import { getGMId } from "./gm";
import { getPC } from "./pcs";

/**
 *
 * @param {Graphic} token
 * @returns {string} The player (or the GM if no players) ID controlling the Token
 */
export function graphicToPlayerId(token: Graphic): Id | undefined {
  const { controlledby, represents } = extractProperties(token, "controlledby", "represents");
  const gmId = getGMId();
  if (!controlledby) {
    if (!represents) {
      return gmId;
    }
    const pc = getPC(represents);
    if (pc) {
      const playerId = pc.get("controlledby");
      if (playerId) {
          return playerId;
      }
    }
  }
  const controllingIds = controlledby.split(",");
  if (controllingIds.length === 0) {
    return gmId;
  }
  if (controllingIds.length === 1) {
    return controllingIds[0];
  }
  const playerId = controllingIds.find(
    (controllingId) => controllingId !== "all" && controllingId !== gmId
  );
  return playerId;
}
