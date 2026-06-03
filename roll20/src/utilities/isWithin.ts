import type { Rect } from "../builtIns";
import { isBetween } from "./isBetween";

/**
 * Check if Rect A is within (or exactly overlapping) Rect B
 * @param {Rect} rectA The Rect of A, with left, top, width, and height properties
 * @param {Rect} reactB The Rect of B, with left, top, width, and height properties
 * @returns {boolean} true if A is within B
 */
export function isWithin(
  { left: aLeft, top: aTop, width: aWidth, height: aHeight }: Rect,
  {
    left: bLeft,
    top: bTop,
    width: bWidth,
    height: bHeight,
  }: Rect
) {
  const tokenRight = aLeft + aWidth;
  const tokenBottom = aTop + aHeight;
  const portalRight = bLeft + bWidth;
  const portalBottom = bTop + bHeight;

  // log(
  //   `Checking ${name} [${bLeft}, ${bTop}, ${portalRight}, ${portalBottom}] vs. [${aLeft}, ${aTop}, ${tokenRight}, ${tokenBottom}]`
  // );

  const leftEdgeWithin = isBetween(aLeft, bLeft, portalRight);
  const rightEdgeWithin = isBetween(tokenRight, bLeft, portalRight);
  const topEdgeWithin = isBetween(aTop, bTop, portalBottom);
  const bottomEdgeWithin = isBetween(tokenBottom, bTop, portalBottom);
  const topLeftCornerWithin = leftEdgeWithin && topEdgeWithin;
  const topRightCornerWithin = rightEdgeWithin && topEdgeWithin;
  const bottomLeftCornerWithin = leftEdgeWithin && bottomEdgeWithin;
  const bottomRightCornerWithin = rightEdgeWithin && bottomEdgeWithin;
  const atLeastACornerWithin =
    topLeftCornerWithin ||
    topRightCornerWithin ||
    bottomLeftCornerWithin ||
    bottomRightCornerWithin;
  if (atLeastACornerWithin) {
    return true;
  }
  // Because we don't consider exactly matching the portal edges in isBetween so a single edge overlap doesn't count,
  // we need to check for the case where at least two opposing edges of the token
  // are exactly overlapping the portal edges as well.
  // Both horizontal edges matching or both vertical edges matching is considered within the portal,
  // so long at it isn't just a single edge of the opposite orientation also matching (i.e.
  // the token is next to the portal).
  const matchesLeftAndRight =
    aLeft === bLeft && tokenRight === portalRight;
  const matchesTopAndBottom =
    aTop === bTop && tokenBottom === portalBottom;
  const matchesBoth = matchesLeftAndRight && matchesTopAndBottom;
  if (
    matchesBoth ||
    (matchesLeftAndRight && (topEdgeWithin || bottomEdgeWithin)) ||
    (matchesTopAndBottom && (leftEdgeWithin || rightEdgeWithin))
  ) {
    return true;
  }
  return (
    (isBetween(aLeft, bLeft, bLeft + bWidth) &&
      isBetween(aTop, bTop, bTop + bHeight)) ||
    (isBetween(aLeft + aWidth, bLeft, bLeft + bWidth) &&
      isBetween(aTop + aHeight, bTop, bTop + bHeight)) ||
    (isBetween(bLeft, aLeft, aLeft + aWidth) &&
      isBetween(bTop, aTop, aTop + aHeight)) ||
    (isBetween(bLeft + bWidth, aLeft, aLeft + aWidth) &&
      isBetween(bTop + bHeight, aTop, aTop + aHeight))
  );
}
