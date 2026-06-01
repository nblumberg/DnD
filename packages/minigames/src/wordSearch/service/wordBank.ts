import { WordObject } from "../board";

const wordsAndClues = new Map<string, boolean>();

export function clearWords(): void {
  wordsAndClues.clear();
}

export function addWord(word: string, exists: boolean): void {
  wordsAndClues.set(word.toUpperCase(), exists);
}

export function getWords() {
  const wordBank = Array.from(wordsAndClues.entries()).map(
    ([word, clue]) => new WordObject(word, clue)
  );
  return wordBank;
}
