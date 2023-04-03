import { roll, randomFrom } from './random.js';
import { getTile } from './state.js';

function generateDirection(tile, allTiles, unvisitedTileNames) {
  if (roll(2) === 2) {
      return;
  }
  let destination;
  do {
      if (unvisitedTileNames.size) {
          // Use unvisited tiles first to make sure they're all reachable
          destination = findTile(allTiles, randomFrom(Array.from(unvisitedTileNames.values())), tile);
      } else {
          destination = randomFrom(allTiles);
      }
  } while (destination === tile);
  unvisitedTileNames.delete(destination.name);
  return destination.name;
}

function mapTile(unvisitedTileNames, tile, i, array) {
  if (tile.notRandom) {
      delete tile.notRandom;
      unvisitedTileNames.delete(tile.name);
      return tile;
  }
  return {
      ...tile,
      up: generateDirection(tile, array, unvisitedTileNames),
      right: generateDirection(tile, array, unvisitedTileNames),
      down: generateDirection(tile, array, unvisitedTileNames),
      left: generateDirection(tile, array, unvisitedTileNames),
  };
}

function findTile(tiles, name, referrer) {
  const tile = tiles.find(tile => tile.name === name);
  if (!tile) {
      throw new Error(`Tile ${referrer.name} references non-existant ${name} tile`);
  }
  return tile;
}

const directions = ['up', 'right', 'down', 'left'];
function followTiles(tiles, tile, reachable = new Map()) {
  if (reachable.has(tile.name)) {
      return;
  }
  reachable.set(tile.name, [,,,]);
  directions.forEach(direction => {
      if (tile[direction]) {
          reachable.get(tile.name)[directions.indexOf(direction)] = tile[direction];
          followTiles(tiles, findTile(tiles, tile[direction], tile), reachable);
      }
  });
  return reachable;
}

export function linkTiles(rawTiles) {
  const usedNames = new Set();
  rawTiles.forEach(({ name }) => {
      if (usedNames.has(name)) {
          throw new Error(`Multiple tiles are called "${name}"`);
      }
      usedNames.add(name);
  });
  const allTileNames = new Set(usedNames);

  let mappedTiles;
  let theMap;
  let valid;
  do {
      valid = true;
      mappedTiles = rawTiles.map(mapTile.bind(null, usedNames));
      try {
          theMap = followTiles(mappedTiles, mappedTiles[0]);
          const reachableTiles = new Set(theMap.values());
          const unreachableTiles = Array.from(allTileNames.values()).filter(name => !reachableTiles.has(name));
          if (unreachableTiles.size) {
              throw new Error(`Can't reach ${unreachableTiles.join(', ')}`);
          }
      } catch(e) {
          // try again
          valid = false;
      }
  } while (!valid);

  // for (const [name, links] of theMap.entries()) {
  //   console.log(name, links);
  // }

  window.howDoIGetTo = howDoIGetTo.bind(null, mappedTiles);
  return mappedTiles;
}

function logPath(steps, turns) {
  let path = '';
  for (let i = 0; i < steps.length; i++) {
    path += `${path ? '\n\t-> ' : ''}${steps[i]}${turns[i] ? ` [${turns[i]}]` : ''}`;
  }
  console.log(path);
}

/**
 * Needs a non-recursive solution or else it may exceed the stack frame limit
 * @param {Tile[]} allTiles
 * @param {string} targetName
 */
function howDoIGetTo(allTiles, targetName) {
  const targetTile = findTile(allTiles, targetName, { name: 'howDoIGetTo' });
  if (!targetTile) {
    console.error(`Yah can't get dere from here`);
    return;
  }
  let currentTile = findTile(allTiles, getTile(), { name: 'howDoIGetTo' });
  if (!currentTile) {
    console.error(`I don't know where I am`);
    return;
  }

  const alreadyChecked = new Set();
  const steps = [];
  const turns = [];
  let foundIt = false;
  while (!foundIt) {
    steps.push(currentTile.name);
    for (const direction of directions) {
      const step = `${currentTile.name} - ${direction}`;
      if (alreadyChecked.has(step)) {
        continue;
      }
      alreadyChecked.add(`${currentTile.name} - ${direction}`);
      if (!currentTile[direction]) {
        continue;
      }
      const nextTileName = currentTile[direction];
      if (nextTileName === targetName) {
        steps.push(targetName);
        turns.push(direction);
        foundIt = true;
        break;
      }
      if (steps.includes(nextTileName)) {
        // Looped path
        continue;
      }
      currentTile = findTile(allTiles, nextTileName, currentTile);
      turns.push(direction);
      break;
    }
    if (steps[steps.length - 1] === currentTile.name && directions.every(direction => alreadyChecked.has(`${currentTile.name} - ${direction}`))) {
      steps.pop();
      turns.pop();
      currentTile = findTile(allTiles, steps.pop(), 'howDoIGetTo');
    }
  }

  // const path = pathToTile(allTiles, currentTile, name);
  logPath(steps, turns);
}
