import { Direction } from "./direction";
import { Position } from "./position";

export interface CrossObject {
  word1: WordObject;
  character1: number;
  word2: WordObject;
  character2: number;
}

export interface WordClue {
  word: string;
  clue: string;
}

export class WordObject implements WordClue {
  word: string;
  clue: string;
  characters: string[];

  constructor(word: string, clue: string) {
    this.word = word;
    this.clue = clue;
    this.characters = word.split("");
  }

  /**
   * Find, in sequence, the places other words cross with this word
   * @param {WordObject[]} words The words to try and cross with
   * @returns {CrossObject} A description of a crossing of words
   */
  *findCrosses(...words: WordObject[]): Generator<CrossObject> {
    for (
      let myCharacterIndex = 0;
      myCharacterIndex < this.characters.length;
      myCharacterIndex++
    ) {
      for (const word of words) {
        if (word === this) {
          continue;
        }
        for (
          let characterIndex = 0;
          characterIndex < word.characters.length;
          characterIndex++
        ) {
          if (
            this.characters[myCharacterIndex] !==
            word.characters[characterIndex]
          ) {
            continue;
          } else {
            yield {
              word1: this,
              character1: myCharacterIndex,
              word2: word,
              character2: characterIndex,
            };
          }
        }
      }
    }
  }
}

export interface ActiveWord extends WordClue, Position {
  number: number;
}

export class ActiveWordObject extends WordObject implements ActiveWord {
  direction: Direction;
  x: number;
  y: number;
  number: number;

  constructor(base: WordClue, position: Position) {
    super(base.word, base.clue);
    this.x = position.x;
    this.y = position.y;
    this.direction = position.direction;
    this.number = NaN;
  }
}
