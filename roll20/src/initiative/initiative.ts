// import type { ChatMessage, Id } from "../builtIns";
// import { getPlayerName } from "../players";
// import { getCurrentPageId } from "../utilities";

// // ===========================
// // !initiative API
// // Rolls initiative for all selected tokens, populates the Turn Order, and outputs results to chat
// // ===========================

// interface InitiativeResult {
//   bonus: number;
//   dex: number;
//   graphic: Graphic;
//   id: Id;
//   isFamiliar?: boolean;
//   roll: number;
// }

// const INITIATIVE_API_KEY = "!initiative";
// const INITIATIVE_API_PREFIX = "InitiativeAPI: ";

// function debug(...args: unknown[]): void {
//   log(`${INITIATIVE_API_PREFIX} ${args.map(String).join(" ")}`);
// }

// function getCharacterInitiative(graphic: Graphic): {
//   bonus: number;
//   dex: number;
// } {
//   const characterId = graphic.get("represents");
//   if (!characterId) {
//     return { bonus: 0, dex: 0 };
//   }
//   const bonus =
//     parseInt(getAttrByName(characterId, "initiative_bonus") ?? "0", 10) || 0;
//   const dex = parseInt(getAttrByName(characterId, "dexterity") ?? "0", 10) || 0;
//   return { bonus, dex };
// }

// function rollSingleInitiative(bonus: number): number {
//   return randomInteger(20) + bonus;
// }

// function getTurnOrder(): TurnOrder {
//   const existingTurnOrderJson = Campaign().get("turnorder") || "[]";
//   debug(`Existing turn order JSON: ${existingTurnOrderJson}`);
//   try {
//     return JSON.parse(existingTurnOrderJson);
//   } catch (e) {
//     debug(`Error parsing existing turn order JSON: ${e}`);
//   }
//   return [];
// }

// function setTurnOrder(turnOrder: TurnOrder): void {
//   const pageId = getCurrentPageId();
//   const turnOrderJson = JSON.stringify(turnOrder);
//   debug(
//     `Setting initiative page to ${pageId} and turn order to ${turnOrderJson}`
//   );
//   Campaign().set({
//     initiativepage: pageId,
//     turnorder: turnOrderJson,
//   });
// }

// function tokenIdToResult(
//   tokenId: Id,
//   existingRoll?: number
// ): InitiativeResult | undefined {
//   const graphic = getObj("graphic", tokenId);
//   if (!graphic) {
//     debug(`Couldn't find graphic for token ${tokenId}`);
//     return;
//   }
//   const { bonus, dex } = getCharacterInitiative(graphic);
//   const roll = existingRoll ?? rollSingleInitiative(bonus);
//   return { bonus, dex, graphic, id: tokenId, roll };
// }

// function trackFamiliars(
//   familiarMap: Record<Id, InitiativeResult[]>,
//   result: InitiativeResult
// ): void {
//   const graphicId = result.graphic.get("id");
//   const familiarOfName = getAttrByName(graphicId, "familiarOf");
//   if (familiarOfName) {
//     const familiarOf = getObj("character", familiarOfName)?.get("id");
//     if (familiarOf) {
//       if (!familiarMap[familiarOf]) {
//         familiarMap[familiarOf] = [];
//       }
//       familiarMap[familiarOf].push(result);
//       result.isFamiliar = true;
//       debug(
//         `Tracking ${result.graphic.get("name")}'s initiative to match ${
//           familiarOfName
//         }'s initiative`
//       );
//     }
//   }
// }

// function rollGroupInitiative(tokens: Graphic[]): InitiativeResult[] {
//   debug(`Rolling initiative for ${tokens.length} selected tokens`);

//   // Collect information about each token and its initiative result,
//   // and also track familiars so that we can set their initiative to match their masters after we roll everything
//   const results: InitiativeResult[] = [];
//   // Track results by token ID so that we can easily look up a token's initiative result when we're setting familiar initiative to match their masters
//   const resultsMap: Map<Id, InitiativeResult> = new Map();
//   // Track familiars so that we can set their initiative to match their masters after we roll everything
//   const familiarMap: Record<Id, InitiativeResult[]> = {};
//   for (const token of tokens) {
//     const result = tokenIdToResult(token.id);
//     if (!result) {
//       continue;
//     }
//     results.push(result);
//     resultsMap.set(result.id, result);
//     trackFamiliars(familiarMap, result);
//   }

//   const existingTurnOrder = getTurnOrder();
//   for (const { id, pr } of existingTurnOrder) {
//     const result = tokenIdToResult(id, parseInt(pr.toString(), 10) || 1);
//     if (!result) {
//       continue;
//     }
//     results.push(result);
//     resultsMap.set(result.id, result);
//     trackFamiliars(familiarMap, result);
//   }

//   if (results.length === 0) {
//     return [];
//   }

//   // Set familiar initiative to match their master's initiative
//   for (const [familiarOf, familiarResults] of Object.entries(familiarMap)) {
//     const roll = resultsMap.get(familiarOf)?.roll ?? 1;
//     familiarResults.forEach((familiarResult) => {
//       familiarResult.roll = roll;
//     });
//   }

//   // Sort descending by roll, then by whether it's a familiar, then by dexterity score as tiebreaker
//   results.sort((a, b) =>
//     b.roll - a.roll || b.isFamiliar ? -1 : 1 || b.dex - a.dex
//   );

//   const _pageid = getCurrentPageId();
//   const newTurnOrder: TurnOrder = results.map(({ graphic, roll }) => ({
//     id: graphic.get("id"),
//     pr: `${roll}`, // must be a string
//     custom: graphic.get("name") || "[Unknown Token]",
//     _pageid,
//   }));

//   setTurnOrder(newTurnOrder);

//   const lines = results.map(
//     ({ graphic, roll, bonus }) =>
//       `${graphic.get("name")}: ${roll} (d20[${roll - bonus}]${bonus >= 0 ? "+" : ""}${bonus})`
//   );
//   sendChat(
//     "InitiativeAPI",
//     `&{template:default} {{name=Initiative}} {{${lines.join("}} {{")}}}`
//   );

//   return results;
// }

// function onChatMessage(msg: ChatMessage): void {
//   if (msg.type !== "api" || !msg.content.startsWith(INITIATIVE_API_KEY)) {
//     return;
//   }
//   if (!playerIsGM(msg.playerid)) {
//     sendChat(
//       "InitiativeAPI",
//       `/w ${getPlayerName(msg.playerid)} Only the GM can roll initiative with !initiative.`
//     );
//     return;
//   }

//   const selected = msg.selected ?? [];
//   if (!selected || selected.length === 0) {
//     sendChat(
//       "InitiativeAPI",
//       `/w ${getPlayerName(msg.playerid)} Select one or more tokens before using !initiative.`
//     );
//     return;
//   }

//   const graphicIds = selected.map(({ _id: id }) => id);
//   debug(`Selected token IDs: ${graphicIds.join(", ")}`);
//   const graphics = graphicIds
//     .map((id) => {
//       const graphic = getObj("graphic", id);
//       if (!graphic) {
//         debug(`Couldn't find graphic for token ${id}`);
//       }
//       return graphic;
//     })
//     .filter((graphic): graphic is Graphic => !!graphic);

//   const results = rollGroupInitiative(graphics);
//   if (results.length === 0) {
//     sendChat(
//       "InitiativeAPI",
//       `/w ${getPlayerName(msg.playerid)} No valid tokens found in selection.`
//     );
//     return;
//   }
// }

// on("ready", () => {
//   debug("Starting up !initiative API");
// });

// on("chat:message", onChatMessage);
