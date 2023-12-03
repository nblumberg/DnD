import { forest } from './elements.js';
import { addStatePropertyListener } from '../shared/state.js';

let transition = addStatePropertyListener('transition', (newTransition: number) => {
  transition = newTransition;
});

export function showImage(image: string, rotate = 0): Promise<void> {
  return new Promise(resolve => {
    forest.classList.add('navigateOut');
    setTimeout(() => {
      forest.style.backgroundImage = `url('${image}')`;
      forest.style.transform = `rotate(${rotate}deg)`;
      forest.classList.add('navigateIn');
      setTimeout(() => {
        forest.classList.remove('navigateOut');
        forest.classList.remove('navigateIn');
        resolve();
      }, transition);
    }, transition)
  });
}

const urlRegExp = /^url\((.+)\)$/;
export function getImage(): string {
  const matches = (forest.style.backgroundImage ?? '').match(urlRegExp);
  if (matches) {
    return matches[1];
  }
  return '';
}
