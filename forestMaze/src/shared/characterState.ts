import { createEventEmitter } from './eventEmitter.js';

export type CharacterStateValue = number | [string, number]; // damage or [effect, duration]
export type CharacterState = Record<string, CharacterStateValue>;

export const characterState: CharacterState = {};

export const {
  addListener: addCharacterStateListener,
  addPropertyListener: addCharacterStatePropertyListener,
  removeListener: removeCharacterStateListener,
  setData: setCharacterState
} = createEventEmitter(characterState);
