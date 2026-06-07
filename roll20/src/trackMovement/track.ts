import type { Id, ParsedRollResult } from "../builtIns";
import { getPCs, getPlayerName, isControlledBy } from "../players";
import { getCurrentPageId } from "../utilities";
import { getPath } from "./positions";

const TRACK_API_KEY = "!track";
const TRACK_PATH_DURATION_MS = 10_000;
const SURVIVAL_DC = 10;

function findTokenForCharacter(characterId: Id, pageId: Id): Graphic | undefined {
  return findObjs<Graphic>({ type: "graphic", represents: characterId, pageid: pageId })[0];
}

function findGraphic(nameOrId: string): Graphic | undefined {
  const pageId = getCurrentPageId();

  const byGraphicId = getObj("graphic", nameOrId);
  if (byGraphicId) return byGraphicId;

  const byGraphicName = findObjs<Graphic>({ type: "graphic", name: nameOrId, pageid: pageId });
  if (byGraphicName.length > 0) return byGraphicName[0];

  const byCharacterId = getObj("character", nameOrId);
  if (byCharacterId) return findTokenForCharacter(byCharacterId.get("id"), pageId);

  const byCharacterName = findObjs<Character>({ type: "character", name: nameOrId });
  if (byCharacterName.length > 0) return findTokenForCharacter(byCharacterName[0].get("id"), pageId);

  return undefined;
}

function drawTrackPath(graphic: Graphic, playerId: Id): void {
  const path = getPath(graphic);
  if (path.length < 2) {
    sendChat("TrackAPI", `/w ${getPlayerName(playerId)} No movement history found for that token.`);
    return;
  }

  // Path is FILO (index 0 = most recent); reverse for chronological drawing order
  const points = [...path].reverse().map(({ left, top }) => [left, top] as [number, number]);
  const [originX, originY] = points[0];
  const relativePoints = points.map(([x, y]) => [x - originX, y - originY]);

  const drawnPath = createObj("path", {
    pageid: getCurrentPageId(),
    x: originX,
    y: originY,
    points: JSON.stringify(relativePoints),
    shape: "pol",
    stroke: "#ff0000",
    stroke_width: 5,
    layer: "objects",
  } as Partial<Pathv2>);

  setTimeout(() => {
    drawnPath.remove();
  }, TRACK_PATH_DURATION_MS);
  log(`Drew track path for ${graphic.get("name")} with ${points.length} waypoints`);
}

function rollSurvivalAndDraw(graphic: Graphic, playerId: Id): void {
  const pc = getPCs().find(c => isControlledBy(c, playerId));
  if (!pc) {
    sendChat("TrackAPI", `/w ${getPlayerName(playerId)} You don't control any characters, so you can't attempt to track that.`);
    return;
  }
  const survivalBonus = parseInt(getAttrByName(pc.get("id"), "survival_bonus") ?? "0") || 0;
  const pcName = pc.get("name");

  sendChat("TrackAPI", `/r 1d20+${survivalBonus}`, (results) => {
    const msg = results[0];
    if (msg.type !== "rollresult") {
      return;
    }
    const roll = JSON.parse(msg.content) as ParsedRollResult;
    if (roll.total >= SURVIVAL_DC) {
      sendChat("TrackAPI", `/w ${getPlayerName(playerId)} ${pcName} succeeded on the Survival check (${roll.total} vs DC ${SURVIVAL_DC}).`);
      drawTrackPath(graphic, playerId);
    } else {
      sendChat("TrackAPI", `/w ${getPlayerName(playerId)} ${pcName} failed the Survival check (${roll.total} vs DC ${SURVIVAL_DC}).`);
    }
  });
}

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
      sendChat("TrackAPI", `/w ${getPlayerName(playerid)} Could not find token or character: ${nameOrId}`);
      return;
    }
  } else {
    if (selected.length !== 1) {
      sendChat("TrackAPI", `/w ${getPlayerName(playerid)} Usage: !track <token or character name or id>, or select exactly one token`);
      return;
    }
    graphic = getObj("graphic", selected[0].id);
    if (!graphic) {
      sendChat("TrackAPI", `/w ${getPlayerName(playerid)} Could not find the selected token`);
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
  log("Starting up !track API");
});

on("chat:message", onChatMessage);
