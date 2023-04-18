import { addSocketListener } from './browserSockets.js';
import { State } from './dtos/state.js';
import { Encounter } from './encounters.js';
import { addEventHandlers } from './eventHandlers.js';
import { getUrlParam } from './getUrlParam.js';
import { Location } from './locations.js';
import { goToLocation } from './navigate.js';
import { getLocation, setState } from './state.js';
import { logHistory } from './tracker.js';

function init([state, { locations }, { encounters }]: [State, { locations: Location[] }, { encounters: Encounter[] }]) {
  // Attach event handlers
  addEventHandlers(locations, encounters);
  addSocketListener();

  logHistory();

  // Initial state
  goToLocation(locations, encounters, getLocation() || locations[0].name, true);
  setState();
}

fetch('./state')
  .then(response => response.json())
  .then(state => {
    const path = getUrlParam('path') ?? state.path;
    return Promise.all([
      Promise.resolve(state),
      import(`${path}/locations.js`),
      import(`${path}/encounters.js`),
    ]);
  })
  .then(init);
