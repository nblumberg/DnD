import { CharacterState, CharacterStateValue, addCharacterStateListener } from '../shared/characterState.js';
import { status } from './elements.js';

function showCharacterState(state: CharacterState) {
  status.innerHTML = '';

  const stats = document.createElement('dl');
  const { hours, minutes } = state;
  createStat(stats, ['time', `${hours} hrs ${minutes} min`]);
  Object.entries(state)
    .filter(([key]) => key !== 'hours' && key !== 'minutes')
    .forEach(createStat.bind(null, stats));

  status.appendChild(stats);
}

addCharacterStateListener(showCharacterState);

function createStat(parent: HTMLElement, [key, value]: [string, string | CharacterStateValue]): void {
  const dt = document.createElement('dt');
  dt.innerText = key;
  parent.appendChild(dt);

  const dd = document.createElement('dd');
  if (Array.isArray(value)) {
    const text = value[0];
    const duration = value[1];
    dd.innerText = `${text} ${duration} min`;
  } else {
    dd.innerText = `${value}`;
  }
  parent.appendChild(dd);
}
