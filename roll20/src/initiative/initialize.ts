import { getPlayerName } from "../players";
import { startUp } from "../utilities";
import { INITIATIVE_API_KEY, INITIATIVE_API_PREFIX } from "./constants";
import { debug } from "./debug";
import { rollGroupInitiative } from "./rollGroupInitiative";

function onChatMessage(msg: ChatMessage): void {
  if (msg.type !== "api" || !msg.content.startsWith(INITIATIVE_API_KEY)) {
    return;
  }
  if (!playerIsGM(msg.playerid)) {
    sendChat(
      INITIATIVE_API_PREFIX,
      `/w ${getPlayerName(msg.playerid)} Only the GM can roll initiative with !initiative.`
    );
    return;
  }

  const selected = msg.selected ?? [];
  if (!selected || selected.length === 0) {
    sendChat(
      INITIATIVE_API_PREFIX,
      `/w ${getPlayerName(msg.playerid)} Select one or more tokens before using !initiative.`
    );
    return;
  }

  const graphicIds = selected.map(({ _id: id }) => id);
  debug(`Selected token IDs: ${graphicIds.join(", ")}`);
  const graphics = graphicIds
    .map((id) => {
      const graphic = getObj("graphic", id);
      if (!graphic) {
        debug(`Couldn't find graphic for token ${id}`);
      }
      return graphic;
    })
    .filter((graphic): graphic is Graphic => !!graphic);

  const results = rollGroupInitiative(graphics);
  if (results.length === 0) {
    sendChat(
      INITIATIVE_API_PREFIX,
      `/w ${getPlayerName(msg.playerid)} No valid tokens found in selection.`
    );
    return;
  }
}

on("ready", () => {
  startUp(INITIATIVE_API_KEY, debug);
});

on("chat:message", onChatMessage);
