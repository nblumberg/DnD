export const forest = document.getElementById('forest');
export const upButton = document.getElementById('up');
export const rightButton = document.getElementById('right');
export const downButton = document.getElementById('down');
export const leftButton = document.getElementById('left');
export const restart = document.getElementById('restart');
export const clear = document.getElementById('clear');
export const status = document.getElementById('status');
export const dialog = document.getElementById('dialog');
export const dialogContent = document.getElementById('dialogContent');
export const dialogInput = document.getElementById('dialogInput');

const buttonDisplays = {};
let buttonsDisabled = false;
export function disableDirections() {
  if (buttonsDisabled) {
    return;
  }
  buttonsDisabled = true;
  buttonDisplays.up = upButton.style.display;
  buttonDisplays.right = rightButton.style.display;
  buttonDisplays.down = downButton.style.display;
  buttonDisplays.left = leftButton.style.display;

  upButton.style.display = 'none';
  rightButton.style.display = 'none';
  downButton.style.display = 'none';
  leftButton.style.display = 'none';
}

export function enableDirections() {
  if (!buttonsDisabled) {
    return;
  }
  upButton.style.display = buttonDisplays.up;
  rightButton.style.display = buttonDisplays.right;
  downButton.style.display = buttonDisplays.down;
  leftButton.style.display = buttonDisplays.left;
  buttonsDisabled = false;
}
