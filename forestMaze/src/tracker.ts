import { DefaultDirection, translateDirection } from './directions.js';
import { Encounter } from './encounters.js';
import { Location } from './locations.js';
import { getHistory, setHistory, setLocation } from './state.js';

export function logHistory(): void {
  const history = getHistory();
  history.forEach(([location, direction, encounter]) => {
    logLocation(location);
    if (encounter) {
      logEncounter(encounter);
    }
    if (direction) {
      logDirection(direction);
    }
  });
}

function logLocation(name: string): void {
  console.log(`Visited ${name}`);
}

function logEncounter(name: string): void {
  console.log(`Encountered ${name}`);
}

function logDirection(name: DefaultDirection): void {
  console.log(`Went ${translateDirection(name)}`);
}

export function trackLocation({ name }: Location, fromPageLoad?: boolean): void {
  logLocation(name);
  const history = getHistory();
  if (fromPageLoad && history.length) {
    return;
  }
  history.push([name]);
  setHistory(history);
  setLocation(name);
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
  setHistory(history);
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
  setHistory(history);
}

export function hasEncountered(encounter: Encounter): boolean {
  const name = encounter.getName();
  const history = getHistory();
  return !!history.find(entry => entry[2] === name);
}
