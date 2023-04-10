import { downButton, leftButton, rightButton, upButton } from './elements.js';
import { generateEncounter, showEncounter } from './encounters.js';
import { getUrlParam } from './getUrlParam.js';
import { roll } from './random.js';
import { showImage } from './showImage.js';
import { showTide } from './showState.js';
import { showText } from './showText.js';
import { getState, getTide, resetAll, resetLocation, setState, setTide } from './state.js';
import { trackDirection, trackLocation } from './tracker.js';

const travelTime = parseInt(getUrlParam('travelTime'), 10) || 30;
const showTides = getUrlParam('tides') === 'true';

let location;
let tide = 'low';

export async function goToLocation(locations, encounters, name, fromPageLoad) {
  location = locations.find(location => location.name === name);
  // location = locations[0];
  if (!location) {
      alert(`Couldn't find location "${name}"`);
      return;
  }

  window.showEncounter = showEncounter.bind(null, encounters, location);

  trackLocation(location, fromPageLoad);

  const {
      src: backgroundImage,
      rotate = 0,
      up,
      right,
      down,
      left,
      description,
      forcedEncounter = false,
  } = location;
  upButton.classList.add('hidden');
  rightButton.classList.add('hidden');
  downButton.classList.add('hidden');
  leftButton.classList.add('hidden');
  await showImage(backgroundImage, rotate);
  if (up) {
      upButton.classList.remove('hidden');
  }
  if (right) {
      rightButton.classList.remove('hidden');
  }
  if (down) {
      downButton.classList.remove('hidden');
  }
  if (left) {
      leftButton.classList.remove('hidden');
  }
  if (description) {
      await showText(description);
  }

  if (showTides) {
    const newTide = location.tide ?? getTide();
    if (newTide !== tide) {
      tide = newTide;
      showTide(tide);
      await showEncounter(encounters, location, `${tide.charAt(0).toUpperCase()}${tide.substring(1)} tide`);
    }
  }

  if (!fromPageLoad || forcedEncounter) {
    await generateEncounter(encounters, { tide, ...location });
  }
}

const timeRegExp = /^(\d+) hrs (\d+) min$/;

export function onNavigate(locations, encounters, event) {
  const { id: direction } = event.target;
  if (!location || !location[direction]) {
      return;
  }
  trackDirection(direction);
  const state = getState();
  let { hours, minutes } = state;
  minutes += travelTime;
  hours += Math.floor(minutes / 60);
  minutes = minutes % 60;
  state.hours = hours;
  state.minutes = minutes;
  Object.entries(state).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      let duration = value[1];
      duration -= travelTime;
      if (duration <= 0) {
        delete state[key];
      } else {
        state[key][1] = duration;
      }
    }
  });
  setState(state);
  if (showTides) {
    setTide(roll(2) === 2 ? 'high' : 'low');
  }
  goToLocation(locations, encounters, location[direction]);
}

export function onClear(locations, encounters) {
  resetAll();
  goToLocation(locations, encounters, locations[0].name);
}

export function onReset(locations, encounters) {
  resetLocation();
  goToLocation(locations, encounters, locations[0].name);
}
