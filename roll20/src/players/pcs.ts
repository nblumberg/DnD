import type { Id } from "../builtIns";
import { isPC } from "./isPC";

const pcs = new Map<Id, Character>();

export function addPC(character: Character, multipleAdd = false) {
  if (!isPC(character)) {
    return;
  }
  pcs.set(character.get("id"), character);
  if (!multipleAdd) {
    log(`PC added: ${character.get("name")}`);
  }
}

export function getPCs(): Character[] {
  return Array.from(pcs.values());
}

export function getPC(id: Id): Character | undefined {
  return pcs.get(id);
}

on("add:character", addPC);
