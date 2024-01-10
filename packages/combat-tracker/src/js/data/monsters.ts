import { useEffect, useState } from "react";
import { listMonsters } from "../services/compendium";

export function useMonsters(): string[] {
  const [monsters, setMonsters] = useState<string[]>([]);
  useEffect(() => {
    listMonsters().then((data) => {
      setMonsters(data);
    });
  }, [setMonsters]);
  return monsters;
}
