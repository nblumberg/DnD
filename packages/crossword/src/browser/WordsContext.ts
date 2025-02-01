import { createContext } from "react";
import { ActiveWord } from "../board";

export interface WordCorrect {
  wordCorrect: boolean;
  allCellsComplete: boolean;
}
export type WordsCorrectMap = Map<ActiveWord, WordCorrect>;
export type SetWords = React.Dispatch<React.SetStateAction<WordsCorrectMap>>;
export type WordsContextParameters = [WordsCorrectMap, SetWords];

export const WordsContext = createContext<WordsContextParameters>([
  new Map(),
  () => {},
]);
