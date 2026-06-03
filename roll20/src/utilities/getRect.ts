/**
 * Get the bounding box of the Graphic
 * @param {Graphic} graphic
 * @returns {{top: number, left: number, width: number, height: number}}
 */
export function getRect(graphic: Graphic) {
  const left = graphic.get("left");
  const top = graphic.get("top");
  const width = graphic.get("width");
  const height = graphic.get("height");
  return { left, top, width, height };
}
