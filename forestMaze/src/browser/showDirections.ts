import { Location } from '../locations.js';
import { DefaultDirection, DirectionArray, defaultDirections } from '../shared/directions.js';
import { State, addStatePropertyListener } from '../shared/state.js';
import { getSupposedDirection } from './browserNavigate.js';
import { isDM } from './character.js';
import { downButton, downLabel, downVotes, leftButton, leftLabel, leftVotes, rightButton, rightLabel, rightVotes, upButton, upLabel, upVotes } from './elements.js';

const labels = [ upLabel, rightLabel, downLabel, leftLabel];
function labelDirections(directions: DirectionArray) {
  if (!Array.isArray(directions) || directions.length !== 4 || !directions.every(entry => typeof entry === 'string')) {
    throw new Error(`Invalid directions: ${directions}`);
  }
  labels.forEach((element, i) => {
    element.innerText = directions[i];
  });
}
addStatePropertyListener('directions', labelDirections);

const voteLabels = [upVotes, rightVotes, downVotes, leftVotes];
function showVotes(votes: State['votes']) {
  voteLabels.forEach((element, i) => {
    element.innerText = stringifyVotes(votes, defaultDirections[i]);
  });
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

const buttons = [upButton, rightButton, downButton, leftButton];

export function hideButtons(): void {
  buttons.forEach((button) => {
    button.classList.add('hidden');
  });
}

export function showButtons(location: Location) {
  defaultDirections.forEach((direction, i) => {
    if (location[direction]) {
      buttons[i].classList.remove('hidden');
    }
  });
  const direction = getSupposedDirection(location);
  buttons.forEach((element, i) => {
    element.classList.remove('correct');
    if (defaultDirections[i] === direction && !isDM()) {
      element.classList.add('correct');
    }
  });
}

const buttonsHidden = [false, false, false, false];
let buttonsDisabled = false;

export function disableDirections(): void {
  if (buttonsDisabled) {
    return;
  }
  buttonsDisabled = true;
  buttons.forEach((button, i) => {
    buttonsHidden[i] = button.classList.contains('hidden');
  });
  hideButtons();
}

export function enableDirections(): void {
  if (!buttonsDisabled) {
    return;
  }
  buttons.forEach((button, i) => {
    if (!buttonsHidden[i]) {
      button.classList.remove('hidden');
    }
  });
  buttonsDisabled = false;
}
