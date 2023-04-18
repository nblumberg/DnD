import { disableDirections, enableDirections } from './elements.js';
import { getUrlParam } from './getUrlParam.js';
import { Location } from './locations.js';
import { randomFrom, roll } from './random.js';
import { showImage } from './showImage.js';
import { getPlayerRoll, showText } from './showText.js';
import { getState, setState } from './state.js';
import { hasEncountered, trackEncounter } from './tracker.js';

type dynamicString = string | (() => string);
type Status = [string, number] | [string, string, number]; // type, damage, OR type, effect, duration
interface EncounterResult {
  failure?: Failure;
  description?: string;
  status?: Status;
}
export interface Failure {
  (savingThrow: number): EncounterResult | undefined;
}

export interface EncounterParams {
  name: dynamicString;
  description: dynamicString;
  failure?: Failure;
  image?: string;
  onlyOnce?: true;
  resolved?: true;
}

export class Encounter {
  static count = 1;

  name: dynamicString;
  description: dynamicString;
  failure?: Failure;
  image?: string;
  onlyOnce?: true;
  resolved?: true;

  constructor(params: EncounterParams) {
    const allowedParams = Object.fromEntries(Object.entries(params).filter(([name]) => {
      if (Object.prototype.hasOwnProperty.call(Encounter.prototype, name)) {
        console.warn(`Encounter constructor params trying to overwrite ${name}`);
        return false;
      }
      return true;
    }));
    this.name = params.name;
    this.description = params.description;
    this.image = params.image;
    Object.assign(this, allowedParams);
    if (!this.name) {
      this.name = `Unknown Encounter ${Encounter.count++}`;
    }
    if (!this.description) {
      this.description = '';
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
  valid(_location: Location) {
    // Support unique encounters that can happen only once
    return !this.onlyOnce || !this.resolved;
  }

  async show(location: Location) {
    disableDirections();
    trackEncounter(this);
    const { image } = this;
    if (image) {
      await showImage(image)
    }
    await this.resolve();
    if (image) {
      showImage(location.src, location.rotate);
    }
    enableDirections();
  }

  async resolve() {
    let { failure } = this;
    let description: string | undefined = this.getDescription();
    let status;

    while (failure) {
      const savingThrow: number = await getPlayerRoll(description ?? '');
      ({ failure, description, status } = failure(savingThrow) ?? {});
      if (status) {
        const [key, value, duration] = status;
        const state = getState();
        state[key] = typeof duration === 'number' ? [value as string, duration] : value as number;
        setState(state);
      }
    }
    if (description) {
      await showText(description);
    }
    this.resolved = true;
  }
}

export class ForcedEncounter extends Encounter {
  valid(location: Location) {
    return super.valid(location) && location.forcedEncounter === this.name;
  }
}

export function makeSavingThrow(dc: number, failure: Failure, success?: () => EncounterResult): Failure {
  return (savingThrow: number) => {
    if (savingThrow >= dc) {
      return success ? success() : undefined;
    }
    return failure(savingThrow);
  };
}

export function takeDamage(
  {
    description,
    damage = 0,
    damageRoll,
    damageType
  }:
  {
    description?: string,
    damage?: number,
    damageRoll?: number,
    damageType?: string
  }
): () => EncounterResult | undefined {
  return () => {
    if (damageRoll) {
      damage += roll(damageRoll);
    }
    if (damage) {
      const fullDescription = `${description ? `${description} ` : ''}Take ${damage}${damageType ? ` ${damageType}` : ''} damage.`;
      return {
        description: fullDescription,
        status: [damageType || 'damage', damage]
      };
    }
  };
}

const randomEncounterChance = parseInt(getUrlParam('encounter') ?? '', 10) || 13;

function validEncounters(encounters: Encounter[], location: Location): Encounter[] {
  return encounters.filter(encounter => encounter.valid(location));
}

/**
 * Find matching Encounters by name
 * @param {boolean} ignoreValid Don't bother testing Encounter.valid()
 */
function findEncounters(encounters: Encounter[], name: string | RegExp, location: Location, ignoreValid = false): Encounter[] {
  return encounters.filter((encounter) => {
    if (typeof name === 'string') {
      if (encounter.getName() !== name) {
        return false;
      }
    } else if (name instanceof RegExp) {
      if (!name.test(encounter.getName())) {
        return false;
      }
    } else {
      return false;
    }
    if (ignoreValid) {
      return true;
    }
    return encounter.valid(location);
  });
}

/**
 * Find a matching Encounter by name, if multiple match a RegExp, return one at random
 * @param {boolean} ignoreValid Don't bother testing Encounter.valid()
 */
export function findEncounter(encounters: Encounter[], name: string | RegExp, location: Location, ignoreValid = false): Encounter | undefined {
  const matches = findEncounters(encounters, name, location, ignoreValid);
  if (!matches || !matches.length) {
    return undefined;
  }
  return randomFrom(matches);
}

function randomEncounter(encounters: Encounter[], location: Location): Encounter | undefined {
  if (roll(20) < randomEncounterChance) {
    return;
  }
  const valid = validEncounters(encounters, location);
  if (valid.length) {
    return randomFrom(valid);
  }
}

export async function generateEncounter(encounters: Encounter[], location: Location): Promise<Encounter | void> {
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
    encounter = findEncounter(encounters, forcedEncounter, location);
  } else {
    encounter = randomEncounter(encounters, location);
  }
  if (encounter) {
    await encounter.show(location);
  }
}

export async function showEncounter(encounters: Encounter[], location: Location, name: string, ignoreValid = true): Promise<void> {
  const encounter = findEncounter(encounters, name, location, ignoreValid);
  if (!encounter) {
    console.warn(`Can't find encounter ${name}`);
    return;
  }
  return encounter.show(location);
}