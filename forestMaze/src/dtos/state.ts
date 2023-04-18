export interface State {
  directions: [string, string, string, string]; // names of the directions
  encounter: number; // random Encounter on a roll of 13+
  location: string; // current Location
  path: string;
  seed: string; // random number generator seed
  tides: boolean; // whether tide Encounters are shown every time (true), or simply the first for each Encounter
  transition: number; // milliseconds in image fades
  travelTime: number; // minutes between Locations
}
