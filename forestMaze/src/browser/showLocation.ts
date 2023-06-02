import { registerWebSocketHandler } from './browserSockets.js';
import { hideButtons, showButtons } from './elements.js';
import { Location, LocationParams } from '../locations.js';
import { ServerToBrowserSocketMessage } from '../shared/socketTypes.js';
import { addStatePropertyListener } from '../shared/state.js';
import { getImage, showImage } from './showImage.js';
import { showText } from './showText.js';
import { AsyncKey, createAsyncLock } from './asyncLock.js';
import { waitOnEncounterDisplay } from './showEncounter.js';

const asyncLockKey: AsyncKey = {
  unlock: () => {}, // will be replaced by createAsyncLock()
};
export const waitOnLocationDisplay = createAsyncLock(asyncLockKey);

interface LocationsSocketMessage extends ServerToBrowserSocketMessage {
  locations: LocationParams[];
}

const locations: Location[] = [];

registerWebSocketHandler('locations', (message) => {
  const { locations: newLocations } = message as LocationsSocketMessage;
  locations.length = 0;
  newLocations.forEach(params => locations.push(new Location(params)));
  if (currentLocation) {
    showLocation(currentLocation);
  }
});

export function getLocations(): Location[] {
  return [...locations];
}

async function showLocation(location?: Location) {
  if (!location) {
    return;
  }

  await waitOnLocationDisplay(); // waits on the previous one and adds this execution to the queue

  const {
    src: backgroundImage,
    rotate = 0,
    description,
    forcedEncounter = false,
  } = location;
  hideButtons();
  await showImage(backgroundImage, rotate);
  showButtons(location);
  if (description) {
    await showText(description);
  }

  await waitOnEncounterDisplay();

  if (getImage() !== backgroundImage) {
    // Reset image after encounter image
    await showImage(backgroundImage, rotate);
  }

  asyncLockKey.unlock(); // resolves this execution on the queue
}

let currentLocation: Location | undefined;
currentLocation = getLocation(addStatePropertyListener('location', (locationName: string) => {
  currentLocation = getLocation(locationName);
  showLocation(currentLocation);
}));

export function getLocation(name?: string): Location | undefined {
  if (name) {
    return locations.find(location => location.name === name);
  } else if (currentLocation) {
    return currentLocation;
  }
  return locations[0];
}
