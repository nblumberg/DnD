import { getHistory, setHistory, setLocation } from './state.js';

export function logHistory() {
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

function logLocation(name) {
  console.log(`Visited ${name}`);
}

function logEncounter(name) {
  console.log(`Encountered ${name}`);
}

function logDirection(name) {
  console.log(`Went ${name}`);
}

export function trackLocation({ name }, fromPageLoad) {
  logLocation(name);
  const history = getHistory();
  if (fromPageLoad && history.length) {
    return;
  }
  history.push([name]);
  setHistory(history);
  setLocation(name);
}

export function trackDirection(direction) {
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

export function trackEncounter(encounter) {
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

export function hasEncountered(encounter) {
  const name = encounter.getName();
  const history = getHistory();
  return history.find(entry => entry[2] === name);
}
