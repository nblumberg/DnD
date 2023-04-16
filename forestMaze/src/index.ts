import { addEventHandlers } from './eventHandlers.js';
import { getUrlParam } from './getUrlParam.js';
import { goToLocation } from './navigate.js';
import { getLocation, setState } from './state.js';
import { logHistory } from './tracker.js';

(async function IIFE() {
  const here = new URL(window.location.href);
  const path = getUrlParam('path') ?? './vermeillon';
  const [{ locations }, { encounters }] = await Promise.all([
    import(`${path}/locations.js`),
    import(`${path}/encounters.js`),
  ]);

  // Attach event handlers
  addEventHandlers(locations, encounters);

  logHistory();

  // Initial state
  goToLocation(locations, encounters, getLocation() || locations[0].name, true);
  setState();
})();
