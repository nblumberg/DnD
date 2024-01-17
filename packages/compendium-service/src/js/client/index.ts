import axios from "axios";
import { CreatureParams } from "creature";

const baseUrl = "http://localhost:666/v1/";

export async function listMonsters(): Promise<string[]> {
  const { data } = await axios.get(`${baseUrl}monsters`);
  return data;
}

export async function getMonster(name: string): Promise<CreatureParams> {
  const { data }: { data: CreatureParams } = await axios.get(
    `${baseUrl}monsters/${name}`
  );
  return data;
}

export async function listCharacters(): Promise<string[]> {
  const { data } = await axios.get(`${baseUrl}characters`);
  return data;
}

export async function getCharacter(name: string): Promise<CreatureParams> {
  const { data }: { data: CreatureParams } = await axios.get(
    `${baseUrl}characters/${name}`
  );
  return data;
}
