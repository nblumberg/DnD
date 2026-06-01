import { KeyboardEvent, ReactNode, useContext, useMemo, useState } from "react";
import { ACROSS, ActiveWord, Board, Cell, DOWN } from "../board";
import { BoardContext } from "./BoardContext";
import styles from "./Crossword.module.scss";
import {
  SetWords,
  WordCorrect,
  WordsContext,
  WordsCorrectMap,
} from "./WordsContext";

const validValueRegExp = /^[A-Z]$/;

export function Square({
  x,
  y,
  letter,
}: {
  x: number;
  y: number;
  letter?: string;
}) {
  const [value, setValue] = useState<string | undefined>();
  const board = useContext(BoardContext);
  const [words, setWords] = useContext(WordsContext);
  const cell = board?.getCell(x, y);
  const isCorrect = useMemo(
    () => checkWords(words, setWords, board, cell),
    [words]
  );

  let content: ReactNode = letter;
  if (window.mode === "play" && letter) {
    const onKeyUp = (event: KeyboardEvent<HTMLInputElement>): void => {
      const key = event.key.toUpperCase();
      if (validValueRegExp.test(key) || key === "Delete") {
        const value = key === "Delete" ? "" : key;
        setValue(value);
        checkWords(words, setWords, board, cell, value);
      }
      navigate(event, board, cell) || next(board, cell);
    };

    content = (
      <span>
        {cell?.cellNumbers?.ACROSS && (
          <span className={`${styles.number} ${styles.across}`}>
            {cell?.cellNumbers?.ACROSS}
          </span>
        )}
        <input
          type="text"
          size={1}
          value={value}
          onKeyUp={onKeyUp}
          className={isCorrect ? styles.correct : ""}
        />
        {cell?.cellNumbers?.DOWN && (
          <span className={`${styles.number} ${styles.down}`}>
            {cell?.cellNumbers?.DOWN}
          </span>
        )}
      </span>
    );
  }

  const classes = `${styles.square} ${letter ? styles.letter : ""}`;
  return (
    <div className={classes} data-x={x} data-y={y} data-letter={letter}>
      {content}
    </div>
  );
}

function cellToSquare(cell?: Cell): HTMLInputElement | null {
  if (!cell) {
    return null;
  }
  return document.querySelector(
    `[data-x="${cell.coordinates.x}"][data-y="${cell.coordinates.y}"] input`
  );
}

/**
 * Focus on a new square.
 * Include a wait to prevent the KeyUp event, etc. from happening in the new cell
 * @param {Cell} [newCell] The Cell to select
 */
async function select(newCell?: Cell): Promise<void> {
  if (!newCell) {
    return;
  }
  const input = cellToSquare(newCell);
  if (!input) {
    return;
  }
  await new Promise((resolve) => {
    setTimeout(resolve, 10);
  });
  input.focus();
}

function navigate(
  event: KeyboardEvent<HTMLInputElement>,
  board?: Board,
  cell?: Cell
): boolean {
  if (!board || !cell) {
    return false;
  }
  const { x, y } = cell.coordinates;
  let newCell: Cell | undefined;
  switch (event.key) {
    case "ArrowUp": {
      newCell = board.getCell(x, y)?.up();
      break;
    }
    case "ArrowRight": {
      newCell = board.getCell(x, y)?.right();
      break;
    }
    case "ArrowDown": {
      newCell = board.getCell(x, y)?.down();
      break;
    }
    case "ArrowLeft": {
      newCell = board.getCell(x, y)?.left();
      break;
    }
  }
  if (newCell) {
    event.preventDefault();
    select(newCell);
    return true;
  }
  return false;
}

function next(board?: Board, cell?: Cell): void {
  if (!board || !cell) {
    return;
  }
  let wordToContinue: ActiveWord | undefined;
  const words = Array.from(cell.words?.keys());
  if (
    words.length === 1 &&
    cell.words.get(words[0]) !== words[0].word.length - 1
  ) {
    wordToContinue = words[0];
  } else {
    const { x, y } = cell.coordinates;
    wordToContinue = words
      .filter(
        // Not at the end of the word
        (word) => cell.words.get(word) !== word.word.length - 1
      )
      .find(({ direction }) => {
        // The previous square is filled in
        const previousCell = board.getCell(
          x - (direction === ACROSS ? 1 : 0),
          y - (direction === DOWN ? 1 : 0)
        );
        const previousSquare = cellToSquare(previousCell);
        return !!previousSquare?.value;
      });
  }
  if (!wordToContinue) {
    return;
  }
  const { direction } = wordToContinue;
  const newCell: Cell | undefined =
    direction === DOWN ? cell.down() : cell.right();
  select(newCell);
}

function checkAllWordsInCellCorrect({
  allWords,
  cell,
}: {
  allWords: WordsCorrectMap;
  cell: Cell;
}): boolean {
  if (!allWords || !cell) {
    return false;
  }
  const words = Array.from(cell.words.keys());
  return words.every((word) => allWords.get(word)?.wordCorrect);
}

function checkAllCellsInWordComplete({
  allWords,
  word,
  board,
}: {
  allWords: WordsCorrectMap;
  word: ActiveWord;
  board: Board;
}) {
  if (!allWords || !board || !word) {
    return false;
  }
  let allCellsComplete = true;
  for (let i = 0; i < word.word.length; i++) {
    const cell = board.getCell(
      word.x + (word.direction === ACROSS ? i : 0),
      word.y + (word.direction === DOWN ? i : 0)
    );
    if (!cell) {
      return false;
    }
    if (!checkAllWordsInCellCorrect({ allWords, cell })) {
      allCellsComplete = false;
    }
  }
  return allCellsComplete;
}

function checkAllCellsInWordCorrect({
  board,
  word,
  cell,
  key,
}: {
  board: Board;
  word: ActiveWord;
  cell?: Cell;
  key?: string;
}): boolean {
  if (!board || !word) {
    return false;
  }
  for (let i = 0; i < word.word.length; i++) {
    const wordCell = board.getCell(
      word.x + (word.direction === ACROSS ? i : 0),
      word.y + (word.direction === DOWN ? i : 0)
    );
    if (!wordCell) {
      return false;
    }
    const wordSquare = cellToSquare(wordCell);
    if (!wordSquare) {
      return false;
    }
    const currentValue = (cell === wordCell && key) || wordSquare.value;
    if (currentValue !== wordCell.value) {
      return false;
    }
  }
  return true;
}

function checkWords(
  allWords: WordsCorrectMap,
  setWords: SetWords,
  board?: Board,
  cell?: Cell,
  key?: string
): boolean {
  if (!board || !cell) {
    return false;
  }

  const newWords = new Map<ActiveWord, WordCorrect>(allWords);
  let stateChanged = false;

  // Check if words are correct
  for (const word of allWords.keys()) {
    const wordCorrect = checkAllCellsInWordCorrect({
      board,
      word,
      cell,
      key,
    });
    let entry = newWords.get(word);
    if (!entry) {
      entry = { wordCorrect: false, allCellsComplete: false };
      newWords.set(word, entry);
    }
    if (wordCorrect !== entry.wordCorrect) {
      stateChanged = true;
      newWords.set(word, { ...entry, wordCorrect });
    }
  }

  // Check if all words for all cells in a word are correct
  for (const word of allWords.keys()) {
    const allCellsComplete = checkAllCellsInWordComplete({
      allWords: newWords,
      board,
      word,
    });
    let entry = newWords.get(word);
    if (!entry) {
      entry = { wordCorrect: false, allCellsComplete: false };
      newWords.set(word, entry);
    }
    if (allCellsComplete !== entry.allCellsComplete) {
      stateChanged = true;
      newWords.set(word, { ...entry, allCellsComplete });
    }
  }

  if (stateChanged) {
    try {
      setWords(newWords);
    } catch (error) {
      console.log(error);
    }
  }

  const words = Array.from(cell.words.keys());
  return words.every((word) => allWords.get(word)?.allCellsComplete);
}
