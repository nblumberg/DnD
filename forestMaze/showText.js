import { dialog } from './elements.js';

export async function showText(text) {
  return new Promise((resolve) => {
    function closeDialog() {
      dialog.close();
      dialog.removeEventListener('click', closeDialog);
      dialog.removeEventListener('close', closeDialog);
      resolve();
    }
    dialog.addEventListener('click', closeDialog);
    dialog.addEventListener('close', closeDialog);
    dialog.innerText = text;
    dialog.showModal();
  });
}

export async function getPlayerRoll(text) {
  return new Promise((resolve) => {
    const value = prompt(text);
    resolve(value);
  });
}
