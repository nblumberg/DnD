import { health } from './elements.js';
import { getUrlParam } from './getUrlParam.js';

const storageKeyPrefix = `forestMaze_${getUrlParam('path')}`;
const storageKeyLocation = `${storageKeyPrefix}_locationName`;
const storageKeyCharacter = `${storageKeyPrefix}_characterState`;

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
  return JSON.parse(localStorage.getItem(storageKeyCharacter) || '{}');
}

export function setState(state = getState()) {
  if (!Object.keys(state).length) {
      return;
  }
  const str = JSON.stringify(state, null, '  ');
  health.innerText = str;
  localStorage.setItem(storageKeyCharacter, str);
}
