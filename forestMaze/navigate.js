import { downButton, leftButton, rightButton, upButton } from './elements.js';
import { generateEncounter } from './encounters.js';
import { showImage } from './showImage.js';
import { resetLocation, setLocation } from './state.js';

let location;

export async function goToLocation(locations, encounters, name, allowEncounters = true) {
  location = locations.find(location => location.name === name);
  // location = locations[0];
  if (!location) {
      alert(`Couldn't find location "${name}"`);
      return;
  }
  setLocation(name);
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
      alert(description);
  }
  if (allowEncounters || forcedEncounter) {
    await generateEncounter(encounters, location);
  }
}

export function onNavigate(locations, encounters, event) {
  const { id: direction } = event.target;
  if (!location[direction]) {
      return;
  }
  goToLocation(locations, encounters, location[direction]);
}

export function onReset(locations, encounters) {
  goToLocation(locations, encounters, locations[0].name);
  resetLocation();
}
