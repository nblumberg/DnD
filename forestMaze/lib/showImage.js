import { forest } from './elements.js';
import { getUrlParam } from './getUrlParam.js';
const transition = parseInt(getUrlParam('transition') ?? '', 10) || 2000;
export function showImage(image, rotate = 0) {
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
        }, transition);
    });
}
//# sourceMappingURL=showImage.js.map