import { DefaultDirection } from './directions.js';
import { hideButtons, showButtons } from './elements.js';
import { Encounter, generateEncounter, showEncounter } from './encounters.js';
import { getUrlParam } from './getUrlParam.js';
import { Location } from './locations.js';
import { showImage } from './showImage.js';
import { showText } from './showText.js';
import { getState, resetAll, resetLocation, setState } from './state.js';
import { trackDirection, trackLocation } from './tracker.js';

const travelTime = parseInt(getUrlParam('travelTime') ?? '', 10) || 30;

let location: Location | undefined;

interface GoToLocationCallback {
  (locations: Location[], encounters: Encounter[], location: Location, fromPageLoad?: boolean) : Promise<void>;
};
const goToLocationCallbacks: GoToLocationCallback[] = [];
export function registerGoToLocationCallback(callback: GoToLocationCallback): void {
  goToLocationCallbacks.push(callback);
}

export async function goToLocation(locations: Location[], encounters: Encounter[], name: string, fromPageLoad?: boolean): Promise<void> {
  location = locations.find(location => location.name === name);
  // location = locations[0];
  if (!location) {
    alert(`Couldn't find location "${name}"`);
    return;
  }

  (window as any).showEncounter = showEncounter.bind(null, encounters, location);

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

export function onNavigate(locations: Location[], encounters: Encounter[], event: Event): void {
  const direction = (event.target as HTMLElement)!.id as DefaultDirection;
  if (!location || !location[direction]) {
    return;
  }
  trackDirection(direction);
  const state = getState();
  let hours = state.hours as number;
  let minutes = state.minutes as number;
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
        (state[key] as [string, number])[1] = duration;
      }
    }
  });
  setState(state);
  goToLocation(locations, encounters, location[direction]!);
}

export function onClear(locations: Location[], encounters: Encounter[]): void {
  resetAll();
  encounters.forEach(encounter => delete encounter.resolved);
  goToLocation(locations, encounters, locations[0].name);
}

export function onReset(locations: Location[], encounters: Encounter[]): void {
  resetLocation();
  goToLocation(locations, encounters, locations[0].name);
}
