import { generateEncounter } from '../encounters';
import { Location } from '../locations';
import { DefaultDirection } from '../shared/directions';
import { BrowserToServerSocketMessage } from '../shared/socketTypes';
import { setState, state } from '../shared/state';
import { getEncounters, resetEncounters } from './serverEncounters';
import { getHistory, resetHistory, trackDirection, trackLocation } from './serverHistory';
import { addLocationsListener, findLocation, getLocations } from './serverLocations';
import { registerWebSocketHandler, unregisterWebSocketHandler } from './serverSockets';
import { addTravelTime } from './serverState';
import { countdownStatusEffects, getActiveUsers } from './user';

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
  setState({
    location: location.name,  // TODO: already done by trackLocation()?
    votes: { up: [], right: [], down: [], left: [] }
  });

  goToLocationCallbacks.forEach(callback => {
    callback(location, initialLocation);
  });

  const encounter = await generateEncounter(getEncounters(), location);
  if (encounter) {
    const idName = `${encounter.id} ${encounter.getName()}`;
    setState({ encounter: idName });
    console.log(`Starting Encounter ${idName}`);
    return new Promise((resolve) => {
      const resolvedUsers = new Set<string>();
      registerWebSocketHandler('resolveEncounter', message => {
        const { encounter: resolvedEncounter, user } = message;
        if (resolvedEncounter !== encounter.id) {
          return;
        }
        resolvedUsers.add(user);
        console.log(`${user} resolved Encounter ${idName}`);
        if (getActiveUsers().every(activeUser => resolvedUsers.has(activeUser))) {
          encounter.resolved = true;
          setState({ encounter: '' });
          console.log(`Resolved Encounter ${idName}`);
          unregisterWebSocketHandler('resolveEncounter');
          resolve();
        }
      });
    });
  } else {
    setState({ encounter: '' });
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
  const { votes: { up, right, down, left } } = state;
  function notVoter(character: string) {
    return character !== user;
  }
  const votes = {
    up: up.filter(notVoter),
    right: right.filter(notVoter),
    down: down.filter(notVoter),
    left: left.filter(notVoter),
  };
  votes[direction].push(user);
  setState({ votes });
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

function setDestination(message: BrowserToServerSocketMessage): void {
  const { destination } = message as unknown as { destination: string; };
  setState({ destination });
}
registerWebSocketHandler('destination', setDestination);
