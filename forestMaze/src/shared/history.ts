import { Encounter } from '../encounters.js';
import { DefaultDirection, translateDirection } from './directions.js';

type HistoryEntry = [string] | [string, DefaultDirection] | [string, DefaultDirection, string];
export type History = HistoryEntry[];
type HistoryIndex = [number, number | '', number | ''];

export const history: History = [];

export function logLocation(name: string): void {
  console.log(`Visited ${name}`);
}

export function logEncounter(name: string): void {
  console.log(`Encountered ${name}`);
}

export function logDirection(name: DefaultDirection): void {
  console.log(`Went ${translateDirection(name)}`);
}

export function hasEncountered(encounter: Encounter): boolean {
  const name = encounter.getName();
  return !!history.find(entry => entry[2] === name);
}
