import 'https://cdnjs.cloudflare.com/ajax/libs/seedrandom/3.0.5/seedrandom.min.js';
import { getUrlParam } from './getUrlParam';


const seed = getUrlParam('seed');
if (seed) {
  Math.seedrandom(seed);
}

export function roll(sides) {
  return Math.round((Math.random() * (sides - 1)) + 1);
}

export function randomFrom(list) {
  return list[roll(list.length) - 1];
}