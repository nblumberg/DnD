import { DirectionArray } from '../shared/directions.js';
import { addStatePropertyListener } from '../shared/state.js';
import { downLabel, leftLabel, rightLabel, upLabel } from './elements.js';

function showDirections(directions: DirectionArray) {
  if (!Array.isArray(directions) || directions.length !== 4 || !directions.every(entry => typeof entry === 'string')) {
    throw new Error(`Invalid directions: ${directions}`);
  }
  upLabel.innerText = directions[0];
  rightLabel.innerText = directions[1];
  downLabel.innerText = directions[2];
  leftLabel.innerText = directions[3];
}
addStatePropertyListener('directions', showDirections);
