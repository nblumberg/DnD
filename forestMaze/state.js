import { status } from './elements.js';
import { getUrlParam } from './getUrlParam.js';
import { showState } from './showState.js';

const storageKeyPrefix = `forestMaze_${getUrlParam('path')}`;
const storageKeyLocation = `${storageKeyPrefix}_locationName`;
const storageKeyCharacter = `${storageKeyPrefix}_characterState`;
const storageKeyHistory = `${storageKeyPrefix}_history`;
const storageKeyHistoryNames = `${storageKeyPrefix}_history_names`;

export function getHistory() {
  const str = localStorage.getItem(storageKeyHistory);
  if (!str) {
    return [];
  }
  const indices = JSON.parse(str);
  const names = JSON.parse(localStorage.getItem(storageKeyHistoryNames));
  return indices.map(entry => entry.map(index => typeof index === 'number' ? names[index] : index));
}

/**
 * Use indices into an array of names to save space for repeated locations/encounters/directions
 * and to allow the locations/encounters to change after written to location storage
 */
export function setHistory(history) {
  const indexMap = new Map();
  const names = [];
  const indices = history.map(entry => entry.map(name => {
    if (!name) {
      return '';
    }
    if (indexMap.has(name)) {
      return indexMap.get(name);
    }
    const index = names.length;
    indexMap.set(name, index);
    names.push(name);
    return index;
  }));
  localStorage.setItem(storageKeyHistoryNames, JSON.stringify(names));
  localStorage.setItem(storageKeyHistory, JSON.stringify(indices));
}

export function getLocation() {
  return getUrlParam('location') || localStorage.getItem(storageKeyLocation);
}

export function setLocation(name) {
  localStorage.setItem(storageKeyLocation, name);
}

export function resetLocation() {
  localStorage.removeItem(storageKeyCharacter);
}

export function getState() {
  return JSON.parse(localStorage.getItem(storageKeyCharacter) || '{"hours":0,"minutes":0}');
}

export function setState(state = getState()) {
  if (!Object.keys(state).length) {
      return;
  }
  showState(state);
  const str = JSON.stringify(state, null, '  ');
  localStorage.setItem(storageKeyCharacter, JSON.stringify(state, null, '  '));
}
