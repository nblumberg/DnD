
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
export const upVotes = getNonNullableElement('upVotes');
export const rightButton = getNonNullableElement('right');
export const rightLabel = getNonNullableElement('rightLabel');
export const rightVotes = getNonNullableElement('rightVotes');
export const downButton = getNonNullableElement('down');
export const downLabel = getNonNullableElement('downLabel');
export const downVotes = getNonNullableElement('downVotes');
export const leftButton = getNonNullableElement('left');
export const leftLabel = getNonNullableElement('leftLabel');
export const leftVotes = getNonNullableElement('leftVotes');
export const buttonBar = getNonNullableElement('buttonBar');
export const restart = getNonNullableElement('restart') as HTMLButtonElement;
export const clear = getNonNullableElement('clear') as HTMLButtonElement;
export const status = getNonNullableElement('status');
export const dialog = getNonNullableElement('dialog') as HTMLDialogElement;
export const dialogContent = getNonNullableElement('dialogContent');
export const dialogInput = getNonNullableElement('dialogInput') as HTMLInputElement;
