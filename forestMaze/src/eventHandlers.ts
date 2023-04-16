import { clear, restart } from './elements.js';
import type { Encounter } from './encounters.js';
import type { Location } from './locations.js';
import { onClear, onNavigate, onReset } from './navigate.js';

export function addEventHandlers(locations: Location[], encounters: Encounter[]): void {
  Array.from(document.getElementsByClassName('direction')).forEach(element => {
    element.addEventListener('click', onNavigate.bind(null, locations, encounters));
  });
  restart.addEventListener('click', onReset.bind(null, locations, encounters));
  clear.addEventListener('click', onClear.bind(null, locations, encounters));
}
