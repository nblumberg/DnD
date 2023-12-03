import { DefaultDirection, defaultDirections, translateDirection } from './shared/directions.js';
import { randomFrom, roll } from './shared/random.js';
import { addStatePropertyListener } from './shared/state.js';

export interface LocationParams {
  battleMap?: true;
  description?: string;
  down?: string;
  forcedEncounter?: string | RegExp;
  left?: string;
  name: string;
  noEncounters?: true;
  notRandom?: true;
  right?: string;
  rotate?: number;
  start?: true;
  src: string;
  up?: string;
}

export class Location {
  battleMap?: true;
  description?: string;
  down?: string;
  forcedEncounter?: string | RegExp;
  left?: string;
  name: string;
  noEncounters?: true;
  notRandom?: true;
  right?: string;
  rotate?: number;
  start?: true;
  src: string;
  up?: string;

  constructor(params: LocationParams) {
    const allowedParams = Object.fromEntries(Object.entries(params).filter(([name]) => {
      if (Object.prototype.hasOwnProperty.call(Location.prototype, name)) {
        console.warn(`Location constructor params trying to overwrite ${name}`);
        return false;
      }
      return true;
    }));
    this.name = params.name;
    this.description = params.description;
    this.src = params.src;
    Object.assign(this, allowedParams);
  }

  encounterLess() {
    this.noEncounters = true;
    return this;
  }

  setBattleMap() {
    this.battleMap = true;
    return this;
  }
}

let currentLocation = addStatePropertyListener('location', (newLocation: string) => {
  currentLocation = newLocation;
});

function generateDirection(location: Location, allLocations: Location[], unvisitedLocationNames: Set<string>) {
  let destination;
  do {
    if (unvisitedLocationNames.size) {
      // Use unvisited locations first to make sure they're all reachable
      destination = findLocation(allLocations, randomFrom(Array.from(unvisitedLocationNames.values())), location);
    } else {
      destination = randomFrom(allLocations);
    }
  } while (destination === location);
  unvisitedLocationNames.delete(destination.name);
  return destination.name;
}

function mapLocation(unvisitedLocationNames: Set<string>, location: Location, _i: number, array: Location[]): Location {
  if (location.notRandom) {
    unvisitedLocationNames.delete(location.name);
    return location;
  }

  const exitCount = roll(4);
  const exits = new Set<DefaultDirection>();
  while (exits.size < exitCount) {
    exits.add(randomFrom(defaultDirections));
  }
  const randomLocations = array.filter(({ notRandom }) => !notRandom);
  for (const dir of exits.values()) {
    if (location[dir]) {
      location[dir] = location[dir];
    } else {
      location[dir] = generateDirection(location, randomLocations, unvisitedLocationNames);
    }
  }
  return location;
}

function findLocation(locations: Location[], name: string, referrer?: string | { name: string }) {
  const location = locations.find(location => location.name === name);
  if (!location) {
    const fromLocation = typeof referrer === 'string' ? referrer : (referrer ?? {}).name;
    throw new Error(fromLocation ? `Location "${fromLocation}" references non-existant "${name}" location` : `No location named "${name}" exists`);
  }
  return location;
}

type LocationMap = Map<string, [string | undefined, string | undefined, string | undefined, string | undefined]>;

function followPaths(locations : Location[], location: Location, reachable = new Map()): undefined | LocationMap {
  if (reachable.has(location.name)) {
    return;
  }
  reachable.set(location.name, [, , ,]);
  defaultDirections.forEach(direction => {
    if (!location[direction]) {
      return;
    }

    const dir = location[direction]!;
    reachable.get(location.name)[defaultDirections.indexOf(direction)] = location[direction];
    followPaths(locations, findLocation(locations, dir, location), reachable);
  });
  return reachable;
}

export function linkLocations(rawLocations: Location[]) {
  const usedNames = new Set<string>();
  rawLocations.forEach(({ name }) => {
    if (usedNames.has(name)) {
      throw new Error(`Multiple locations are called "${name}"`);
    }
    usedNames.add(name);
  });
  const allLocationNames = new Set<string>(usedNames);
  const unvisitedLocations = new Set<string>(rawLocations.filter(({ notRandom }) => !notRandom).map(({ name }) => name));

  let mappedLocations: Location[];
  let theMap: LocationMap | undefined;
  let valid;
  do {
    valid = true;
    mappedLocations = rawLocations.map((loc, i, array) => mapLocation(unvisitedLocations, loc, i, array));
    try {
      theMap = followPaths(mappedLocations, mappedLocations[0]);
      if (!theMap) {
        throw new Error('Failed to follow paths');
      }
      const reachableLocations = new Set(theMap.keys());
      const unreachableLocations = Array.from(allLocationNames.values()).filter(name => !reachableLocations.has(name));
      if (unreachableLocations.length) {
        throw new Error(`Can't reach ${unreachableLocations.join(', ')}`);
      }
      // for (const startLocation of mappedLocations) {
      //   for (const endLocation of mappedLocations) {
      //     if (startLocation === endLocation) {
      //       continue;
      //     }
      //     const path = getDirections(mappedLocations, startLocation.name, endLocation.name);
      //     if (!path) {
      //       throw new Error(`Can't get from ${startLocation.name} to ${endLocation.name}`);
      //     } else {
      //       console.log(`"${startLocation.name}" -> "${endLocation.name}" √`);
      //     }
      //   }
      // }
    } catch (e) {
      // try again
      valid = false;
    }
  } while (!valid);

  // for (const [name, links] of theMap.entries()) {
  //   console.log(name, links);
  // }

  return mappedLocations;
}

export function getDirections(allLocations: Location[], startLocationName: string, targetLocationName: string): undefined | [string[], DefaultDirection[]] {
  const targetLocation = findLocation(allLocations, startLocationName, { name: 'howDoIGetTo' });
  if (!targetLocation) {
    console.error(`Yah can't get dere from here`);
    return;
  }
  let currentLocation = findLocation(allLocations, startLocationName, { name: 'howDoIGetTo' });
  if (!currentLocation) {
    console.error(`I don't know where I am`);
    return;
  }

  const alreadyChecked = new Set();
  const steps: string[] = [];
  const turns: DefaultDirection[] = [];
  let foundIt = false;
  while (!foundIt) {
    steps.push(currentLocation.name);
    for (const direction of defaultDirections) {
      const step = `${currentLocation.name} - ${direction}`;
      if (alreadyChecked.has(step)) {
        continue;
      }
      alreadyChecked.add(`${currentLocation.name} - ${direction}`);
      if (!currentLocation[direction]) {
        continue;
      }
      const nextLocationName = currentLocation[direction];
      if (!nextLocationName) {
        continue;
      }
      if (nextLocationName === targetLocationName) {
        steps.push(targetLocationName);
        turns.push(direction);
        foundIt = true;
        break;
      }
      if (steps.includes(nextLocationName)) {
        // Looped path
        continue;
      }
      currentLocation = findLocation(allLocations, nextLocationName, currentLocation);
      turns.push(direction);
      break;
    }
    if (steps[steps.length - 1] === currentLocation.name && defaultDirections.every(direction => alreadyChecked.has(`${currentLocation.name} - ${direction}`))) {
      steps.pop(); // failed location
      turns.pop();
      const previousLocation = steps.pop();
      if (!previousLocation) {
        // We've exhausted all options
        break;
      }
      // Try again starting from the previous location
      currentLocation = findLocation(allLocations, previousLocation, 'howDoIGetTo');
    }
  }
  if (foundIt) {
    return [steps, turns];
  }
}

