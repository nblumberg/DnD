import { getDirections } from '../locations.js';
import { DefaultDirection, translateDirection } from '../shared/directions.js';
import { send } from './browserSockets.js';
import { isDM } from './character.js';
import { getLocation, getLocations } from './showLocation.js';

function logPath(steps: string[], turns: DefaultDirection[]): void {
  let path = '';
  for (let i = 0; i < steps.length; i++) {
    path += `${path ? '\n\t-> ' : ''}${steps[i]}${turns[i] ? ` [${translateDirection(turns[i])}]` : ''}`;
  }
  console.log(path);
}

/**
 * Needs a non-recursive solution or else it may exceed the stack frame limit
 * @param {Location[]} allLocations
 * @param {string} targetLocationName
 */
function howDoIGetTo(targetLocationName: string): void {
  const currentLocation = getLocation();
  if (!currentLocation) {
    throw new Error(`'I don't know where I am`);
  }
  const path = getDirections(getLocations(), currentLocation.name, targetLocationName);
  if (!path) {
    return;
  }
  logPath(...path);
  if (isDM()) {
    send({ type: 'destination', destination: targetLocationName });
  }
}

(window as any).howDoIGetTo = howDoIGetTo;
