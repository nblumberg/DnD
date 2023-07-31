import { Encounter, EncounterParams } from '../encounters.js';
import { characterState, setCharacterState } from '../shared/characterState.js';
import { ServerToBrowserSocketMessage } from '../shared/socketTypes.js';
import { addStatePropertyListener } from '../shared/state.js';
import { registerWebSocketHandler, send } from './browserSockets.js';
import { displayLock } from './displayLock.js';
import { disableDirections, enableDirections } from './showDirections.js';
import { showImage } from './showImage.js';
import { getLocation, showCurrentLocation } from './showLocation.js';
import { getPlayerFeedback, getPlayerRoll, showText } from './showText.js';

interface EncountersSocketMessage extends ServerToBrowserSocketMessage {
  encounters: EncounterParams[];
}

const encounters: Encounter[] = [];
let currentEncounter: Encounter | undefined;

// registerWebSocketHandler('encounters', (message) => {
//   const { encounters: newEncounters } = message as EncountersSocketMessage;
//   encounters.length = 0;
//   newEncounters.forEach(params => encounters.push(new Encounter(params)));
//   currentEncounter = getEncounter(addStatePropertyListener('encounter', (encounterIdAndName: string) => {
//     currentEncounter = getEncounter(encounterIdAndName);
//     showEncounter(currentEncounter);
//   }));
//   if (currentEncounter) {
//     showEncounter(currentEncounter);
//   }
// });

async function updateEncounters(path: string) {
  const qualifiedPath = `${path}/encounters.js`;
  const { encounters: newEncounters } = await import(qualifiedPath);
  encounters.push(...newEncounters);
  console.log(`Initialized ${encounters.length} encounters`);
  currentEncounter = getEncounter(addStatePropertyListener('encounter', (encounterIdAndName: string) => {
    currentEncounter = getEncounter(encounterIdAndName);
    if (currentEncounter) {
      showEncounter(currentEncounter);
    }
  }));
  if (currentEncounter) {
    showEncounter(currentEncounter);
  }
}
updateEncounters(addStatePropertyListener('path', updateEncounters));


function getEncounter(idAndName: string): Encounter | undefined {
  if (!idAndName) {
    return;
  }
  const id = `${parseInt(idAndName, 10)}`;
  const encounter = encounters.find(encounter => encounter.id === id);
  if (!encounter) {
    throw new Error(`Could not find encounter ${id}`);
  }
  return encounter;
}

async function showEncounter(arg: Encounter | string): Promise<void> {
  let encounter: Encounter | undefined;
  if (typeof arg === 'string') {
    encounter = getEncounter(arg);
    if (!encounter) {
      console.warn(`Can't find encounter ${arg}`);
      return;
    }
  } else {
    encounter = arg;
  }

  if (encounter.resolved && encounter.onlyOnce) {
    return;
  }

  const displayKey = { unlock: () => {} };
  await displayLock(displayKey);

  try {
    const location = getLocation();
    if (!location) {
      throw new Error(`Received encounter ${encounter.name} but lack a Location`);
    }

    disableDirections();
    // trackEncounter(enableDirections);
    const { image } = encounter;
    if (image) {
      await showImage(image)
    }
    await resolveEncounter(encounter);
    enableDirections();
  } finally {
    displayKey.unlock();
    showCurrentLocation();
  }
}

(window as any).showEncounter = showEncounter;

async function resolveEncounter(encounter: Encounter) {
  let { failure, feedback } = encounter;
  let description: string | undefined = encounter.getDescription();
  let status;

  while (failure) {
    const savingThrow = await getPlayerRoll(description ?? '');
    ({ failure, description, status } = failure(savingThrow) ?? {});
    if (status) {
      const [key, value, duration] = status;
      const state = { ...characterState };
      state[key] = typeof duration === 'number' ? [value as string, duration] : value as number;
      setCharacterState(state);
    }
  }
  while (feedback) {
    const answer = await getPlayerFeedback(description ?? '');
    ({ feedback, description, status } = feedback(answer) ?? {});
    if (status) {
      const [key, value, duration] = status;
      const state = { ...characterState };
      state[key] = typeof duration === 'number' ? [value as string, duration] : value as number;
      setCharacterState(state);
    }
  }
  if (description) {
    await showText(description);
  }
  encounter.resolved = true;
  // TODO: send resolution to server
  send({ type: 'resolveEncounter', encounter: encounter.id });
}

export async function showCurrentEncounter() {
  if (currentEncounter) {
    showEncounter(currentEncounter);
  }
}

async function handleEncounter(message?: ServerToBrowserSocketMessage): Promise<void> {
  if (!message) {
    return;
  }

  const { encounter: encounterIdAndName } = message as unknown as { encounter: string };
  return showEncounter(encounterIdAndName);
}

registerWebSocketHandler('encounter', handleEncounter);
