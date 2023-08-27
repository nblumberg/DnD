import { addWord, clearWords } from './words.js';

export function createWordInput(word = '', clue = ''): void {
  const parentElement = document.getElementById('words') as HTMLDivElement;
  if (!parentElement) {
    throw new Error(`Could not find #words`);
  }

  function addNewWord(): void {
    if (wordInput.value.trim() && Array.from(parentElement.children).indexOf(wordAndClue) === parentElement.children.length - 1) {
      createWordInput();
      wordInput.removeEventListener('change', addNewWord);
    }
  }

  const wordAndClue = document.createElement('li');
  wordAndClue.classList.add('line');
  parentElement.appendChild(wordAndClue);
  const wordInput = document.createElement('input');
  wordInput.type = 'text';
  wordInput.classList.add('word');
  wordInput.value = word.toUpperCase();
  wordAndClue.appendChild(wordInput);
  const clueInput = document.createElement('input');
  clueInput.type = 'text';
  clueInput.classList.add('clue');
  clueInput.value = clue;
  wordAndClue.appendChild(clueInput);

  wordInput.addEventListener('keyUp', () => {
    wordInput.value = wordInput.value.toUpperCase();
  });
  if (!(word && clue)) {
    wordInput.addEventListener('change', addNewWord);
  }
}

export function getWordsFromInputs() {
  clearWords();
  const wordsInputs = Array.from(document.getElementsByClassName('word')) as HTMLInputElement[];
  wordsInputs.forEach((wordInput, i) => {
    const word = wordInput.value.toUpperCase();
    const clue = (wordInput.nextElementSibling as HTMLInputElement).value;
    if (word !== null && word.length > 1) {
      addWord(word, clue);
      console.log(word, clue);
    }
  });
}

export function toggleWordInputs(editing: boolean) {
  const wordInputs = document.getElementsByClassName('word');
  const clueInputs = document.getElementsByClassName('clue');

  for (let i = 0; i < wordInputs.length; i++) {
    if (editing) {
      wordInputs[i].classList.remove('hide');
      clueInputs[i].classList.remove('clueReadOnly');
      clueInputs[i].removeAttribute('disabled');
    } else {
      wordInputs[i].classList.add('hide');
      clueInputs[i].classList.add('clueReadOnly');
      clueInputs[i].setAttribute('disabled', 'readonly');
    }
  }
}

interface ButtonEventListener {
  (event: MouseEvent): void;
}

export function addButtonListeners(createCrossWord: ButtonEventListener, playCrossWord: ButtonEventListener): void {
  const crossword = document.getElementById('crossword');
  if (!crossword) {
    throw new Error(`Can't find #crossword`);
  }
  crossword.addEventListener('focus', () => false);

  const create = document.getElementById('create');
  if (!create) {
    throw new Error(`Can't find #create`);
  }
  create.addEventListener('click', createCrossWord, false);

  const play = document.getElementById('play');
  if (!play) {
    throw new Error(`Can't find #play`);
  }
  play.addEventListener('click', playCrossWord, false);
}

export function createLetterInputs(): void {
  const inputs: HTMLInputElement[] = [];
  Array.from(document.getElementsByClassName('letter')).forEach(element => {
    element.innerHTML = '';
    const input = document.createElement('input');
    const index = inputs.length;
    inputs.push(input);
    input.type = 'text';
    input.maxLength = 1;
    input.classList.add('char');
    element.appendChild(input);
    input.addEventListener('keyup', event => {
      if (/^[a-zA-Z]$/.test(event.key) && input.value || event.key === 'ArrowRight') {
        inputs[(index + 1) % inputs.length].focus();
      } else if (event.key === 'ArrowLeft') {
        if (index === 0) {
          inputs[inputs.length - 1].focus();
        } else {
          inputs[(index - 1) % inputs.length].focus();
        }
      } else if (event.key === 'ArrowUp') {

      }
    });
  });
}

function getCrossword(): HTMLDivElement {
  const id = 'crossword';
  const crossword = document.getElementById(id) as HTMLDivElement;
  if (!crossword) {
    throw new Error(`Can't find #${id}`);
  }
  return crossword;
}

export function render(html: string): void {
  getCrossword().innerHTML = html;
}

export function clearCrossWordDisplay(): void {
  render('');
}

export function createRow(id: string): void {
  const row = document.createElement('div');
  row.classList.add('row');
  row.id = id;
  getCrossword().appendChild(row);
}

export function createCell(rowId: string, content: string, numbers: { ACROSS?: number; DOWN?: number; }): void {
  const row = document.getElementById(rowId);
  if (!row) {
    throw new Error(`Can't find row #${rowId}`);
  }

  const cell = document.createElement('div');
  cell.innerHTML = content;
  (content ? ['square', 'letter'] : ['square']).forEach(className => cell.classList.add(className));
  if (numbers.ACROSS) {
    cell.classList.add('across');
    cell.classList.add(`across-${numbers.ACROSS}`);
    cell.dataset.across = `${numbers.ACROSS}`;
  }
  if (numbers.DOWN) {
    cell.classList.add('down');
    cell.classList.add(`down-${numbers.DOWN}`);
    cell.dataset.down = `${numbers.DOWN}`;
  }
  row.appendChild(cell);
}

export function numberClues(acrossWords: string[], downWords: string[]): void {
  const wordInputs = Array.from(document.querySelectorAll('.word')) as HTMLInputElement[];
  const acrossElements = acrossWords.map(word => wordInputs.find(input => input.value === word)).filter(input => !!input).map(input => input!.parentElement!);
  const downElements = downWords.map(word => wordInputs.find(input => input.value === word)).filter(input => !!input).map(input => input!.parentElement!);
  const wordsParentElement = document.getElementById('words')!;
  wordsParentElement.innerHTML = '';
  const acrossParentElement = document.createElement('div');
  wordsParentElement.appendChild(acrossParentElement);
  acrossParentElement.classList.add('direction');
  const acrossTitle = document.createElement('h1');
  acrossTitle.innerText = 'Across';
  acrossParentElement.appendChild(acrossTitle);
  const acrossList = document.createElement('ol');
  acrossParentElement.appendChild(acrossList);
  acrossElements.forEach(element => {
    acrossList.appendChild(element);
  });
  const downParentElement = document.createElement('div');
  wordsParentElement.appendChild(downParentElement);
  downParentElement.classList.add('direction');
  const downTitle = document.createElement('h1');
  downTitle.innerText = 'Down';
  downParentElement.appendChild(downTitle);
  const downList = document.createElement('ol');
  downParentElement.appendChild(downList);
  downElements.forEach(element => {
    downList.appendChild(element);
  });
}

export function createClues({ across, down }: { across: string[], down: string[] }): void {
  const wordsParentElement = document.getElementById('words')!;
  if (!wordsParentElement) {
    throw new Error(`Could not find #words element`);
  }
  wordsParentElement.innerHTML = '';
  const acrossParentElement = document.createElement('div');
  wordsParentElement.appendChild(acrossParentElement);
  acrossParentElement.classList.add('direction');
  const acrossTitle = document.createElement('h1');
  acrossTitle.innerText = 'Across';
  acrossParentElement.appendChild(acrossTitle);
  const acrossList = document.createElement('ol');
  acrossParentElement.appendChild(acrossList);
  across.forEach(clue => {
    const li = document.createElement('li');
    li.innerText = clue;
    acrossList.appendChild(li);
  });
  const downParentElement = document.createElement('div');
  wordsParentElement.appendChild(downParentElement);
  downParentElement.classList.add('direction');
  const downTitle = document.createElement('h1');
  downTitle.innerText = 'Down';
  downParentElement.appendChild(downTitle);
  const downList = document.createElement('ol');
  downParentElement.appendChild(downList);
  down.forEach(clue => {
    const li = document.createElement('li');
    li.innerText = clue;
    downList.appendChild(li);
  });
}

export function markPlaying(playing = true): void {
  document.body.classList[playing ? 'add' : 'remove']('play');
}
