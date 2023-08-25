import { randomFrom } from '../../shared/random.js';
import { createCell, createRow, numberClues } from './dom.js';
import { ACROSS, addPotentialCrosses, DOWN, findCrosses, Position, prepareBoard, WordObj } from './words.js';

export interface ActiveWord extends WordObj, Position {
  num: number;
}

export interface Cell {
  value: null | string;
  word?: ActiveWord;
  wordIndex?: number;
};

const Bounds = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,

  update(x: number, y: number): void {
    this.top = Math.min(y, this.top);
    this.right = Math.max(x, this.right);
    this.bottom = Math.max(y, this.bottom);
    this.left = Math.min(x, this.left);
  },

  clean(): void {
    this.top = 999;
    this.right = 0;
    this.bottom = 0;
    this.left = 999;
  }
};

const board: Cell[][] = [];
const activeWords: ActiveWord[] = [];

const SIZE = 32;

(window as any).logBoard = function(): void {
  let str = '';
  board.forEach(row => {
    row.forEach(({ value }) => {
      str += value ?? ' ';
    });
  });
  console.log(str);
};

export function initializeBoard(): void {
  Bounds.clean();

  activeWords.length = 0;

  // Create a SIZExSIZE 2D Array filled with null
  board.length = 0;
  for (let i = 0; i < SIZE; i++) {
    const column = new Array<Cell>(SIZE);
    for (let j = 0; j < SIZE; j++) {
      column.push({ value: null }); // can't use fill with Object or they all reference the same object
    }
    board.push(column);
  }
}

export function populateBoard() {
  const wordBank = prepareBoard();
  initializeBoard();

  let isOk = true;
  let len = wordBank.length;
  for(let i = 0; i < len && isOk; i++) {
    isOk = addWordToBoard(wordBank);
  }
  return { isOk, board, words: activeWords };
}


// TODO: Clean this guy up
function addWordToBoard(wordBank: WordObj[]) {
  let curIndex: number;

  if (activeWords.length < 1) {
    curIndex = indexOfMostMatchedWord(wordBank);
    // TODO: why 12?
    wordBank[curIndex].activeCrosses = [{ x: 12, y: 12, dir: ACROSS }];
  } else {
    curIndex = findNextActiveWord(wordBank);
  }

  if (curIndex === -1) {
    return false;
  }

  const [word] = wordBank.splice(curIndex, 1) as ActiveWord[];
  activeWords.push(word);

  const matchData = randomFrom(word.activeCrosses);
  word.x = matchData.x;
  word.y = matchData.y;
  word.dir = matchData.dir;
  word.num = 0;

  word.characters.forEach((character, i) => {
    let { x: xIndex, y: yIndex } = matchData;
    if (matchData.dir === ACROSS) {
      xIndex += i;
      board[xIndex][yIndex] = { value: character, word, wordIndex: i };
    }
    else{
      yIndex += i;
      board[xIndex][yIndex] = { value: character, word, wordIndex: i };
    }

    Bounds.update(xIndex, yIndex);
  });

  return true;
}

/**
 * If this is the first word we're adding, there are no "successful matches" to go by,
 * so just find the word with the most possible matches.
 */
function indexOfMostMatchedWord(wordBank: WordObj[]): number {
  let mostCrosses = 0;
  let index = 0;
  for (let i = 0; i < wordBank.length; i++) {
    const otherWords = wordBank.slice(0).splice(i, 1);
    const crosses = Array.from(findCrosses(wordBank[i], otherWords)).length;
    if (crosses > mostCrosses) {
      mostCrosses = crosses;
      index = i;
    }
  }
  return index;
}

/**
 * If this isn't the first word we're adding,
 * find the remaining word with TODO?
 */
function findNextActiveWord(wordBank: WordObj[]): number {
  let curIndex = -1;

  addPotentialCrosses(wordBank);

  const minMatchDiff = Infinity;

  try {
    wordBank.forEach((wordToAdd, i) => {
      for (const cross of findCrosses(wordToAdd, activeWords)) {
        if (!cross) {
          continue;
        }
        const { character1: wordToAddCharacter, word2: activeWord, character2: activeCharacter } = cross;
        const position: Position = findPosition(activeWord as ActiveWord, activeCharacter, wordToAddCharacter);

        if (willFit(wordToAdd, position, wordToAddCharacter)) {
          wordToAdd.activeCrosses.push(position);
        }
      }

      wordToAdd.effectiveMatches = 0;
      wordToAdd.activeCrosses = [];
      wordToAdd.characters.forEach((wordToAddChar, j) => {
        activeWords.forEach((activeWord) => {
          activeWord.characters.forEach((activeWordChar, l) => {
            if (wordToAddChar !== activeWordChar) {
              return;
            }
            wordToAdd.effectiveMatches++;

            const position: Position = findPosition(activeWord, l, j);

            if (willFit(wordToAdd, position, j)) {
              wordToAdd.activeCrosses.push(position);
            }
          });
        });
      });

      let curMatchDiff = wordToAdd.bankCrosses.total - wordToAdd.effectiveMatches;

      if (curMatchDiff < minMatchDiff && wordToAdd.activeCrosses.length > 0) {
        curMatchDiff = minMatchDiff;
        curIndex = i;
      }
      // else if (curMatchDiff <= 0) {
      //   throw new Error("Didn't find a match");
      // }
    });
  } catch (e) {
    // Ignore
  }
  return curIndex;
}

/**
 * Determine the direction and starting position of the added word
 * relative to where it crosses the active word.
 */
function findPosition(activeWord: Position, activeWordLetter: number, wordToAddLetter: number): Position {
  const curCross: Position = { x: activeWord.x, y: activeWord.y, dir: ACROSS };
  if (activeWord.dir === ACROSS) {
    // If the word we're crossing is ACROSS, we're DOWN
    curCross.dir = DOWN;
    // The location of the word we're adding is in the column of the crossed word's letter
    curCross.x += activeWordLetter;
    // and count backward from the letter of the added word to the beginning of the added word to find the row
    curCross.y -= wordToAddLetter;
  } else {
    // If the word we're crossing is DOWN, we're ACROSS
    curCross.dir = ACROSS;
    // The location of the word we're adding is in the row of the crossed word's letter
    curCross.y += activeWordLetter;
    // and count backward from the letter of the added word to the beginning of the added word to find the column
    curCross.x -= wordToAddLetter;
  }
  return curCross;
}

/**
 * Make sure adding the word at this position doesn't conflict with any other
 * words already on the board
 */
function willFit(wordToAdd: WordObj, position: Position, wordToAddOriginalCrossLetter: number): boolean {
  const lenM = wordToAdd.characters.length + 1;
  // Iterate over the board from one space before the new position to one space after the end of the new word
  for (let m = -1; m < lenM; m++) {
    const perpendicularSquares = []; // The letters already on the board in this position and to either side of it
    if (m === wordToAddOriginalCrossLetter) {
      // We know this letter is valid, it's how we chose this position to begin with
      continue;
    }
    if (position.dir === ACROSS) {
      const xIndex = position.x + m;

      if (xIndex < 0 || xIndex > board.length) {
        // This position would leave the board
        // TODO: remove board boundaries and let it grow organicaly as we add words
        return false;
      }

      perpendicularSquares.push(board[xIndex][position.y - 1]?.value); // above position
      perpendicularSquares.push(board[xIndex][position.y]?.value); // position
      perpendicularSquares.push(board[xIndex][position.y + 1]?.value); // after position
    } else {
      const yIndex = position.y + m;

      if (yIndex < 0 || yIndex > board[position.x].length) {
        // This position would leave the board
        // TODO: remove board boundaries and let it grow organicaly as we add words
        return false;
      }

      perpendicularSquares.push(board[position.x - 1][yIndex]?.value); // left of position
      perpendicularSquares.push(board[position.x][yIndex]?.value); // position
      perpendicularSquares.push(board[position.x + 1][yIndex]?.value); // right of position
    }

    if (m > -1 && m < lenM - 1) {
      if (perpendicularSquares[0] !== wordToAdd.characters[m]) {
        if (!!perpendicularSquares[0]) {
          // If the space before it wasn't empty,
          // then it's invalid because you're creating a new word
          return false;
        } else if (!!perpendicularSquares[1]) {
          // If the space itself wasn't empty,
          // then it's invalid because there's a conflict
          return false;
        } else if (!!perpendicularSquares[2]) {
          // If the space after it wasn't empty,
          // then it's invalid because you're creating a new word
          return false;
        }
      }
    } else if (!!perpendicularSquares[0]) {
      return false;
    }
  }
  return true;
}

export function boardToHtml(): void {
  const numberCounts = {
    ACROSS: 1,
    DOWN: 1,
  };
  for (let y = Bounds.top - 1; y < Bounds.bottom + 2; y++) {
    const rowId = `${y}`;
    createRow(rowId);
    for (let x = Bounds.left - 1; x < Bounds.right + 2; x++) {
      const words = activeWords.filter(activeWord => activeWord.x === x && activeWord.y === y);
      const cellNumbers: { ACROSS?: number; DOWN?: number; } = {};
      const acrossWord = words.find(({ dir }) => dir === ACROSS);
      if (acrossWord) {
        cellNumbers.ACROSS = acrossWord.num = numberCounts.ACROSS++;
      }
      const downWord = words.find(({ dir }) => dir === DOWN);
      if (downWord) {
        cellNumbers.DOWN = downWord.num = numberCounts.DOWN++;
      }
      createCell(rowId, board[x][y]?.value ?? '', cellNumbers);
    }
  }
  numberClues(
    activeWords.filter(({ dir }) => dir === ACROSS).sort((a, b) => a.num - b.num).map(({ word: string }) => string),
    activeWords.filter(({ dir }) => dir === DOWN).sort((a, b) => a.num - b.num).map(({ word: string }) => string)
  );
}
