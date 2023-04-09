import { restart } from './elements.js';
import { onClear, onNavigate, onReset } from './navigate.js';

export function addEventHandlers(locations, encounters) {
  Array.from(document.getElementsByClassName('direction')).forEach(element => {
    element.addEventListener('click', onNavigate.bind(null, locations, encounters));
  });
  restart.addEventListener('click', onReset.bind(null, locations, encounters));
  clear.addEventListener('click', onClear.bind(null, locations, encounters));
}
