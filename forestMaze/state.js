import { health } from './elements.js';
import { getUrlParam } from './getUrlParam.js';

const storageKeyTile = 'tileName';
const storageTileCharacter = 'characterState';

export function getTile() {
  return getUrlParam('tile') || localStorage.getItem(storageKeyTile);
}

export function setTile(name) {
  localStorage.setItem(storageKeyTile, name);
}

export function resetTile() {
  localStorage.removeItem(storageTileCharacter);
}

export function getState() {
  return JSON.parse(localStorage.getItem(storageTileCharacter) || '{}');
}

export function setState(state = getState()) {
  if (!Object.keys(state).length) {
      return;
  }
  const str = JSON.stringify(state, null, '  ');
  health.innerText = str;
  localStorage.setItem(storageTileCharacter, str);
}
