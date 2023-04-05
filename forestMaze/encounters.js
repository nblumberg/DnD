import { getUrlParam } from './getUrlParam.js';
import { randomFrom, roll } from './random.js';
import { showImage } from './showImage.js';
import { getState, setState } from './state.js';
import { hasEncountered, trackEncounter } from './tracker.js';

export class Encounter {
  static count = 1;

  constructor(params) {
    Object.entries(params).forEach(([name, value]) => {
      if (Object.prototype.hasOwnProperty.call(Encounter.prototype, name)) {
        console.warn(`Encounter constructor params trying to overwrite ${name}`);
        return;
      }
      this[name] = value;
    });
    if (!this.name) {
      this.name = `Unknown Encounter ${count++}`;
    }
    if (this.onlyOnce && hasEncountered(this)) {
      this.resolved = true;
    }
  }

  getName() {
    return typeof this.name === 'function' ? this.name() : this.name;
  }

  getDescription() {
    return typeof this.description === 'function' ? this.description() : this.description;
  }

  // Override this, but call it with super.valid(), in subclasses
  valid(_location) {
    // Support unique encounters that can happen only once
    return !this.onlyOnce || !this.resolved;
  }

  async show(location) {
    trackEncounter(this);
    const { image } = this;
    if (image) {
        await showImage(image)
    }
    await this.resolve();
    if (image) {
        showImage(location.src, location.rotate);
    }
  }

  resolve() {
    const { dc, failure } = this;
    const description = this.getDescription();
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
        this.resolved = true;
        const name = this.getName();
        resolve();
    });
  }
}

export class ForcedEncounter extends Encounter {
  valid(location) {
    return super.valid(location) && location.forcedEncounter === this.name;
  }
}

const randomEncounterChance = parseInt(getUrlParam('encounter'), 10) || 16;

function validEncounters(encounters, location) {
  return encounters.filter(encounter => encounter.valid(location));
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

  let encounter;
  if (forcedEncounter) {
      encounter = encounters.find((encounter) => encounter.name === forcedEncounter && encounter.valid(location));
  } else {
    encounter = randomEncounter(encounters, location);
  }
  if (encounter) {
    await encounter.show(location);
  }
}
