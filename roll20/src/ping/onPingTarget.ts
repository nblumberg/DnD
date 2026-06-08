import { Id } from "../builtIns";
import { centerScreen, getCurrentPageId } from "../utilities";
import { chatMessage } from "./chatMessage";

export function onPingTarget({ content }: ChatMessage) {
  const pageid = getCurrentPageId();
  const [, id, playerId, playerName] = content.split("|");
  const graphic = [
    ...findObjs<Graphic>({
      type: "graphic",
      subtype: "token",
      represents: id,
      pageid,
    }),
    getObj("graphic", id),
  ][0];
  if (!graphic) {
    chatMessage(playerName, "That character is not on the map.");
    return;
  }
  centerScreen(graphic, playerId);
}

/**
 * API calls second-stage API to center the player's screen on the given token
 * @param {Id} targetId
 * @param {Id} playerId
 * @param {string} playerName
 */
export function pingTarget(targetId: Id, playerId: Id, playerName: string) {
  sendChat(
    "PingTargetAPI",
    `!pingTarget ${targetId} ${playerId} ${playerName}`
  );
}
