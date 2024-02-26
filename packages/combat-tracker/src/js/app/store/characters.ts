import { userToCharacter } from "../constants";
import { useAppState } from "./state";

export function emailToCharacters(email: string): string[] {
  return userToCharacter[email as keyof typeof userToCharacter] ?? [];
}

export function useCharacters(): string[] {
  const [state] = useAppState();
  const { user } = state;
  if (!user) {
    return [];
  }
  const { email } = user;
  return emailToCharacters(email);
}

export function useIsDM(): boolean {
  return useCharacters().includes("dm");
}
