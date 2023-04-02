const NAME_BLOCK = 'name_block';
const NAME_TEXT = 'name_text';
const HERO_IMAGE = 'hero';
const DESCRIPTION_BLOCK = 'description_block';
const DESCRIPTION_TEXT = 'description_text';
const ACTION_BLOCK = 'action_block';
const ACTION_TEXT = 'action_text';
const TARGET_BLOCK = 'target_block';
const TARGET_TEXT = 'target_text';
const DURATION_BLOCK = 'duration_block';
const DURATION_TEXT = 'duration_text';
const ATTUNEMENT_BLOCK = 'attunement_block';
const ATTUNEMENT_TEXT = 'attunement_text';

const htmlFactory = document.createElement('div');

function addBubble(name, icon, value) {
  if (!value) {
    return '';
  }
  return `<div name="${name}_block" class="block ${name}">
    <div name="${name}_text" class="text">${icon}${value}</div>
  </div>`;
}

function allFalse(entry) {
  return !entry;
}

function componentsToIcons(components) {
  if (!components) {
    return '';
  }
  return `${components.includes('V') ? '🗣️' : ''}${components.includes('S') ? '👐' : ''}${components.includes('M') ? '💰' : ''}`;
}

function createCardHtml({
  activate,
  affect,
  attunement,
  charges,
  components,
  damage,
  description,
  duration,
  hero,
  level,
  name,
  school,
  target,
  weight,
  size,
  gender,
  creatureType,
  height,
  alignment,
  age,
 }) {
  const topBubbles = [activate, target, affect, damage, duration, gender, creatureType, height].every(allFalse) ? '' : `
  <div class="bubbles">
    ${addBubble('activate', '🔛', activate)}
    ${addBubble('target', '🎯', target)}
    ${addBubble('affect', '🛡️', affect)}
    ${addBubble('damage', '🩸', damage)}
    ${addBubble('duration', '⏳', duration)}
    ${addBubble('gender', '', gender)}
    ${addBubble('size', '', size)}
    ${addBubble('creatureType', '', creatureType)}
    ${addBubble('alignment', '', alignment)}
  </div>
  `;

  const bottomBubbles = [charges, attunement, level, components, height, weight].every(allFalse) ? '' : `
  <div class="bubbles">
    ${addBubble('charges', '🔋', charges)}
    ${addBubble('attunement', '🔗', attunement)}
    ${addBubble('level', 'Lvl ', level)} <!-- 📜 -->
    ${addBubble('components', '', componentsToIcons(components))}
    ${addBubble('school', '', school)}
    ${addBubble('height', '', height)}
    ${addBubble('age', '⌛️', age)}
    ${addBubble('weight', '⚖️', weight)}
  </div>
  `;

  htmlFactory.innerHTML = `
<article class="item">
  <section class="outer">
    <div class="background">
      <header class="heading"></header>
      <div class="image"></div>
    </div>
    <figure class="fields">
      <figcaption name="${NAME_BLOCK}" class="heading">
        <h1 name="${NAME_TEXT}">${name}</h1>
      </figcaption>
      <div class="image">
        <img name="${HERO_IMAGE}" class="hero" src="${hero}" />
      </div>
    </figure>
  </section>
  <section class="outer">
    <div class="background">
      <!--<div class="activate"></div>-->
      <div class="description"></div>
    </div>
    <div class="fields">
      ${topBubbles}
      <div name="${DESCRIPTION_BLOCK}" class="description">
        <div name="${DESCRIPTION_TEXT}" class="text">${description}</div>
      </div>
      ${bottomBubbles}
    </div>
  </section>
</article>
  `;
  return htmlFactory.querySelector('.item');
}

function debug(...args) {
  console.log(...args);
}


class Card {
  static htmlFactory = document.createElement('div');

  constructor(args) {
    const { parentElement, name, hero, description, range } = args;
    this.element = createCardHtml(args);
    parentElement.append(this.element);

    this.name = name;
    this.#injectName(name);
    this.#injectDescription(description);
  }

  get nameBlockElement() {
    return this.element.querySelector(`[name="${NAME_BLOCK}"]`);
  }

  get nameTextElement() {
    return this.element.querySelector(`[name="${NAME_TEXT}"]`);
  }

  get heroImageElement() {
    return this.element.querySelector(`[name="${HERO_IMAGE}"]`);
  }

  get descriptionBlockElement() {
    return this.element.querySelector(`[name="${DESCRIPTION_BLOCK}"]`);
  }

  get descriptionTextElement() {
    return this.element.querySelector(`[name="${DESCRIPTION_TEXT}"]`);
  }

  #calculateHeadingFontSize({ innerHTML, targetHeight, targetWidth }) {
    return this.#calculateFontSize({ innerHTML, targetHeight, targetWidth, flexible: 'width', element: 'Name' });
  }

  #injectName(name) {
    const block = this.nameBlockElement;
    const targetWidth = block.offsetWidth;
    const targetHeight = block.offsetHeight;

    const fontSize = this.#calculateHeadingFontSize({ innerHTML: name, targetHeight: targetHeight * 0.95, targetWidth: targetWidth * 0.90 });

    const text = this.nameTextElement;
    text.style.fontSize = fontSize;
    text.innerHTML = name;
  }

  #calculateFontSize({ innerHTML, targetHeight, targetWidth, flexible, element }) {
    const hiddenMeasuringElement = document.createElement(flexible === 'height' ? 'div' : 'span');
    hiddenMeasuringElement.style.visibility = 'hidden';
    if (flexible === 'height') {
      hiddenMeasuringElement.style.width = `${targetWidth}px`;
    } else {
      hiddenMeasuringElement.style.height = `${targetHeight}px`;
    }
    document.body.append(hiddenMeasuringElement);
    hiddenMeasuringElement.innerHTML = innerHTML;
    let fontSize = parseInt(window.getComputedStyle(hiddenMeasuringElement).fontSize, 10);
    while (hiddenMeasuringElement.offsetHeight < targetHeight && hiddenMeasuringElement.offsetWidth < targetWidth) {
      debug(`${this.name} ${element}: ${hiddenMeasuringElement.offsetWidth}px x ${hiddenMeasuringElement.offsetHeight}px < ${targetWidth}px x ${targetHeight}px @ ${fontSize}px font, increase`);
      hiddenMeasuringElement.style.fontSize = `${++fontSize}px`;
    }
    while ((hiddenMeasuringElement.offsetHeight > targetHeight || hiddenMeasuringElement.offsetWidth > targetWidth) && fontSize > 4) {
      debug(`${this.name} ${element}: ${hiddenMeasuringElement.offsetWidth}px x ${hiddenMeasuringElement.offsetHeight}px > ${targetWidth}px x ${targetHeight}px @ ${fontSize}px font, decrease`);
      hiddenMeasuringElement.style.fontSize = `${--fontSize}px`;
    }
    debug(`${this.name} ${element}: ${hiddenMeasuringElement.offsetWidth}px x ${hiddenMeasuringElement.offsetHeight}px @ ${fontSize}px font`);
    hiddenMeasuringElement.remove();
    return `${fontSize}px`;

  }

  #calculateDescriptionFontSize({ innerHTML, targetHeight, targetWidth }) {
    return this.#calculateFontSize({ innerHTML, targetHeight, targetWidth, flexible: 'height', element: 'Description' });
  }

  #injectDescription(description) {
    const targetHeight = this.descriptionBlockElement.offsetHeight;
    const text = this.descriptionTextElement;
    const targetWidth = text.offsetWidth;

    let inList = false;
    const innerHTML = description.split('\n').map(line => {
      const isListItem = line.trim().charAt(0) === '*';
      let result;
      if (isListItem) {
        result = `${inList ? '' : '<ul>'}<li>${line.trim().substr(2)}</li>`;
        inList = true;
      } else {
        result = `${inList ? '</ul>' : ''}<p>${line}</p>`;
        inList = false;
      }
      return result;
    }).join('');

    const fontSize = this.#calculateDescriptionFontSize({ innerHTML, targetHeight, targetWidth });
    text.style.fontSize = fontSize;
    text.innerHTML = innerHTML;
  }

}

export default Card;
