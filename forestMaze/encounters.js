import { randomFrom, roll } from './random.js';
import { showImage } from './showImage.js';
import { getState, setState } from './state.js';

const randomEncounterChance = 16;

function validEncounters(encounters, tile) {
  return encounters.map(encounterFn => encounterFn(tile)).filter(encounterData => !!encounterData);
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

async function showEncounter(encounter, tile) {
  if (!encounter) {
    return;
  }
  const { image } = encounter;
  if (image) {
      await showImage(image)
  }
  await resolveEncounter(encounter);
  if (image) {
      showImage(tile.src, tile.rotate);
  }
}

function randomEncounter(encounters, tile) {
  if (roll(20) < randomEncounterChance) {
    return;
  }
  const valid = validEncounters(encounters, tile);
  if (valid.length) {
    return randomFrom(valid);
  }
}

export async function generateEncounter(encounters, tile) {
  if (!encounters || !encounters.length) {
    alert(`No encounter data found!`);
    return;
  }
  const {
    forcedEncounter = false,
    noEncounters = false,
  } = tile;
  if (noEncounters) {
    return;
  }

  if (forcedEncounter) {
      const encounterFn = encounters.find(encounterFn => (encounterFn(tile) ?? {}).name === forcedEncounter);
      if (encounterFn) {
          const encounter = encounterFn(tile);
          if (encounter) {
              await showEncounter(encounter, tile);
          }
      }
  } else {
    const encounter = randomEncounter(encounters, tile);
    if (encounter) {
      await showEncounter(encounter, tile);
    }
  }
}
