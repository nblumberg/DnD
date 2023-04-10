import { status } from './elements.js';

export function showState(state) {
  status.innerHTML = '';

  const stats = document.createElement('dl');
  const { hours, minutes } = state;
  createStat(stats, ['time', `${hours} hrs ${minutes} min`]);
  Object.entries(state)
    .filter(([key]) => key !== 'hours' && key !== 'minutes')
    .forEach(createStat.bind(null, stats));

  status.appendChild(stats);
}

function createStat(parent, [key, value]) {
  const dt = document.createElement('dt');
  dt.innerText = key;
  parent.appendChild(dt);

  const dd = document.createElement('dd');
  if (Array.isArray(value)) {
    const text = value[0];
    const duration = value[1];
    dd.innerText = `${text} ${duration} min`;
  } else {
    dd.innerText = value;
  }
  parent.appendChild(dd);
}

export function showTide(tide) {
  document.body.classList[tide === 'high' ? 'add' : 'remove']('highTide');
}
