import { Location, LocationParams } from '../locations.js';
import { ServerToBrowserSocketMessage } from '../shared/socketTypes.js';
import { addStatePropertyListener } from '../shared/state.js';
import { registerWebSocketHandler } from './browserSockets.js';
import { displayLock } from './displayLock.js';
import { clearVotes, hideButtons, showButtons } from './showDirections.js';
import { showImage } from './showImage.js';
import { showText } from './showText.js';

interface LocationsSocketMessage extends ServerToBrowserSocketMessage {
  locations: LocationParams[];
}

let currentLocation: Location | undefined;

export function getLocation(name?: string): Location | undefined {
  if (name) {
    return locations.find(location => location.name === name);
  } else if (currentLocation) {
    return currentLocation;
  }
  return locations[0];
}

const locations: Location[] = [];

const listeners: Array<(locations: Location[]) => void> = [];
export function addLocationsListener(listener: (locations: Location[]) => void) {
  listeners.push(listener);
}

registerWebSocketHandler('locations', (message) => {
  const { locations: newLocations } = message as LocationsSocketMessage;
  locations.length = 0;
  newLocations.forEach(params => locations.push(new Location(params)));
  listeners.forEach(listener => listener(locations));

  function locationUpdate(locationName: string) {
    const newLocation = getLocation(locationName);
    if (locationName === currentLocation?.name) {
      // Reassign in case the Location instances refreshed, but don't treat it as a change
      currentLocation = newLocation;
      return;
    }
    currentLocation = newLocation;
    if (currentLocation) {
      clearVotes();
      showLocation(currentLocation);
    }
  }

  locationUpdate(addStatePropertyListener('location', locationUpdate));
});

export function getLocations(): Location[] {
  return [...locations];
}

async function showLocation(location?: Location, hasSeenText = false) {
  if (!location) {
    return;
  }

  const displayKey = { unlock: () => {} };
  await displayLock(displayKey); // waits on the previous one and adds this execution to the queue

  const {
    src: backgroundImage,
    rotate = 0,
    description,
    forcedEncounter = false,
  } = location;
  hideButtons();
  await showImage(backgroundImage, rotate);
  showButtons(location);

  if (description && !hasSeenText) {
    await showText(description);
  }
  displayKey.unlock(); // resolves this execution on the queue
}


export async function showCurrentLocation() {
  if (currentLocation) {
    showLocation(currentLocation, true);
  }
}
