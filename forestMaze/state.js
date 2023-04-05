import { health } from './elements.js';
import { getUrlParam } from './getUrlParam.js';

const storageKeyPrefix = `forestMaze_${getUrlParam('path')}`;
const storageKeyLocation = `${storageKeyPrefix}_locationName`;
const storageKeyCharacter = `${storageKeyPrefix}_characterState`;
const storageKeyEncounters = `${storageKeyPrefix}_encounters`;

export function getEncounters() {
  const str = localStorage.getItem(storageKeyEncounters);
  if (!str) {
    return [];
  }
  return JSON.parse(str);
}

export function markEncounter(name) {
  const encounters = getEncounters();
  if (!encounters.includes(name)) {
    encounters.push(name);
    localStorage.setItem(storageKeyEncounters, JSON.stringify(encounters));
  }
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
