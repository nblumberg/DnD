import { getPCs, getPlayerName, isControlledBy } from "../players";
import { getCurrentPageId } from "../utilities";
import { chatMessage } from "./chatMessage";
import { pingTarget } from "./onPingTarget";

export function onPingMe({ playerid }: ChatMessage) {
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
