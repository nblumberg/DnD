import { WordObject } from "../board/Word";

const wordsAndClues = new Map<string, string>();

export function clearWords(): void {
  wordsAndClues.clear();
}

export function addWord(word: string, clue: string): void {
  wordsAndClues.set(word.toUpperCase(), clue);
}

export function getWords() {
  const wordBank = Array.from(wordsAndClues.entries()).map(
    ([word, clue]) => new WordObject(word, clue)
  );
  return wordBank;
}
