import { getPlayerName, isControlledBy } from "../players";
import { startUp } from "../utilities";
import { TRACK_API_KEY } from "./constants";
import { debug } from "./debug";
import { drawTrackPath } from "./drawTrackPath";
import { findGraphic } from "./findGraphic";
import { rollSurvivalAndDraw } from "./rollSurvivalAndDraw";

function onChatMessage(msg: ChatMessage): void {
  if (msg.type !== "api" || !msg.content.startsWith(TRACK_API_KEY)) {
    return;
  }
  const { content, playerid, selected = [] } = msg;
  const nameOrId = content.slice(TRACK_API_KEY.length).trim();
  let graphic: Graphic | undefined;
  if (nameOrId) {
    graphic = findGraphic(nameOrId);
    if (!graphic) {
      sendChat(
        "TrackAPI",
        `/w ${getPlayerName(playerid)} Could not find token or character: ${nameOrId}`
      );
      return;
    }
  } else {
    if (selected.length !== 1) {
      sendChat(
        "TrackAPI",
        `/w ${getPlayerName(playerid)} Usage: !track <token or character name or id>, or select exactly one token`
      );
      return;
    }
    graphic = getObj("graphic", selected[0]._id);
    if (!graphic) {
      sendChat(
        "TrackAPI",
        `/w ${getPlayerName(playerid)} Could not find the selected token`
      );
      return;
    }
  }

  if (playerIsGM(playerid) || isControlledBy(graphic, playerid)) {
    drawTrackPath(graphic, playerid);
  } else {
    rollSurvivalAndDraw(graphic, playerid);
  }
}

on("ready", () => {
  startUp(TRACK_API_KEY, debug);
});

on("chat:message", onChatMessage);
