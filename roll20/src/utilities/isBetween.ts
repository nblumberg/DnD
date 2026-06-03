/**
 * Check if target point is between other points
 * (but not equal to so it doesn't trigger when 
 * graphic A's outer edge meets graphic B's outer edge 
 * without being inside the graphic B)
 * @param {number} target
 * @param {number} min
 * @param {number} max
 * @returns {boolean} true if target is between min and max
 */
export function isBetween(target: number, min: number, max: number): boolean {
  return min < target && target < max;
}
