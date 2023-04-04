import { addEventHandlers } from './eventHandlers.js';
import { getUrlParam } from './getUrlParam.js';
import { goToTile } from './navigate.js';
import { getTile, setState } from './state.js';

(async function IIFE() {
    const here = new URL(window.location.href);
    const path = `${here.protocol}//${here.hostname}${here.port ? `:${here.port}` : ''}/${getUrlParam('path') ?? 'vermeillon'}`;
    const [{ tiles }, { encounters }] = await Promise.all([
        import(`${path}/tiles.js`),
        import(`${path}/encounters.js`),
    ]);

    // Attach event handlers
    addEventHandlers(tiles, encounters);

    // Initial state
    goToTile(tiles, encounters, getTile() || tiles[0].name, false);
    setState();
})();
