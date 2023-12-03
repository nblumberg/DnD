import { Location, getDirections } from "../locations.js";
import { DefaultDirection, defaultDirections } from "../shared/directions.js";
import { randomFrom, roll } from "../shared/random.js";
import { addStatePropertyListener } from "../shared/state.js";
import { Character, getCharacter } from "./character.js";
import { getLocation, getLocations } from "./showLocation.js";

let destination: string;
let locationName: string;

const survivalSkill: Record<Character, { modifier: number; trained: boolean; }> = {
  Eaton: { modifier: 6, trained: true },
  Harrow: { modifier: 0, trained: false },
  John: { modifier: 2, trained: true },
  Nacho: { modifier: 2, trained: false },
  Rhiannon: { modifier: 4, trained: true },
  Throne: { modifier: 3, trained: true },
  DM: { modifier: 100, trained: true },
};

export function getSupposedDirection(location: Location): DefaultDirection | undefined {
  if (!location) {
    return;
  }
  const availableDirections = defaultDirections.filter(direction => location[direction as keyof Location]);
  if (availableDirections.length === 1) {
    return availableDirections[0];
  }

  const dc = 12;

  const character = getCharacter();
  const { modifier, trained } = survivalSkill[character];
  const result = (character === 'Nacho' ? Math.max(roll(20), roll(20)) : roll(20)) + modifier;

  let outcome: 'correct' | 'unknown' | 'incorrect';
  if (result >= dc) {
    outcome = 'correct';
  } else if (result + (trained ? 8 : 4) >= dc) {
    outcome = 'unknown';
  } else {
    outcome = 'incorrect';
  }

  const correctDirection = getCorrectDirection();
  switch (outcome) {
    case 'correct':
      return correctDirection;
    case 'unknown':
      return undefined;
    case 'incorrect':
      const incorrectDirections = availableDirections.filter(direction => direction !== correctDirection);
      return randomFrom(incorrectDirections);
  }
}

function getCorrectDirection(): DefaultDirection | undefined {
  const locations = getLocations();
  const location = getLocation(locationName);
  if (!locations || !location) {
    return;
  }
  const directions = getDirections(locations, locationName, destination);
  if (!directions) {
    return;
  }
  const correctDirection = directions[1][0];
  if (!location || !location[correctDirection]) {
    return;
  }
  return correctDirection;
}

addStatePropertyListener('destination', value => {
  destination = value;
});

addStatePropertyListener('location', value => {
  locationName = value;
});
