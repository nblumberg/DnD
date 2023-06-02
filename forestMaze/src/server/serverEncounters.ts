import { addStatePropertyListener } from '../shared/state';
import { Encounter } from '../encounters';
import { createEventEmitter } from '../shared/eventEmitter';
import { sendToAllUsers } from './user';

const data: { encounters: Encounter[] } = { encounters: [] };
const { addPropertyListener, removeListener, setData } = createEventEmitter(data);

interface EncounterChangeHandler {
  (encounters: Encounter[]): void;
}

export function getEncounters(): Encounter[] {
  return [...data.encounters];
}

export function addEncountersListener(handler: EncounterChangeHandler): void {
  addPropertyListener('encounters', handler);
}

export function removeEncountersListener(handler: EncounterChangeHandler): void {
  removeListener(handler, 'encounters');
}

export function resolveEncounter(encounter: Encounter): void {
  if (!encounter) {
    return;
  }
  sendToAllUsers({ type: 'encounter', encounter: encounter.name });
}

async function updateEncounters(path: string) {
  const { encounters } = await import(`${path}/encounters.js`);
  setData({ encounters });
  console.log(`Initialized ${encounters.length} encounters`);
}
updateEncounters(addStatePropertyListener('path', updateEncounters));

export function resetEncounters(): void {
  data.encounters.forEach(encounter => delete encounter.resolved);
}
