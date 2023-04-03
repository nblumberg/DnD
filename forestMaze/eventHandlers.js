import { onNavigate, onReset } from './navigate.js';

export function addEventHandlers(tiles, encounters) {
  Array.from(document.getElementsByClassName('direction')).forEach(element => {
    element.addEventListener('click', onNavigate.bind(null, tiles, encounters));
  });
  restart.addEventListener('click', onReset.bind(null, tiles, encounters));
}
