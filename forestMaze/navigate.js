import { downButton, leftButton, rightButton, upButton } from './elements.js';
import { generateEncounter } from './encounters.js';
import { showImage } from './showImage.js';
import { resetTile, setTile } from './state.js';

let tile;

export async function goToTile(tiles, encounters, name, allowEncounters = true) {
  tile = tiles.find(tile => tile.name === name);
  // tile = tiles[0];
  if (!tile) {
      alert(`Couldn't find tile ${name}`);
      return;
  }
  setTile(name);
  console.log(`Visiting ${name}`);
  const {
      src: backgroundImage,
      rotate = 0,
      up,
      right,
      down,
      left,
      description,
      forcedEncounter = false,
  } = tile;
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
      alert(description);
  }
  if (allowEncounters || forcedEncounter) {
    await generateEncounter(encounters, tile);
  }
}

export function onNavigate(tiles, encounters, event) {
  const { id: direction } = event.target;
  if (!tile[direction]) {
      return;
  }
  goToTile(tiles, encounters, tile[direction]);
}

export function onReset(tiles, encounters) {
  goToTile(tiles, encounters, tiles[0].name);
  resetTile();
}
