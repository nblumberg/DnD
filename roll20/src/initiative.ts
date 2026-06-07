import type { ChatMessage } from "./builtIns";
import { getPlayerName } from "./players";
import { getCurrentPageId } from "./utilities";

// ===========================
// !initiative API
// Rolls initiative for all selected tokens, populates the Turn Order, and outputs results to chat
// ===========================

const INITIATIVE_API_KEY = "!initiative";

interface TurnOrderEntry {
  id: string;
  pr: number;
  custom: string;
  formula: string;
}

function getCharacterStats(graphic: Graphic): { bonus: number; dex: number } {
  const characterId = graphic.get("represents");
  if (!characterId) {
    return { bonus: 0, dex: 0 };
  }
  const bonus = parseInt(getAttrByName(characterId, "initiative_bonus") ?? "0", 10) || 0;
  const dex = parseInt(getAttrByName(characterId, "dexterity") ?? "0", 10) || 0;
  return { bonus, dex };
}

function rollInitiative(bonus: number): number {
  return randomInteger(20) + bonus;
}

function onChatMessage(msg: ChatMessage): void {
  if (msg.type !== "api" || !msg.content.startsWith(INITIATIVE_API_KEY)) {
    return;
  }
  if (!playerIsGM(msg.playerid)) {
    sendChat("InitiativeAPI", `/w ${getPlayerName(msg.playerid)} Only the GM can roll initiative with !initiative.`);
    return;
  }

  const selected = msg.selected ?? [];
  if (!selected || selected.length === 0) {
    sendChat("InitiativeAPI", `/w ${getPlayerName(msg.playerid)} Select one or more tokens before using !initiative.`);
    return;
  }

  const results: Array<{ graphic: Graphic; roll: number; bonus: number; dex: number }> = [];
  for (const token of selected) {
    const graphic = getObj("graphic", token.id);
    if (!graphic) {
      continue;
    }
    const { bonus, dex } = getCharacterStats(graphic);
    const roll = rollInitiative(bonus);
    results.push({ graphic, roll, bonus, dex });
  }

  if (results.length === 0) {
    sendChat("InitiativeAPI", `/w ${getPlayerName(msg.playerid)} No valid tokens found in selection.`);
    return;
  }

  // Sort descending by roll, then by dexterity score as tiebreaker
  results.sort((a, b) => b.roll - a.roll || b.dex - a.dex);

  const pageId = getCurrentPageId();
  const turnOrder: TurnOrderEntry[] = results.map(({ graphic, roll }) => ({
    id: graphic.get("id"),
    pr: roll,
    custom: "",
    formula: "",
  }));

  Campaign().set("turnorder", JSON.stringify(turnOrder));
  Campaign().set("initiativepage", pageId);

  const lines = results.map(
    ({ graphic, roll, bonus }) =>
      `${graphic.get("name")}: ${roll} (d20${bonus >= 0 ? "+" : ""}${bonus})`
  );
  sendChat("InitiativeAPI", `&{template:default} {{name=Initiative}} {{${lines.join("}} {{")}}}`);
}

on("ready", () => {
  log("Starting up !initiative API");
});

on("chat:message", onChatMessage);
