import { ACROSS, DOWN } from './words.js';
import { populateBoard, boardToHtml, Cell, ActiveWord } from './board.js';
import { addButtonListeners, getWordsFromInputs, toggleWordInputs, createLetterInputs, render, createWordInput, clearBoard } from './dom.js';
import { isPlaying, startPlaying, stopPlaying } from './mode.js';
import { setRandomSeed } from '../../shared/random.js';

let board: Cell[][];
let words: ActiveWord[];

export function playCrossWord() {
  const url = new URL(window.location.href);
  const data = {
    board: board.filter(row => !row.every(({ value }) => !value)).map(row => row.map(cell => {
      const value = cell.value ?? 0;
      if (cell.word && cell.wordIndex === 0) {
        return [value, cell.word.dir, cell.word.num];
      }
      return [value];
    })),
    clues: {
      across: words.filter(({ dir }) => dir === ACROSS).map(({ clue }) => clue),
      down: words.filter(({ dir }) => dir === DOWN).map(({ clue }) => clue),
    }
  };
  url.search = `data=${JSON.stringify(data)}`;
  window.open(url.toString(), 'playableCrossword');
  createLetterInputs();
  startPlaying();
  toggleWordInputs(false);
}

export function createCrossWord() {
  if (isPlaying()) {
    toggleWordInputs(true);
    clearBoard();
    stopPlaying();
  } else {
    getWordsFromInputs();

    let isSuccess = false;
    for (let i = 0; i < 10 && !isSuccess; i++) {
      ({ isOk: isSuccess, board, words } = populateBoard());
    }

    isSuccess ? boardToHtml() : render('Could not cross all the words.');
  }
}

const defaultWords = [
  ['Prismeer', 'Land of broken white light'],
  ['Zybilna', 'Queen of chips and cheese'],
  ['Ootz', 'Ye Royale Curser'],
  ['Nacho', 'The prodigal eye'],
  ['Bavlorna', 'Bug-eyed toad'],
  ['Frozri', '5 down, 1 to go'],
  ['Watcher', 'Antlered anaconda'],
  ['Longscarf', "The Brigand Prince's accoutrement"],
];

defaultWords.forEach(([word, clue]) => createWordInput(word, clue));
createWordInput();
setRandomSeed('something');
addButtonListeners(createCrossWord, playCrossWord);

