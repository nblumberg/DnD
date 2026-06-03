// ===========================
// CENTER SCREEN ON TOKEN MOVE
// ===========================

import { getPCName, getPlayerName, graphicToPlayerId } from "./players";
import { centerScreen, debounce, extractProperties, getCurrentPageId, getRect } from "./utilities";

const DEBOUNCE_DELAY = 1000;

/**
 * Whenever a player moves one of their tokens, recenter only their screen on the token
 * @param {Graphic} graphic https://help.roll20.net/hc/en-us/articles/360037772793-API-Objects#API:Objects-Graphic(Token/Map/Card/Etc.)
 * @param {object} previousState https://help.roll20.net/hc/en-us/articles/360037772813#API:Events-ObjectEvents
 */
function onGraphicMove(graphic: Graphic, previousState: any) {
  const { subtype, layer, pageid: pageId, left, top, represents } = extractProperties(
    graphic,
    "subtype",
    "layer",
    "pageid",
    "represents",
    "left",
    "top"
  );
  if (
    subtype !== "token" ||
    layer !== "objects" ||
    pageId !== getCurrentPageId()
  ) {
    return;
  }
  const name = getPCName(represents);
  const playerId = graphicToPlayerId(graphic);
  if (!playerId) {
    log(`Couldn't determine player screen to center when ${name} moved`);
    return;
  }
  const { left: previousLeft, top: previousTop } = previousState;
  if (
    !previousState ||
    typeof previousLeft !== "number" ||
    typeof previousTop !== "number" ||
    (left === previousLeft && top === previousTop)
  ) {
    // ignore adds and moves to the same location
    log(
      `${name} either didn't move or there was nothing to compare its position to`
    );
    return;
  }
  const rect = getRect(graphic);
  log(
    `${getPlayerName(playerId)} moved ${name} to (${rect.left}, ${rect.top}), recentering their screen`
  );
  centerScreen(graphic, playerId);
}

on("ready", () => {
  log("Starting up center-on-token-move functionality");
});

on("change:graphic:left", debounce(onGraphicMove, DEBOUNCE_DELAY));
on("change:graphic:top", debounce(onGraphicMove, DEBOUNCE_DELAY));
