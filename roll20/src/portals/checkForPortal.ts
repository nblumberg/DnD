import { graphicToPlayerId } from "../players";
import { getLastPosition, updateGraphicPosition } from "../trackMovement";
import { centerScreen, debounce, extractProperties, getCurrentPageId, getRect } from "../utilities";
import { isWithin } from "../utilities/isWithin";
import { getPortal, getPortals } from "./portals";
import { temporarilyClosePortals } from "./temporarilyClosedPortals";

/**
 * Check if the Graphic is a Token on the current page and see if it overlaps any portals on the current page.
 * If so, move the Token through the portal and recenter the player's view.
 * @param {Graphic} graphic
 */
function checkForPortal(graphic: Graphic) {
  const { id, name, subtype, layer, pageid } = extractProperties(
    graphic,
    "id",
    "name",
    "subtype",
    "layer",
    "pageid",
    "represents"
  );

  // Stop if it's not a token on the current page or if it's a portal token
  if (
    subtype !== "token" ||
    layer !== "objects" ||
    pageid !== getCurrentPageId() ||
    name === "!portal"
  ) {
    return;
  }

  // Stop if the token hasn't moved since the last check
  const lastPosition = getLastPosition(graphic);
  const rect = getRect(graphic);
  log(
    `Checking ${name} for portals, moving from (${lastPosition.left}, ${lastPosition.top}) to (${rect.left}, ${rect.top})`
  );
  if (rect.left === lastPosition.left && rect.top === lastPosition.top) {
    return;
  }

  updateGraphicPosition(graphic);

  // Stop if the token isn't overlapping a portal
  const portal = getPortals().find((portal) => {
    if (portal.pageid !== pageid) {
      return false;
    }
    return isWithin(rect, portal);
  });
  if (!portal) {
    return;
  }

  // Prevent the token from bouncing back and forth between two-way portals
  const targetPortal = getPortal(portal.targetId);
  if (!targetPortal) {
    log(`ERROR: Portal ${portal.name} has invalid targetId ${portal.targetId}`);
    return;
  }
  temporarilyClosePortals(graphic, [portal, targetPortal]);
  // if (twoWayPortalDelay.addDelay({ id, name }, portal, targetPortal)) {
  //   return;
  // }

  // Move the token to the target portal and center the screen
  log(`${name} passing through ${portal.name} to ${targetPortal.name}`);
  graphic.set("left", targetPortal.left);
  graphic.set("top", targetPortal.top);
  updateGraphicPosition(graphic);
  const playerId = graphicToPlayerId(graphic);
  if (!playerId) {
    log(`ERROR: Could not find player controlling token ${name} (${id})`);
    return;
  }
  setTimeout(() => {
    centerScreen(graphic, playerId);
  }, 300);
}

on("change:graphic:left", debounce(checkForPortal));
on("change:graphic:top", debounce(checkForPortal));
