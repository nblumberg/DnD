import { setRandomSeed } from '../../shared/random.js';
import { Cell, boardToHtml, populateBoard } from './board.js';
import { addButtons, createClues, createLetterInputs, createWordInput, getPlayableLink, getWordsFromInputs, render, unnumberClues, updatePlayableLink } from './dom.js';
import { startPlaying } from './mode.js';
import { isPlaying, queryStringToBoard, queryStringToClues } from './queryStringUtils.js';

export function playCrossWord() {
  window.open(getPlayableLink(), 'playableCrossword');
}

export function createCrossWord() {
    getWordsFromInputs();

    let isSuccess = false;
    let board: Cell[][] | undefined;
    for (let i = 0; i < 10 && !isSuccess; i++) {
      ({ isOk: isSuccess, board } = populateBoard());
    }

    if (isSuccess && board) {
      boardToHtml(board);
      updatePlayableLink(board);
    } else {
      render('Could not cross all the words.');
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

if (isPlaying()) {
  boardToHtml(queryStringToBoard());
  createLetterInputs();
  createClues(queryStringToClues());
  startPlaying();
} else {
  defaultWords.forEach(([word, clue]) => createWordInput(word, clue));
  createWordInput();
  setRandomSeed('something');
  addButtons(createCrossWord, unnumberClues, playCrossWord);
}

