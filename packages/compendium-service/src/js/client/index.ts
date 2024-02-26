import axios from "axios";
import { CreatureParams, Spell } from "creature";

const baseUrl = "http://localhost:666/v1/";

let monsterNameCache: string[];

export async function listMonsters(): Promise<string[]> {
  if (monsterNameCache) {
    return [...monsterNameCache];
  }
  const { data } = await axios.get(`${baseUrl}monsters`);
  monsterNameCache = data;
  return [...monsterNameCache];
}

const monsterCache = new Map<string, CreatureParams>();

export async function getMonster(name: string): Promise<CreatureParams> {
  if (monsterCache.has(name)) {
    return { ...monsterCache.get(name)! };
  }
  const { data }: { data: CreatureParams } = await axios.get(
    `${baseUrl}monsters/${name}`
  );
  monsterCache.set(name, data);
  return { ...data };
}

let characterNameCache: string[];

export async function listCharacters(): Promise<string[]> {
  if (characterNameCache) {
    return [...characterNameCache];
  }
  const { data } = await axios.get(`${baseUrl}characters`);
  characterNameCache = data;
  return [...characterNameCache];
}

const characterCache = new Map<string, CreatureParams>();

export async function getCharacter(name: string): Promise<CreatureParams> {
  if (characterCache.has(name)) {
    return { ...characterCache.get(name)! };
  }
  const { data }: { data: CreatureParams } = await axios.get(
    `${baseUrl}characters/${name}`
  );
  characterCache.set(name, data);
  return { ...data };
}

let spellNameCache: string[];

export async function listSpells(): Promise<string[]> {
  if (spellNameCache) {
    return [...spellNameCache];
  }
  const { data } = await axios.get(`${baseUrl}spells`);
  spellNameCache = data;
  return [...spellNameCache];
}

const spellCache = new Map<string, Spell>();

export async function getSpell(name: string): Promise<Spell> {
  if (spellCache.has(name)) {
    return { ...spellCache.get(name)! };
  }
  const { data }: { data: Spell } = await axios.get(`${baseUrl}spells/${name}`);
  spellCache.set(name, data);
  return { ...data };
}
