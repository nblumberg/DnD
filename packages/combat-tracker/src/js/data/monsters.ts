import { listMonsters } from "compendium-service/client";
import { useEffect, useState } from "react";

export function useMonsters(): string[] {
  const [monsters, setMonsters] = useState<string[]>([]);
  useEffect(() => {
    listMonsters().then((data) => {
      setMonsters(data);
    });
  }, [setMonsters]);
  return monsters;
}
