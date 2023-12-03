import { DefaultDirection } from '../shared/directions';
import { history, History, logDirection, logEncounter, logLocation } from '../shared/history';
import { addStatePropertyListener, setState } from '../shared/state';
import { Location } from '../locations';
import { readHistory, storeHistory } from './storage';
import { Encounter } from '../encounters';
import { addLocationsListener, getLocations } from './serverLocations';

function initializeHistory(): void {
  history.length = 0;
  readHistory().forEach(entry => history.push(entry));
  if (!history.length) {
    const locations = getLocations();
    if (locations.length) {
      trackLocation(locations[0]);
    }
  }
  history.forEach(entry => {
    logLocation(entry[0]);
    if (entry[2]) {
      logEncounter(entry[2]);
    }
    if (entry[1]) {
      logDirection(entry[1]);
    }
  });
}
addLocationsListener(initializeHistory);

export function getHistory(): History {
  return [...history];
}

export function trackLocation({ name }: Location): void {
  logLocation(name);
  const history = getHistory();
  history.push([name]);
  storeHistory(history);
  setState({ location: name });
}

export function trackDirection(direction: DefaultDirection): void {
  logDirection(direction);
  const history = getHistory();
  const entry = history[history.length - 1];
  if (entry.length === 1) {
    entry.push(direction);
  } else {
    entry[1] = direction;
  }
  storeHistory(history);
}

export function trackEncounter(encounter: Encounter): void {
  const name = encounter.getName();
  logEncounter(name);
  const history = getHistory();
  const entry = history[history.length - 1];
  if (entry.length !== 2) {
    entry.push('');
  }
  entry.push(name);
  storeHistory(history);
}

export function hasEncountered(encounter: Encounter): boolean {
  const name = encounter.getName();
  const history = getHistory();
  return !!history.find(entry => entry[2] === name);
}

export function resetHistory(): void {
  storeHistory([]);
  initializeHistory();
}

addStatePropertyListener('path', resetHistory);
