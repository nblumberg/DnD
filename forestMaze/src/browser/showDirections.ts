import { DefaultDirection, DirectionArray } from '../shared/directions.js';
import { State, addStatePropertyListener } from '../shared/state.js';
import { downLabel, downVotes, leftLabel, leftVotes, rightLabel, rightVotes, upLabel, upVotes } from './elements.js';

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

function showVotes(votes: State['votes']) {
  upVotes.innerText = stringifyVotes(votes, 'up');
  rightVotes.innerText = stringifyVotes(votes, 'right');
  downVotes.innerText = stringifyVotes(votes, 'down');
  leftVotes.innerText = stringifyVotes(votes, 'left');
}
addStatePropertyListener('votes', showVotes);

function stringifyVotes(votes: State['votes'], direction: DefaultDirection): string {
  return votes[direction]!.join(', ');
}

export function clearVotes() {
  showVotes({
    up: [],
    right: [],
    down: [],
    left: [],
  });
}
