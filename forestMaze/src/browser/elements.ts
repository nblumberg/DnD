import { Location } from "../locations.js";

function getNonNullableElement(id: string): HTMLElement {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(`HTMLElement ${id} not found`);
  }
  return element;
}

export const forest = getNonNullableElement('forest');
export const upButton = getNonNullableElement('up');
export const upLabel = getNonNullableElement('upLabel');
export const rightButton = getNonNullableElement('right');
export const rightLabel = getNonNullableElement('rightLabel');
export const downButton = getNonNullableElement('down');
export const downLabel = getNonNullableElement('downLabel');
export const leftButton = getNonNullableElement('left');
export const leftLabel = getNonNullableElement('leftLabel');
export const restart = getNonNullableElement('restart') as HTMLButtonElement;
export const clear = getNonNullableElement('clear') as HTMLButtonElement;
export const status = getNonNullableElement('status');
export const dialog = getNonNullableElement('dialog') as HTMLDialogElement;
export const dialogContent = getNonNullableElement('dialogContent');
export const dialogInput = getNonNullableElement('dialogInput') as HTMLInputElement;

const buttons = [upButton, rightButton, downButton, leftButton];

export function hideButtons(): void {
  buttons.forEach((button) => {
    button.classList.add('hidden');
  });
}

export function showButtons({ up, right, down, left }: Location) {
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

export function disableDirections(): void {
  if (buttonsDisabled) {
    return;
  }
  buttonsDisabled = true;
  buttons.forEach((button, i) => {
    buttonsHidden[i] = button.classList.contains('hidden');
  });
  hideButtons();
}

export function enableDirections(): void {
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
