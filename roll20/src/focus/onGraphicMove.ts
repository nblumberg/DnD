import { getPCName, getPlayerName, graphicToPlayerId } from "../players";
import {
  centerScreen,
  extractProperties,
  getCurrentPageId,
  getRect,
} from "../utilities";
import { debug } from "./debug";

/**
 * Whenever a player moves one of their tokens, recenter only their screen on the token
 * @param {Graphic} graphic https://help.roll20.net/hc/en-us/articles/360037772793-API-Objects#API:Objects-Graphic(Token/Map/Card/Etc.)
 * @param {object} previousState https://help.roll20.net/hc/en-us/articles/360037772813#API:Events-ObjectEvents
 */
export function onGraphicMove(graphic: Graphic, previousState: any) {
  const {
    subtype,
    layer,
    pageid: pageId,
    left,
    top,
    represents,
  } = extractProperties(
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
    debug(`Couldn't determine player screen to center when ${name} moved`);
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
    debug(
      `${name} either didn't move or there was nothing to compare its position to`
    );
    return;
  }
  const rect = getRect(graphic);
  debug(
    `${getPlayerName(playerId)} moved ${name} to (${rect.left}, ${rect.top}), recentering their screen`
  );
  centerScreen(graphic, playerId);
}
