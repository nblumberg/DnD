import { dialog, dialogContent, dialogInput, disableDirections, enableDirections } from './elements.js';

export async function showText(text) {
  disableDirections();
  return new Promise((resolve) => {
    function closeDialog() {
      dialog.close();
      dialog.removeEventListener('click', closeDialog);
      dialog.removeEventListener('close', closeDialog);
      setTimeout(() => {
        enableDirections();
        resolve();
      }, 50);
    }
    dialog.addEventListener('click', closeDialog);
    dialog.addEventListener('close', closeDialog);
    dialogInput.style.display = 'none';
    dialogContent.innerText = text;
    dialog.showModal();
  });
}

export async function getPlayerRoll(text) {
  disableDirections();
  return new Promise((resolve) => {
    function closeDialog(event) {
      if (event.keyCode !== 13) {
        event.preventDefault();
        return;
      }
      const value = parseInt(dialogInput.value, 10);
      dialog.close();
      dialogInput.removeEventListener('keyup', closeDialog);
      dialog.removeEventListener('close', closeDialog);
      setTimeout(() => {
        enableDirections();
        resolve(value);
      }, 50);
    }
    dialogInput.addEventListener('keyup', closeDialog);
    dialog.addEventListener('close', closeDialog);
    dialogInput.style.display = '';
    dialogInput.value = '';
    dialogContent.innerText = text;
    dialog.showModal();
  });
}
