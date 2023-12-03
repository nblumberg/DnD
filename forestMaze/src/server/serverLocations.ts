import { addStatePropertyListener } from '../shared/state';
import { Location, linkLocations } from '../locations';
import { createEventEmitter } from '../shared/eventEmitter';

const data: { locations: Location[] } = { locations: [] };
const { addPropertyListener, removeListener, setData } = createEventEmitter(data);

interface LocationChangeHandler {
  (locations: Location[]): void;
}

export function getLocations(): Location[] {
  return [...data.locations];
}

export function findLocation(locationName: string): Location | undefined {
  return data.locations.find(({ name }) => name === locationName);
}

export function addLocationsListener(handler: LocationChangeHandler): void {
  addPropertyListener('locations', handler);
}

export function removeLocationsListener(handler: LocationChangeHandler): void {
  removeListener(handler, 'locations');
}

async function updateLocations(path: string) {
  const { locations: rawLocations } = await import(`${path}/locations`);
  const locations = linkLocations(rawLocations);
  setData({ locations });
  console.log(`Initialized ${locations.length} locations`);
}

updateLocations(addStatePropertyListener('path', updateLocations));
