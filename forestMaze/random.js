import 'https://cdnjs.cloudflare.com/ajax/libs/seedrandom/3.0.5/seedrandom.min.js';

const seed = new URLSearchParams(window.location.search).get('seed');
if (seed) {
  Math.seedrandom(seed);
}

export function roll(sides) {
  return Math.round((Math.random() * (sides - 1)) + 1);
}

export function randomFrom(list) {
  return list[roll(list.length) - 1];
}
