import { setRandomSeed } from '../../shared/random.js';
import { Cell, boardToHtml, populateBoard } from './board.js';
import { addButtons, createClues, createLetterInputs, createWordInput, getWordsFromInputs, render, unnumberClues } from './dom.js';
import { startPlaying } from './mode.js';
import { boardToQueryString, isPlaying, queryStringToBoard, queryStringToClues } from './queryStringUtils.js';

let board: Cell[][];

export function playCrossWord() {
  const url = new URL(window.location.href);
  url.search = boardToQueryString(board);
  window.open(url.toString(), 'playableCrossword');
}

export function createCrossWord() {
    getWordsFromInputs();

    let isSuccess = false;
    for (let i = 0; i < 10 && !isSuccess; i++) {
      ({ isOk: isSuccess, board } = populateBoard());
    }

    isSuccess ? boardToHtml(board) : render('Could not cross all the words.');
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

if (isPlaying()) {
  board = queryStringToBoard();
  boardToHtml(board);
  createLetterInputs();
  createClues(queryStringToClues());
  startPlaying();
} else {
  defaultWords.forEach(([word, clue]) => createWordInput(word, clue));
  createWordInput();
  setRandomSeed('something');
  addButtons(createCrossWord, unnumberClues, playCrossWord);
}

