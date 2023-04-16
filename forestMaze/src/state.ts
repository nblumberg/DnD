import { DefaultDirection } from './directions.js';
import { getUrlParam } from './getUrlParam.js';
import { showState } from './showState.js';

const storageKeyPrefix = `forestMaze_${getUrlParam('path')}`;
const storageKeyHistory = `${storageKeyPrefix}_history`;
const storageKeyHistoryNames = `${storageKeyPrefix}_history_names`;
const storageKeyLocation = `${storageKeyPrefix}_locationName`;
const storageKeyTide = `${storageKeyPrefix}_tide`;
const storageKeyCharacter = `${storageKeyPrefix}_characterState`;

type HistoryEntry = [string] | [string, DefaultDirection] | [string, DefaultDirection, string];
type History = HistoryEntry[];
type HistoryIndex = [number, number | '', number | ''];

export function getHistory(): History {
  const str = localStorage.getItem(storageKeyHistory);
  if (!str) {
    return [];
  }
  const indices: HistoryIndex[] = JSON.parse(str);
  const names: string[] = JSON.parse(localStorage.getItem(storageKeyHistoryNames) || '[]');
  return indices.map(
    indexRow =>
      indexRow.map(index => typeof index === 'number' ? names[index] : index
    ).slice(0, 3) as HistoryEntry
  ) as History;
}

/**
 * Use indices into an array of names to save space for repeated locations/encounters/directions
 * and to allow the locations/encounters to change after written to location storage
 */
export function setHistory(history: History): void {
  const indexMap = new Map<string, number>();
  const names: string[] = [];
  const indices = history.map(entry => entry.map(name => {
    if (!name) {
      return '';
    }
    if (indexMap.has(name)) {
      return indexMap.get(name)!;
    }
    const index = names.length;
    indexMap.set(name, index);
    names.push(name);
    return index;
  }));
  localStorage.setItem(storageKeyHistoryNames, JSON.stringify(names));
  localStorage.setItem(storageKeyHistory, JSON.stringify(indices));
}

function resetHistory(): void {
  localStorage.removeItem(storageKeyHistoryNames);
  localStorage.removeItem(storageKeyHistory);
}

export function getLocation(): string | null {
  return getUrlParam('location') || localStorage.getItem(storageKeyLocation);
}

export function setLocation(name: string): void {
  localStorage.setItem(storageKeyLocation, name);
}

export function resetLocation(): void {
  localStorage.removeItem(storageKeyCharacter);
}

export type StateValue = number | [string, number]; // damage or [effect, duration]
export type State = Record<string, StateValue>;

export function getState(): State {
  return JSON.parse(localStorage.getItem(storageKeyCharacter) || '{"hours":0,"minutes":0}');
}

export function setState(state = getState()): void {
  if (!Object.keys(state).length) {
    return;
  }
  showState(state);
  const str = JSON.stringify(state, null, '  ');
  localStorage.setItem(storageKeyCharacter, JSON.stringify(state, null, '  '));
}

function resetState(): void {
  localStorage.removeItem(storageKeyCharacter);
}

type Tide = 'low' | 'high';
export function getTide(): Tide {
  const value = localStorage.getItem(storageKeyTide);
  if (value && value !== 'low' && value !== 'high') {
    throw new Error(`Invalid tide value ${value}`);
  }
  return value as Tide ?? 'low';
}

export function setTide(level: Tide = 'low'): void {
  localStorage.setItem(storageKeyTide, level);
}

function resetTide(): void {
  localStorage.removeItem(storageKeyTide);
}

export function resetAll(): void {
  resetHistory();
  resetLocation();
  resetState();
  resetTide();
  showState(getState());
}
