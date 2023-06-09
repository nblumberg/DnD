import { clear, restart } from './elements.js';
import { DefaultDirection } from '../shared/directions.js';
import { getLocation } from './showLocation.js';
import { send } from './browserSockets.js';
import { isDM } from './isDM.js';

function onClickDirection(event: Event) {
  const direction = (event.target as HTMLElement)!.id as DefaultDirection;
  if (isDM()) {
    const location = getLocation();
    if (!location || !location[direction]) {
      return;
    }
    send({ type: 'navigate', location, direction });
  } else {
    send({ type: 'voteDirection', direction });
  }
}

function onClickRestart() {
  if (isDM()) {
    send({ type: 'restart' });
  }
}

function onClickReset() {
  if (isDM()) {
    send({ type: 'reset' });
  }
}

export function addEventHandlers(): void {
  Array.from(document.getElementsByClassName('direction')).forEach(element => {
    element.addEventListener('click', onClickDirection);
  });
  restart.addEventListener('click', onClickRestart);
  clear.addEventListener('click', onClickReset);
}