import { randomFrom, roll } from './random.js';
import { showImage } from './showImage.js';
import { getState, setState } from './state.js';

const randomEncounterChance = 16;

function validEncounters(encounters, location) {
  return encounters.map(encounterFn => encounterFn(location)).filter(encounterData => !!encounterData);
}

function resolveEncounter(encounter) {
  const { description, dc, failure } = encounter;
  return new Promise(resolve => {
      if (dc) {
          const savingThrow = parseInt(prompt(description), 10);
          if (savingThrow < dc) {
              const damage = roll(failure.roll);
              alert(`${failure.description}${!Number.isNaN(damage) ? ` Take ${damage} ${failure.type} damage.` : ''}`);
              if (!Number.isNaN(damage)) {
                const state = getState();
                state[failure.type] = (state[failure.type] || 0) + damage;
                setState(state);
              }
          }
      } else {
          alert(description);
      }
      encounter.resolved = true;
      resolve();
  });
}

async function showEncounter(encounter, location) {
  if (!encounter) {
    return;
  }
  const { image } = encounter;
  if (image) {
      await showImage(image)
  }
  await resolveEncounter(encounter);
  if (image) {
      showImage(location.src, location.rotate);
  }
}

function randomEncounter(encounters, location) {
  if (roll(20) < randomEncounterChance) {
    return;
  }
  const valid = validEncounters(encounters, location);
  if (valid.length) {
    return randomFrom(valid);
  }
}

export async function generateEncounter(encounters, location) {
  if (!encounters || !encounters.length) {
    alert(`No encounter data found!`);
    return;
  }
  const {
    forcedEncounter = false,
    noEncounters = false,
  } = location;
  if (noEncounters) {
    return;
  }

  if (forcedEncounter) {
      const encounterFn = encounters.find(encounterFn => (encounterFn(location) ?? {}).name === forcedEncounter);
      if (encounterFn) {
          const encounter = encounterFn(location);
          if (encounter) {
              await showEncounter(encounter, location);
          }
      }
  } else {
    const encounter = randomEncounter(encounters, location);
    if (encounter) {
      await showEncounter(encounter, location);
    }
  }
}

export function createForcedEncounter(data) {
  const { name, onlyOnce } = data;
  return ({ forcedEncounter }) => (forcedEncounter !== name || (onlyOnce && data.resolved) ? null : data);
}
