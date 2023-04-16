import { downLabel, leftLabel, rightLabel, upLabel } from './elements.js';
import { getUrlParam } from './getUrlParam.js';
export const defaultDirections = ['up', 'right', 'down', 'left'];
export const directions = [...defaultDirections];
export function setDirections(newDirections) {
    if (!Array.isArray(newDirections) || newDirections.length !== 4 || !newDirections.every(entry => typeof entry === 'string')) {
        throw new Error(`Invalid directions: ${newDirections}`);
    }
    directions.splice(0, 4, ...newDirections);
    upLabel.innerText = directions[0];
    rightLabel.innerText = directions[1];
    downLabel.innerText = directions[2];
    leftLabel.innerText = directions[3];
}
export function translateDirection(defaultDirection) {
    return directions[defaultDirections.indexOf(defaultDirection)];
}
function checkUrlParamDirections() {
    const str = getUrlParam('directions');
    if (str) {
        const split = str.split(',');
        if (split.length === 4) {
            const length4 = split;
            setDirections(length4);
        }
    }
}
checkUrlParamDirections();
//# sourceMappingURL=directions.js.map