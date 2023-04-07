import { dialog, dialogContent, dialogInput } from './elements.js';

export async function showText(text) {
  return new Promise((resolve) => {
    function closeDialog() {
      dialog.close();
      dialog.removeEventListener('click', closeDialog);
      dialog.removeEventListener('close', closeDialog);
      setTimeout(() => resolve(), 50);
    }
    dialog.addEventListener('click', closeDialog);
    dialog.addEventListener('close', closeDialog);
    dialogInput.style.display = 'none';
    dialogContent.innerText = text;
    dialog.showModal();
  });
}

export async function getPlayerRoll(text) {
  return new Promise((resolve) => {
    function closeDialog(event) {
      if (event.keyCode !== 13) {
        return false;
      }
      const value = dialogInput.value;
      dialog.close();
      dialogInput.removeEventListener('keyup', closeDialog);
      dialog.removeEventListener('close', closeDialog);
      setTimeout(() => resolve(value), 50);
    }
    dialogInput.addEventListener('keyup', closeDialog);
    dialog.addEventListener('close', closeDialog);
    dialogInput.style.display = '';
    dialogInput.value = '';
    dialogContent.innerText = text;
    dialog.showModal();
  });
}
