import { registerWebSocketHandler } from './browserSockets.js';
import { disableDirections, enableDirections } from './elements.js';
import { Encounter, EncounterParams } from '../encounters.js';
import { characterState, setCharacterState } from '../shared/characterState.js';
import { ServerToBrowserSocketMessage } from '../shared/socketTypes.js';
import { showImage } from './showImage.js';
import { getPlayerRoll, showText } from './showText.js';
import { AsyncKey, createAsyncLock } from './asyncLock.js';
import { getLocation } from './showLocation.js';

interface EncountersSocketMessage extends ServerToBrowserSocketMessage {
  encounters: EncounterParams[];
}

const encounters: Encounter[] = [];

registerWebSocketHandler('encounters', (message) => {
  const { encounters: newEncounters } = message as EncountersSocketMessage;
  encounters.length = 0;
  newEncounters.forEach(params => encounters.push(new Encounter(params)));
});

function getEncounter(name: string): Encounter {
  const encounter = encounters.find(encounter => encounter.name === name);
  if (!encounter) {
    throw new Error(`Could not find encounter ${name}`);
  }
  return encounter;
}

const asyncLockKey: AsyncKey = {
  unlock: () => {}, // will be replaced by createAsyncLock()
};
export const waitOnEncounterDisplay = createAsyncLock(asyncLockKey);


async function showEncounter(encounterName: string): Promise<void> {
  const encounter = getEncounter(encounterName);
  if (!encounter) {
    console.warn(`Can't find encounter ${encounterName}`);
    return;
  }

  await waitOnEncounterDisplay();

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

  asyncLockKey.unlock();
}

(window as any).showEncounter = showEncounter;

async function handleEncounter(message?: ServerToBrowserSocketMessage): Promise<void> {
  if (!message) {
    return;
  }

  const { encounter: encounterName } = message as unknown as { encounter: string };
  return showEncounter(encounterName);
}

registerWebSocketHandler('encounter', handleEncounter);

async function resolveEncounter(encounter: Encounter) {
  let { failure } = encounter;
  let description: string | undefined = encounter.getDescription();
  let status;

  while (failure) {
    const savingThrow: number = await getPlayerRoll(description ?? '');
    ({ failure, description, status } = failure(savingThrow) ?? {});
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
}
