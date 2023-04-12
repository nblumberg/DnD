import { hideButtons, showButtons } from './elements.js';
import { generateEncounter, showEncounter } from './encounters.js';
import { getUrlParam } from './getUrlParam.js';
import { showImage } from './showImage.js';
import { showText } from './showText.js';
import { getState, resetAll, resetLocation, setState } from './state.js';
import { trackDirection, trackLocation } from './tracker.js';

const travelTime = parseInt(getUrlParam('travelTime'), 10) || 30;

let location;

const goToLocationCallbacks = [];
export function registerGoToLocationCallback(callback) {
  goToLocationCallbacks.push(callback);
}

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
    description,
    forcedEncounter = false,
  } = location;
  hideButtons();
  await showImage(backgroundImage, rotate);
  showButtons(location);
  if (description) {
    await showText(description);
  }

  for (const callback of goToLocationCallbacks) {
    await callback(locations, encounters, location, fromPageLoad);
  }

  if (!fromPageLoad || forcedEncounter) {
    await generateEncounter(encounters, location);
  }
}

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
