import { listCharacters, listMonsters } from "compendium-service/client";
import { Actor } from "creature";
import { useEffect, useState } from "react";
import { ActorInstance, Character } from "../types";

// TODO: remove file?

let cachedActors: Actor[] = [];

export function useActors(): Actor[] {
  const [actors, setActors] = useState<Actor[]>([...cachedActors]);
  useEffect(() => {
    Promise.all([listCharacters(), listMonsters()]).then(
      ([characters, monsters]) => {
        cachedActors = [
          ...characters
            .map((name) => new Character(name))
            .sort(ActorInstance.sort),
          ...monsters
            .map((name) => new ActorInstance(name))
            .sort(ActorInstance.sort),
        ];
        setActors([...cachedActors]);
      }
    );
  }, [setActors]);
  return actors;
}
