import { styleText } from "node:util";

import { randomFrom } from "../../shared/random";
import {
  ACROSS,
  ActiveWordObject,
  Board,
  Cell,
  Coordinates,
  CrossObject,
  DOWN,
  Position,
  WordObject,
} from "../board";

export function crossWords(wordBank: WordObject[]) {
  console.log(
    `Making a crossword from:\n\t${wordBank.map(({ word }) => word).join("\n\t")}`
  );

  try {
    const board = addWordsToBoard(wordBank, new Board());
    console.log(`\nFinal board:\n${board.toString()}`);
    return { isOk: true, board };
  } catch (error) {
    return { isOk: false };
  }
}

function addWordsToBoard(wordBank: WordObject[], board: Board): Board {
  if (!wordBank.length) {
    return board;
  }
  const untriedWords: WordObject[] = [...wordBank];
  while (untriedWords.length) {
    const wordToAdd: WordObject = randomFrom(untriedWords);
    try {
      return addWordToBoard(wordBank, board, wordToAdd);
    } catch (error) {
      untriedWords.splice(untriedWords.indexOf(wordToAdd), 1);
    }
  }
  throw new Error("Could not find a valid board state");
}

function addWordToBoard(
  wordBank: WordObject[],
  board: Board,
  wordToAdd: WordObject
): Board {
  if (!wordToAdd) {
    return board;
  }

  if (board.getWordCount() === 0) {
    const position = { x: 0, y: 0, direction: ACROSS };
    return addWordAtPosition(wordBank, board, wordToAdd, position);
  } else {
    const crosses = Array.from(wordToAdd.findCrosses(...board.getWords()));
    while (crosses.length) {
      const cross = randomFrom(crosses);
      try {
        const {
          character1: wordToAddCharacter,
          word2: activeWord,
          character2: activeCharacter,
        } = cross;
        const position: Position = calculatePosition(
          activeWord as ActiveWordObject,
          activeCharacter,
          wordToAddCharacter
        );
        return addWordAtPosition(wordBank, board, wordToAdd, position, cross);
      } catch (error) {
        crosses.splice(crosses.indexOf(cross), 1);
      }
    }
    throw new Error(`Could not find a viable position for ${wordToAdd.word}`);
  }
}

function addWordAtPosition(
  wordBank: WordObject[],
  previousBoardState: Board,
  wordToAdd: WordObject,
  position: Position,
  cross?: CrossObject
): Board {
  if (cross) {
    console.log(
      `Trying to cross ${wordToAdd.word.slice(0, cross.character1)}[${wordToAdd.characters[cross.character1]}]${wordToAdd.word.slice(cross.character1 + 1)} (${
        position.direction === ACROSS ? "across" : "down"
      }) with ${cross.word2.word.slice(0, cross.character2)}[${cross.word2.characters[cross.character2]}]${cross.word2.word.slice(cross.character2 + 1)} (${(cross.word2 as ActiveWordObject).direction === ACROSS ? "across" : "down"}) at ${cross.word2.characters[cross.character2]}`
    );
    if (!willFit(previousBoardState, wordToAdd, position, cross?.character1)) {
      throw new Error(`${wordToAdd.word} conflicts at ${position}`);
    }
  } else {
    console.log(
      `Adding ${wordToAdd.word} as first word ${position.direction === ACROSS ? "across" : "down"}`
    );
  }

  const board = previousBoardState.clone();
  board.addWord(new ActiveWordObject(wordToAdd, position));

  const remainingWordsToAdd = wordBank.slice(0);
  remainingWordsToAdd.splice(wordBank.indexOf(wordToAdd), 1);
  console.log(`\n\n${board.toString()}\n\n`);
  return addWordsToBoard(remainingWordsToAdd, board);
}

/**
 * Determine the direction and starting position of the added word
 * relative to where it crosses the active word.
 */
function calculatePosition(
  activeWord: Position,
  activeWordLetter: number,
  wordToAddLetter: number
): Position {
  const curCross: Position = {
    x: activeWord.x,
    y: activeWord.y,
    direction: ACROSS,
  };
  if (activeWord.direction === ACROSS) {
    // If the word we're crossing is ACROSS, we're DOWN
    curCross.direction = DOWN;
    // The location of the word we're adding is in the column of the crossed word's letter
    curCross.x += activeWordLetter;
    // and count backward from the letter of the added word to the beginning of the added word to find the row
    curCross.y -= wordToAddLetter;
  } else {
    // If the word we're crossing is DOWN, we're ACROSS
    curCross.direction = ACROSS;
    // The location of the word we're adding is in the row of the crossed word's letter
    curCross.y += activeWordLetter;
    // and count backward from the letter of the added word to the beginning of the added word to find the column
    curCross.x -= wordToAddLetter;
  }
  return curCross;
}

function visualizeError(
  board: Board,
  wordToAdd: WordObject,
  position: Position,
  conflictingCoordinates: Coordinates,
  conflictType: string,
  where: string
): void {
  const conflictingCell = board.getCell(
    conflictingCoordinates.x,
    conflictingCoordinates.y
  )!;
  const visualizeError = board.clone();
  visualizeError.addWord(new ActiveWordObject(wordToAdd, position));
  visualizeError.setCell(conflictingCoordinates.x, conflictingCoordinates.y, {
    value: "-",
  });
  const text = styleText(
    "yellow",
    `${wordToAdd.word} ${conflictType} ${conflictingCell.value} from ${conflictingCell.words.keys().next().value?.word} ${where}`
  );
  const uncoloredGrid = visualizeError.toString();
  const grid = `${styleText(
    "yellow",
    uncoloredGrid.split("-")[0]
  )}${styleText("red", "-")}${styleText(
    "yellow",
    uncoloredGrid.split("-")[1]
  )}`;
  console.warn(`\n${text}\n${grid}`);
}

/**
 * Make sure adding the word at this position doesn't conflict with any other
 * words already on the board
 */
function willFit(
  board: Board,
  wordToAdd: WordObject,
  position: Position,
  crossCharacter: number
): boolean {
  const { x, y, direction } = position;

  const coordinatesCellBeforeWord = {
    x: x - (direction === ACROSS ? 1 : 0),
    y: y - (direction === DOWN ? 1 : 0),
  };
  const cellBeforeWord = board.getCell(
    coordinatesCellBeforeWord.x,
    coordinatesCellBeforeWord.y
  );
  if (cellBeforeWord?.value) {
    // If the square before the start of the word is occupied it's invalid before the words would run together
    // TODO: check if the combination is a real word and allow it
    visualizeError(
      board,
      wordToAdd,
      position,
      coordinatesCellBeforeWord,
      "would be flush with",
      "in the square before the word"
    );
    return false;
  }

  const cellAfterWord = board.getCell(
    x + (direction === ACROSS ? wordToAdd.word.length : 0),
    y + (direction === DOWN ? wordToAdd.word.length : 0)
  );
  if (cellAfterWord?.value) {
    // If the square after the end of the word is occupied it's invalid before the words would run together
    // TODO: check if the combination is a real word and allow it
    console.warn(
      `${wordToAdd.word} would be flush with ${cellAfterWord.value} from ${cellAfterWord.words.keys().next().value?.word} in square after it`
    );
    return false;
  }

  // Iterate over the board from the start of the new word to the end,
  // checking that each new character won't overwrite an existing character (unless it's the same)
  // and isn't perpendicularly next to existing characters which would run together.
  // TODO: allow perpendicular characters to run together if they form real words
  for (let m = 0; m < wordToAdd.word.length; m++) {
    if (m === crossCharacter) {
      // This is where we're crossing, so we know it's legitimate
      continue;
    }

    const perpendicularCoordinates: Coordinates[] = [];
    const perpendicularSquares: Array<Cell | null | undefined> = []; // The letters already on the board in this position and to either side of it
    if (direction === ACROSS) {
      // above position
      perpendicularCoordinates.push({ x: x + m, y: y - 1 });
      perpendicularSquares.push(
        board.getCell(
          perpendicularCoordinates[0].x,
          perpendicularCoordinates[0].y
        )
      );
      // position
      perpendicularCoordinates.push({ x: x + m, y });
      perpendicularSquares.push(
        board.getCell(
          perpendicularCoordinates[1].x,
          perpendicularCoordinates[1].y
        )
      );
      // below position
      perpendicularCoordinates.push({ x: x + m, y: y + 1 });
      perpendicularSquares.push(
        board.getCell(
          perpendicularCoordinates[2].x,
          perpendicularCoordinates[2].y
        )
      );
    } else {
      // left of position
      perpendicularCoordinates.push({ x: x - 1, y: y + m });
      perpendicularSquares.push(
        board.getCell(
          perpendicularCoordinates[0].x,
          perpendicularCoordinates[0].y
        )
      );
      // position
      perpendicularCoordinates.push({ x, y: y + m });
      perpendicularSquares.push(
        board.getCell(
          perpendicularCoordinates[1].x,
          perpendicularCoordinates[1].y
        )
      );
      // right of position
      perpendicularCoordinates.push({ x: x + 1, y: y + m });
      perpendicularSquares.push(
        board.getCell(
          perpendicularCoordinates[2].x,
          perpendicularCoordinates[2].y
        )
      );
    }

    if (
      perpendicularSquares[1] &&
      perpendicularSquares[1].value === wordToAdd.characters[m]
    ) {
      // If we're crossing another word but the characters align, we're good
      continue;
    }

    // Check for words alongside or a collision
    if (!!perpendicularSquares[0]) {
      // If the space before it wasn't empty,
      // then it's invalid because you're creating a new word
      visualizeError(
        board,
        wordToAdd,
        position,
        perpendicularCoordinates[0],
        "would be next to",
        "in the square before it"
      );
      return false;
    } else if (
      !!perpendicularSquares[1] &&
      perpendicularSquares[1].value !== wordToAdd.characters[m]
    ) {
      // If the space itself wasn't empty, and doesn't match
      // then it's invalid because there's a conflict
      // TODO: add active cross
      visualizeError(
        board,
        wordToAdd,
        position,
        perpendicularCoordinates[1],
        "would overwrite",
        ""
      );
      return false;
    } else if (!!perpendicularSquares[2]) {
      // If the space after it wasn't empty,
      // then it's invalid because you're creating a new word
      visualizeError(
        board,
        wordToAdd,
        position,
        perpendicularCoordinates[2],
        "would be next to",
        "in the square after it"
      );
      return false;
    }
  }

  return true;
}
