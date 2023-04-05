import { addEventHandlers } from './eventHandlers.js';
import { getUrlParam } from './getUrlParam.js';
import { goToLocation } from './navigate.js';
import { getLocation, setState } from './state.js';

(async function IIFE() {
    const here = new URL(window.location.href);
    const path = `${here.protocol}//${here.hostname}${here.port ? `:${here.port}` : ''}/${getUrlParam('path') ?? 'vermeillon'}`;
    const [{ locations }, { encounters }] = await Promise.all([
        import(`${path}/locations.js`),
        import(`${path}/encounters.js`),
    ]);

    // Attach event handlers
    addEventHandlers(locations, encounters);

    // Initial state
    goToLocation(locations, encounters, getLocation() || locations[0].name, false);
    setState();
})();
