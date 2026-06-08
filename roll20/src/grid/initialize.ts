import { getPlayerName } from "../players";
import { getCurrentPageId, startUp } from "../utilities";
import { GRID_API_KEY, GRID_API_PREFIX } from "./constants";
import { createGridLabels } from "./createGridLabels";
import { debug } from "./debug";

function onChatMessage(msg: ChatMessage): void {
  if (msg.type !== "api" || !msg.content.startsWith(GRID_API_KEY)) {
    return;
  }
  const pageId = getCurrentPageId();
  const page = getObj("page", pageId);
  if (!page) {
    sendChat(
      GRID_API_PREFIX,
      `/w ${getPlayerName(msg.playerid)} No active page found.`
    );
    return;
  }
  createGridLabels(pageId, page.get("width"), page.get("height"));
}

on("ready", () => {
  startUp(GRID_API_KEY, debug);
});

on("chat:message", onChatMessage);
