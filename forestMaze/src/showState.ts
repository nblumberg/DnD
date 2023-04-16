import { status } from './elements.js';
import { State, StateValue } from './state.js';

export function showState(state: State) {
  status.innerHTML = '';

  const stats = document.createElement('dl');
  const { hours, minutes } = state;
  createStat(stats, ['time', `${hours} hrs ${minutes} min`]);
  Object.entries(state)
    .filter(([key]) => key !== 'hours' && key !== 'minutes')
    .forEach(createStat.bind(null, stats));

  status.appendChild(stats);
}

function createStat(parent: HTMLElement, [key, value]: [string, string | StateValue]): void {
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

type Tide = 'low' | 'high';

export function showTide(tide: Tide): void {
  document.body.classList[tide === 'high' ? 'add' : 'remove']('highTide');
}
