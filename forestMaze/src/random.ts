import 'https://cdnjs.cloudflare.com/ajax/libs/seedrandom/3.0.5/seedrandom.min.js';
import { getUrlParam } from './getUrlParam.js';

const seed = getUrlParam('seed');
if (seed) {
  (Math as any).seedrandom(seed);
}

export function roll(sides: number) {
  return Math.round((Math.random() * (sides - 1)) + 1);
}

export function randomFrom<T>(list: T[]): T {
  return list[roll(list.length) - 1];
}
