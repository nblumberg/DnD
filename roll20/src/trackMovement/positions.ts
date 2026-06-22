import type { Id, Rect } from "../builtIns";
import { debounce, getRect } from "../utilities";

type Path = Rect[];
type PagePaths = Record<Id, Path>;
type GraphicPaths = Record<Id, PagePaths>;
interface TrackMovementState {
  positions: GraphicPaths;
}

export function getPath(graphic: Graphic): Path {
  if (!state.trackMovement) {
    state.trackMovement = { positions: {} };
  }
  const trackState = state.trackMovement as unknown as TrackMovementState;
  const graphicId = graphic.get("id");
  const pageId = graphic.get("pageid");
  if (!trackState.positions[graphicId]) {
    trackState.positions[graphicId] = {};
  }
  if (!trackState.positions[graphicId][pageId]) {
    trackState.positions[graphicId][pageId] = [];
  }
  return trackState.positions[graphicId][pageId];
}

/**
 * Get the last known position of the graphic on the current page
 * @param {Graphic} graphic The graphic to get the position of
 * @returns {Rect} The position of the graphic, with left, top, width, and height properties
 */
export function getLastPosition(graphic: Graphic): Rect {
  return getPath(graphic)[0] ?? { ...getRect(graphic), left: -1, top: -1 };
}

/**
 * Prepend the current position of the graphic to its history for the current page
 * @param {Graphic} graphic The graphic to record the position of
 */
export function updateGraphicPosition(graphic: Graphic): void {
  const path = getPath(graphic);
  const lastPosition = getLastPosition(graphic);
  const newPosition = getRect(graphic);
  if (
    lastPosition.left === newPosition.left &&
    lastPosition.top === newPosition.top &&
    lastPosition.width === newPosition.width &&
    lastPosition.height === newPosition.height
  ) {
    return;
  }
  path.unshift(newPosition);
}

on("change:graphic:left", debounce(updateGraphicPosition));
on("change:graphic:top", debounce(updateGraphicPosition));
