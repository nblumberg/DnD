import { startUp } from "../utilities";
import { PING_ME_API_KEY, PING_TARGET_API_KEY } from "./constants";
import { debug } from "./debug";
import { onPingMe } from "./onPingMe";
import { onPingTarget } from "./onPingTarget";

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

on("ready", () => {
  startUp(PING_ME_API_KEY, debug);
  startUp(PING_TARGET_API_KEY, debug);
});

on("chat:message", onChatMessage);
