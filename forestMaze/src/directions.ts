import { downLabel, leftLabel, rightLabel, upLabel } from './elements.js';
import { getUrlParam } from './getUrlParam.js';

export type DefaultDirection = 'up' | 'right' | 'down' | 'left';
type DirectionArray = [string, string, string, string];
export const defaultDirections: DefaultDirection[] = ['up', 'right', 'down', 'left'];

export const directions: DirectionArray = [...(defaultDirections as [string, string, string, string])];

export function setDirections(newDirections: DirectionArray) {
  if (!Array.isArray(newDirections) || newDirections.length !== 4 || !newDirections.every(entry => typeof entry === 'string')) {
    throw new Error(`Invalid directions: ${newDirections}`);
  }
  directions.splice(0, 4, ...newDirections);
  upLabel.innerText = directions[0];
  rightLabel.innerText = directions[1];
  downLabel.innerText = directions[2];
  leftLabel.innerText = directions[3];
}

export function translateDirection(defaultDirection: DefaultDirection): string {
  return directions[defaultDirections.indexOf(defaultDirection)];
}

function checkUrlParamDirections(): void {
  const str = getUrlParam('directions');
  if (str) {
    const split = str.split(',');
    if (split.length === 4) {
      const length4 = split as DirectionArray;
      setDirections(length4);
    }
  }
}
checkUrlParamDirections();
