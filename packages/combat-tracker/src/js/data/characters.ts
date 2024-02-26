import { listCharacters } from "compendium-service/client";
import { useEffect, useState } from "react";

export function useCharacters(): string[] {
  const [characters, setCharacters] = useState<string[]>([]);
  useEffect(() => {
    listCharacters().then((data) => {
      setCharacters(data);
    });
  }, [setCharacters]);
  return characters;
}
