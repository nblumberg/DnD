import { Actor } from "creature";
import { useEffect, useState } from "react";
import { listCharacters, listMonsters } from "../services/compendium";
import { Character } from "./Character";

let cachedActors: Actor[] = [];

export function useActors(): Actor[] {
  const [actors, setActors] = useState<Actor[]>([...cachedActors]);
  useEffect(() => {
    Promise.all([listCharacters(), listMonsters()]).then(
      ([characters, monsters]) => {
        cachedActors = [
          ...characters.map((name) => new Character(name)).sort(sortActors),
          ...monsters.map((name) => new Actor({ name })).sort(sortActors),
        ];
        setActors([...cachedActors]);
      }
    );
  }, [setActors]);
  return actors;
}

export function sortActors(a: Actor, b: Actor): number {
  if (a.unique && !b.unique) {
    return -1;
  } else if (!a.unique && b.unique) {
    return 1;
  } else if (a.name === b.name) {
    return 0;
  } else if (a.name < b.name) {
    return -1;
  }
  return 1;
}
