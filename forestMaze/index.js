import { getTile, setState } from './state.js';
import { addEventHandlers } from './eventHandlers.js';
import { goToTile } from './navigate.js';

(async function IIFE() {
    const here = new URL(window.location.href);
    const path = `${here.protocol}//${here.hostname}${here.port ? `:${here.port}` : ''}/${new URLSearchParams(window.location.search).get('path') ?? 'vermeillon'}`;
    const [{ tiles }, { randomEncounters }] = await Promise.all([
        import(`${path}/tiles.js`),
        import(`${path}/randomEncounters.js`),
    ]);

    // Attach event handlers
    addEventHandlers(tiles, randomEncounters);

    // Initial state
    goToTile(tiles, randomEncounters, getTile() || tiles[0].name, false);
    setState();
})();
