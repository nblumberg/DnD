import { dialog, dialogContent, dialogInput } from './elements.js';
import { disableDirections, enableDirections } from './showDirections.js';

export async function showText(text: string): Promise<void> {
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
    dialog.close();
    dialog.showModal();
  });
}

export async function getPlayerFeedback(text: string): Promise<string> {
  disableDirections();
  return new Promise((resolve) => {
    function closeDialog(event: Event) {
      if ('keyCode' in event && event.keyCode !== 13) {
        event.preventDefault();
        return;
      }
      const value = dialogInput.value;
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
    dialog.close();
    dialog.showModal();
  });

}

export async function getPlayerRoll(text: string): Promise<number> {
  const value = await getPlayerFeedback(text);
  return parseInt(value, 10);
}
