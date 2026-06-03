// ===========================
// !pingMe API
// !pingTarget API
// Support !pingMe and !pingTarget chat commands to center the activating player's screen on one of the player's tokens
// ===========================

import type { ChatMessage, Id } from "./builtIns";
import { getPCs, getPlayerName, isControlledBy } from "./players";
import { centerScreen, getCurrentPageId } from "./utilities";

const PING_ME_API_KEY = "!pingMe";
const PING_TARGET_API_KEY = "!pingTarget";

function onChatMessage(chatMessage: ChatMessage) {
    const { type, content } = chatMessage;
  if (type !== "api") {
    return;
  }
  if (content.startsWith(PING_ME_API_KEY)) {
    onPingMe(chatMessage);
  } else if (content.startsWith(PING_TARGET_API_KEY)) {
    onPingTarget(chatMessage);
  }
}

function onPingMe({ playerid }: ChatMessage) {
  // TODO: should this expand to include all characters?
  const characterIds = getPCs()
    .filter((pc) => isControlledBy(pc, playerid))
    .map((character) => character.get("id"));
  const tokens = findObjs<Graphic>({
    type: "graphic",
    subtype: "token",
    layer: "objects",
    pageid: getCurrentPageId(),
  }).filter((token) => {
    const represents = token.get("represents");
    if (characterIds.some((characterId) => represents === characterId)) {
      return true;
    }
    return isControlledBy(token, playerid);
  });
  const playerName = getPlayerName(playerid);
  if (tokens.length === 1) {
    const [target] = tokens;
    pingTarget(target.get("id"), playerid, playerName);
  } else {
    const buttons = tokens.reduce((previous, target) => {
      return `${previous}<a href="!pingTarget|${target.get("id")}|${playerid}|${playerName}">${target.get(
        "name"
      )}</a>`;
    }, "Which character?<br/>");
    chatMessage(playerName, `/direct ${buttons}`);
  }
}

function onPingTarget({ content }: ChatMessage) {
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
 * API talks back to the player (token choice UI or error feedback)
 * @param {string} playerName
 * @param {string} message
 */
function chatMessage(playerName: string, message: string) {
  sendChat("PingMeAPI", `/w ${playerName} ${message}`);
}

/**
 * API calls second-stage API to center the player's screen on the given token
 * @param {Id} targetId
 * @param {Id} playerId
 * @param {string} playerName
 */
function pingTarget(targetId: Id, playerId: Id, playerName: string) {
  sendChat("PingTargetAPI", `!pingTarget ${targetId} ${playerId} ${playerName}`);
}

on("ready", () => {
  log("Starting up !pingMe API");
});

on("chat:message", onChatMessage);
