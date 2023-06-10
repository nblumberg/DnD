import { getUrlParam } from './getUrlParam.js';

const character = getUrlParam('name')! as Character;

export type Character = 'Eaton' | 'Harrow' | 'John' | 'Nacho' | 'Rhiannon' | 'Throne' | 'DM';

export function getCharacter(): Character {
  return character;
}

export function isDM(): boolean {
  return character === 'DM';
}
