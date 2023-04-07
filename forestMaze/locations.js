import { roll, randomFrom } from './random.js';
import { getLocation } from './state.js';

export class Location {
  constructor(params = {}) {
    Object.assign(this, params);
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

function generateDirection(location, allLocations, unvisitedLocationNames) {
  if (roll(2) === 2) {
      return;
  }
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

function mapLocation(unvisitedLocationNames, location, _i, array) {
  if (location.notRandom) {
      delete location.notRandom;
      unvisitedLocationNames.delete(location.name);
      return location;
  }

  let result;
  do {
    result = {
      ...location,
      up: generateDirection(location, array, unvisitedLocationNames),
      right: generateDirection(location, array, unvisitedLocationNames),
      down: generateDirection(location, array, unvisitedLocationNames),
      left: generateDirection(location, array, unvisitedLocationNames),
    };
    // Don't allow locations without an exit
  } while (!result.up && !result.right && !result.down && !result.left);
  return result;
}

function findLocation(locations, name, referrer) {
  const location = locations.find(location => location.name === name);
  if (!location) {
    const fromLocation = typeof referrer === 'string' ? referrer : (referrer ?? {}).name;
    throw new Error(fromLocation ? `Location "${fromLocation}" references non-existant "${name}" location` : `No location named "${name}" exists`);
  }
  return location;
}

const directions = ['up', 'right', 'down', 'left'];
function followPaths(locations, location, reachable = new Map()) {
  if (reachable.has(location.name)) {
      return;
  }
  reachable.set(location.name, [,,,]);
  directions.forEach(direction => {
      if (location[direction]) {
          reachable.get(location.name)[directions.indexOf(direction)] = location[direction];
          followPaths(locations, findLocation(locations, location[direction], location), reachable);
      }
  });
  return reachable;
}

export function linkLocations(rawLocations) {
  const usedNames = new Set();
  rawLocations.forEach(({ name }) => {
      if (usedNames.has(name)) {
          throw new Error(`Multiple locations are called "${name}"`);
      }
      usedNames.add(name);
  });
  const allLocationNames = new Set(usedNames);

  let mappedLocations;
  let theMap;
  let valid;
  do {
      valid = true;
      mappedLocations = rawLocations.map(mapLocation.bind(null, usedNames));
      try {
          theMap = followPaths(mappedLocations, mappedLocations[0]);
          const reachableLocations = new Set(theMap.values());
          const unreachableLocations = Array.from(allLocationNames.values()).filter(name => !reachableLocations.has(name));
          if (unreachableLocations.size) {
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
      } catch(e) {
          // try again
          valid = false;
      }
  } while (!valid);

  // for (const [name, links] of theMap.entries()) {
  //   console.log(name, links);
  // }

  window.howDoIGetTo = howDoIGetTo.bind(null, mappedLocations);
  return mappedLocations;
}

function logPath(steps, turns) {
  let path = '';
  for (let i = 0; i < steps.length; i++) {
    path += `${path ? '\n\t-> ' : ''}${steps[i]}${turns[i] ? ` [${turns[i]}]` : ''}`;
  }
  console.log(path);
}

function getDirections(allLocations, startLocationName, targetLocationName) {
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
  const steps = [];
  const turns = [];
  let foundIt = false;
  while (!foundIt) {
    steps.push(currentLocation.name);
    for (const direction of directions) {
      const step = `${currentLocation.name} - ${direction}`;
      if (alreadyChecked.has(step)) {
        continue;
      }
      alreadyChecked.add(`${currentLocation.name} - ${direction}`);
      if (!currentLocation[direction]) {
        continue;
      }
      const nextLocationName = currentLocation[direction];
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
    if (steps[steps.length - 1] === currentLocation.name && directions.every(direction => alreadyChecked.has(`${currentLocation.name} - ${direction}`))) {
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

/**
 * Needs a non-recursive solution or else it may exceed the stack frame limit
 * @param {Location[]} allLocations
 * @param {string} targetLocationName
 */
function howDoIGetTo(allLocations, targetLocationName) {
  const path = getDirections(allLocations, getLocation(), targetLocationName);
  if (!path) {
    return;
  }
  logPath(...path);
}
