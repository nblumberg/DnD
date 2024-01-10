import { useEffect, useState } from "react";
import { listCharacters, listMonsters } from "../services/compendium";
import { Actor, toId } from "./Actor";
import { Character } from "./Character";

export function useActors(): Actor[] {
  const [actors, setActors] = useState<Actor[]>([]);
  useEffect(() => {
    Promise.all([listCharacters(), listMonsters()]).then(
      ([characters, monsters]) => {
        const newActors: Actor[] = [
          ...characters
            .map((name) => new Character(name, toId(name)))
            .sort(sortActors),
          ...monsters.map((name) => new Actor({ name })).sort(sortActors),
        ];
        setActors(newActors);
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
