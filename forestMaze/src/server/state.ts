export const state = {
  directions: ['up', 'right', 'down', 'left'], // names of the directions
  encounter: 13, // random Encounter on a roll of 13+
  location: '', // current Location
  path: './hither',
  seed: '', // random number generator seed
  tides: false, // whether tide Encounters are shown every time (true), or simply the first for each Encounter
  transition: 2000, // milliseconds in image fades
  travelTime: 30, // minutes between Locations
};
