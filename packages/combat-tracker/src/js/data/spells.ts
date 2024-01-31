import { getSpell } from "compendium-service/client";
import { Spell } from "creature";
import { createContext } from "react";

const spells = new Map<string, Spell>();

export async function loadSpells(...names: string[]) {
  names.forEach(async (name) => {
    if (spells.has(name)) {
      return spells.get(name);
    }
    const spell = await getSpell(name);
    spells.set(name, spell);
    return spell;
  });
}

export function findSpell(name: string) {
  return spells.get(name);
}

export const SpellContext = createContext(spells);
