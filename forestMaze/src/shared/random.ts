import { addStatePropertyListener } from './state.js';

function setRandomSeed(seed: string) {
  if (seed) {
    (Math as any).seedrandom(seed);
  }
}
setRandomSeed(addStatePropertyListener('seed', setRandomSeed));

export function roll(sides: number) {
  return Math.round((Math.random() * (sides - 1)) + 1);
}

export function randomFrom<T>(list: T[]): T {
  return list[roll(list.length) - 1];
}
