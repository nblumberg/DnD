import { Rect } from "../builtIns";
import { getRect } from "../utilities";

const positions = new Map<string, Rect>();

/**
 * Get the last known position of the graphic
 * @param {Graphic} graphic The graphic to get the position of
 * @returns {Rect} The position of the graphic, with left, top, width, and height properties
 */
export function getLastPosition(graphic: Graphic): Rect {
  return (
    positions.get(graphic.id) ?? { ...getRect(graphic), left: -1, top: -1 }
  );
}

/**
 * Set the last known position of the graphic
 * @param {Graphic} graphic The graphic to set the position of
 */
export function updateGraphicPosition(graphic: Graphic): void {
  positions.set(graphic.id, getRect(graphic));
}
