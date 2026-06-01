import { Direction } from "./direction";
import { Position } from "./position";

export interface CrossObject {
  word1: WordObject;
  character1: number;
  word2: WordObject;
  character2: number;
}

export interface Word {
  word: string;
}

export class WordObject implements Word {
  word: string;
  characters: string[];

  constructor(word: string) {
    this.word = word;
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

export interface ActiveWord extends Word, Position {}

export class ActiveWordObject extends WordObject implements ActiveWord {
  direction: Direction;
  x: number;
  y: number;

  constructor(base: Word, position: Position) {
    super(base.word);
    this.x = position.x;
    this.y = position.y;
    this.direction = position.direction;
  }
}
