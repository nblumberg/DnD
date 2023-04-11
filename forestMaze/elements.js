export const forest = document.getElementById('forest');
export const upButton = document.getElementById('up');
export const upLabel = document.getElementById('upLabel');
export const rightButton = document.getElementById('right');
export const rightLabel = document.getElementById('rightLabel');
export const downButton = document.getElementById('down');
export const downLabel = document.getElementById('downLabel');
export const leftButton = document.getElementById('left');
export const leftLabel = document.getElementById('leftLabel');
export const restart = document.getElementById('restart');
export const clear = document.getElementById('clear');
export const status = document.getElementById('status');
export const dialog = document.getElementById('dialog');
export const dialogContent = document.getElementById('dialogContent');
export const dialogInput = document.getElementById('dialogInput');

const buttons = [upButton, rightButton, downButton, leftButton];

export function hideButtons() {
  buttons.forEach((button) => {
    button.classList.add('hidden');
  });
}

export function showButtons({ up, right, down, left }) {
  if (up) {
    upButton.classList.remove('hidden');
  }
  if (right) {
    rightButton.classList.remove('hidden');
  }
  if (down) {
    downButton.classList.remove('hidden');
  }
  if (left) {
    leftButton.classList.remove('hidden');
  }
}

const buttonsHidden = [false, false, false, false];
let buttonsDisabled = false;

export function disableDirections() {
  if (buttonsDisabled) {
    return;
  }
  buttonsDisabled = true;
  buttons.forEach((button, i) => {
    buttonsHidden[i] = button.classList.contains('hidden');
  });
  hideButtons();
}

export function enableDirections() {
  if (!buttonsDisabled) {
    return;
  }
  buttons.forEach((button, i) => {
    if (!buttonsHidden[i]) {
      button.classList.remove('hidden');
    }
  });
  buttonsDisabled = false;
}
