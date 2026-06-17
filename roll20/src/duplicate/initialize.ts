import { getPlayerName } from "../players";
import { startUp } from "../utilities";
import { DUPLICATE_API_KEY, DUPLICATE_API_PREFIX } from "./constants";
import { debug } from "./debug";
import { duplicateCharacter } from "./duplicateCharacter";
import { duplicateGraphic } from "./duplicateGraphic";
import { generateNames } from "./generateNames";
import { addDuplicatesToFolder } from "./journalFolder";
import { parseArgs } from "./parseArgs";

function onChatMessage(msg: ChatMessage): void {
  if (msg.type !== "api" || !msg.content.startsWith(DUPLICATE_API_KEY)) {
    return;
  }
  if (!playerIsGM(msg.playerid)) {
    sendChat(
      DUPLICATE_API_PREFIX,
      `/w ${getPlayerName(msg.playerid)} Only the GM can use ${DUPLICATE_API_KEY}.`
    );
    return;
  }

  const selected = msg.selected ?? [];
  if (selected.length !== 1) {
    sendChat(
      DUPLICATE_API_PREFIX,
      `/w gm ${DUPLICATE_API_KEY} requires exactly one selected token.`
    );
    return;
  }

  const graphic = getObj("graphic", selected[0]._id);
  if (!graphic) {
    sendChat(DUPLICATE_API_PREFIX, `/w gm Could not find the selected token.`);
    return;
  }

  const characterId = graphic.get("represents");
  if (!characterId) {
    sendChat(
      DUPLICATE_API_PREFIX,
      `/w gm The selected token does not represent a character.`
    );
    return;
  }

  const original = getObj("character", characterId);
  if (!original) {
    sendChat(
      DUPLICATE_API_PREFIX,
      `/w gm Could not find the character represented by the selected token.`
    );
    return;
  }

  const { count, names } = parseArgs(msg.content, DUPLICATE_API_KEY);
  if (count < 1) {
    sendChat(
      DUPLICATE_API_PREFIX,
      `/w gm The count must be a positive integer.`
    );
    return;
  }

  const originalName = original.get("name");
  debug(`Duplicating "${originalName}" ${count} time(s)`);

  const allNames = generateNames(originalName, count, names);
  const duplicates = allNames.map((name, index) => {
    const dupChar = duplicateCharacter(original, name);
    duplicateGraphic(graphic, dupChar, index);
    return dupChar;
  });

  addDuplicatesToFolder(
    original.id,
    duplicates.map((d) => d.id),
    debug
  );

  const nameList = duplicates.map((d) => d.get("name")).join(", ");
  sendChat(
    DUPLICATE_API_PREFIX,
    `/w gm Created ${duplicates.length} duplicate(s) of "${originalName}": ${nameList}`
  );
}

on("ready", () => {
  startUp(DUPLICATE_API_KEY, debug);
});

on("chat:message", onChatMessage);
