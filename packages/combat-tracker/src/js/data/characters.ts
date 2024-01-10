import { useEffect, useState } from "react";
import { listCharacters } from "../services/compendium";

export function useCharacters(): string[] {
  const [characters, setCharacters] = useState<string[]>([]);
  useEffect(() => {
    listCharacters().then((data) => {
      setCharacters(data);
    });
  }, [setCharacters]);
  return characters;
}
