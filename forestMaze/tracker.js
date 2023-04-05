import { getHistory, setHistory, setLocation } from './state.js';

export function trackLocation({ name }, fromPageLoad) {
  console.log(`Visited ${name}`);
  const history = getHistory();
  if (fromPageLoad && history.length) {
    return;
  }
  history.push([name]);
  setHistory(history);
  setLocation(name);
}

export function trackDirection(direction) {
  console.log(`Went ${direction}`);
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
  console.log(`Encountered ${name}`);
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
