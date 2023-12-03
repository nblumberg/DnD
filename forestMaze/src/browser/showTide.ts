import { Tide, addStatePropertyListener } from '../shared/state.js';

export function showTide(tide: Tide): void {
  document.body.classList[tide === 'high' ? 'add' : 'remove']('highTide');
}

addStatePropertyListener('tide', showTide);
