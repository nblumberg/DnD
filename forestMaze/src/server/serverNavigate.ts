import { Location } from '../locations';
import { DefaultDirection } from '../shared/directions';
import { setState } from '../shared/state';
import { addTravelTime } from './serverState';
import { countdownStatusEffects, sendToAllUsers } from './user';
import { addLocationsListener, findLocation, getLocations } from './serverLocations';
import { getEncounters, resetEncounters, resolveEncounter } from './serverEncounters';
import { trackDirection, resetHistory, getHistory, trackLocation } from './serverHistory';
import { registerWebSocketHandler } from './serverSockets';
import { BrowserToServerSocketMessage } from '../shared/socketTypes';
import { generateEncounter } from '../encounters';

function onChangeMap(locations: Location[]) {
  goToLocation(locations[0]);
}

addLocationsListener(onChangeMap)

interface GoToLocationCallback {
  (location: Location, initialLocation?: boolean) : Promise<void>;
};
const goToLocationCallbacks: GoToLocationCallback[] = [];
export function registerGoToLocationCallback(callback: GoToLocationCallback): void {
  goToLocationCallbacks.push(callback);
}

async function goToLocation(location: Location): Promise<void> {
  const initialLocation = !!getHistory().length;
  setState({ location: location.name });

  goToLocationCallbacks.forEach(callback => {
    callback(location, initialLocation);
  });

  const encounter = await generateEncounter(getEncounters(), location);
  if (encounter) {
    resolveEncounter(encounter);
  }
}

function navigate(message: BrowserToServerSocketMessage) {
  const { locationName, direction } = message as unknown as { locationName: string, direction: DefaultDirection };
  const currentLocation = findLocation(locationName);
  if (!currentLocation || !direction || !currentLocation[direction]) {
    return;
  }
  const nextLocation = findLocation(currentLocation[direction]!);
  if (!nextLocation) {
    return;
  }

  trackLocation(nextLocation);
  trackDirection(direction);
  addTravelTime();
  countdownStatusEffects();
  goToLocation(nextLocation);
}
registerWebSocketHandler('navigate', navigate);

export function voteDirection(message: BrowserToServerSocketMessage) {
  const { user, direction } = message as unknown as { user: string, direction: DefaultDirection };
  if (!user || !direction) {
    return;
  }
  sendToAllUsers({ ...message, voter: user });
}
registerWebSocketHandler('voteDirection', voteDirection);

export function onRestart(): void {
  goToLocation(getLocations()[0]);
}

export function onReset(): void {
  onReset();
  resetEncounters();
  resetHistory();
  setState({ tide: 'low' });
}
