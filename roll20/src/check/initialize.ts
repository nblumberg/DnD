import { getPlayerName } from "../players";
import { startUp } from "../utilities";
import {
  ABILITY_TYPES,
  CHECK_API_KEY,
  CHECK_API_PREFIX,
  CHECK_TYPES,
  SAVE_TYPES,
  SKILL_TYPES,
} from "./constants";
import { debug } from "./debug";
import { rollGroupCheck } from "./rollGroupCheck";

function onChatMessage(msg: ChatMessage): void {
  if (msg.type !== "api" || !msg.content.startsWith(CHECK_API_KEY)) {
    return;
  }
  if (!playerIsGM(msg.playerid)) {
    sendChat(
      CHECK_API_PREFIX,
      `/w ${getPlayerName(msg.playerid)} Only the GM can make group checks with ${CHECK_API_KEY}.`
    );
    return;
  }

  const selected = msg.selected ?? [];
  if (selected.length === 0) {
    sendChat(
      CHECK_API_PREFIX,
      `/w ${getPlayerName(msg.playerid)} Select one or more tokens before using ${CHECK_API_KEY}.`
    );
    return;
  }

  const [, type, subtype, dcString] = msg.content.toLowerCase().split(/\s+/);
  if (!type || !CHECK_TYPES.includes(type)) {
    sendChat(
      CHECK_API_PREFIX,
      `/w ${getPlayerName(msg.playerid)} The first argument to ${CHECK_API_KEY} must be one of ${CHECK_TYPES.join(", ")}.`
    );
    return;
  }

  const allowedSubtypes =
    type === "skill"
      ? SKILL_TYPES
      : type === "ability"
        ? ABILITY_TYPES
        : SAVE_TYPES;
  const allowedSubtypeValues = Object.keys(allowedSubtypes);
  if (!subtype || !allowedSubtypeValues.includes(subtype)) {
    sendChat(
      CHECK_API_PREFIX,
      `/w ${getPlayerName(msg.playerid)} The second argument to ${CHECK_API_KEY} must be one of ${allowedSubtypeValues.join(", ")}.`
    );
    return;
  }

  const dc = dcString?.trim() ? parseInt(dcString, 10) : undefined;
  if (dc !== undefined && (Number.isNaN(dc) || dc <= 0)) {
    sendChat(
      CHECK_API_PREFIX,
      `/w ${getPlayerName(msg.playerid)} The optional third argument to ${CHECK_API_KEY} must be a positive integer.`
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

  const [displayName, attribute] = allowedSubtypes[subtype];

  const results = rollGroupCheck({
    attribute,
    dc,
    displayName,
    tokens: graphics,
  });
  if (results.length === 0) {
    sendChat(
      CHECK_API_PREFIX,
      `/w ${getPlayerName(msg.playerid)} No valid tokens found in selection.`
    );
    return;
  }
}

on("ready", () => {
  startUp(CHECK_API_KEY, debug);
});

on("chat:message", onChatMessage);
