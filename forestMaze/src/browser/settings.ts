import { getJson, postJson } from '../fetchJson.js';

const DISABLED = 'DISABLED';

function createSelect(parentElement: HTMLElement, key: string, values: string[][], value: string): HTMLSelectElement {
  const select = document.createElement('select');
  select.id = key;
  parentElement.appendChild(select);
  let option: HTMLOptionElement;
  select.selectedIndex = 0;
  values.forEach(([text, subValue], i) => {
    option = document.createElement('option');
    option.innerText = `${text.charAt(0).toUpperCase()}${text.substr(1)}`;
    option.value = subValue;
    if (subValue === DISABLED) {
      option.disabled = true;
    }
    select.appendChild(option);
    if (value === option.value) {
      select.selectedIndex = i;
    }
  });
  return select;
}

function createInput(parentElement: HTMLElement, key: string, value: string): HTMLInputElement {
  const input = document.createElement('input');
  input.id = key;
  parentElement.appendChild(input);
  switch (typeof value) {
    case 'boolean':
      input.type = 'checkbox';
      input.checked = value;
      break;
    case 'number':
      input.type = 'number';
      input.min = '0';
      input.step = '1';
      // input.max = '21';
    case 'string':
    default:
      input.value = value;
      break;
  }
  return input;
}

function createTextArea(parentElement: HTMLElement, key: string, value: string): HTMLTextAreaElement {
  const textarea = document.createElement('textarea');
  textarea.id = key;
  parentElement.appendChild(textarea);
  textarea.value = value;
  const lines = value.split('\n');
  textarea.style.height = `${lines.length + 1}em`;
  textarea.style.width = `${lines.reduce((max, line) => Math.max(max, line.length), 0) + 1}em`;
  return textarea;
}

function onSubmit() {
  const form = document.getElementById("form") as HTMLFormElement;
  const state: Record<string, any> = {};
  Array.prototype.forEach.call(form.elements, (input) => {
    const { parentElement } = input;
    const { key, type } = parentElement.dataset;
    let value;
    switch (type) {
      case 'array':
        value = Array.prototype.map.call(parentElement.querySelectorAll('input'), (input) => input.value);
        break;
      case 'boolean':
        value = input.checked;
        break;
      case 'number':
        value = parseInt(input.value, 10);
        break;
      case 'object':
        value = { up: [], right: [], down: [], left: [] };
        break;
      case 'string':
      default:
        value = input.value;
        break;
    }
    state[key] = value;
  });
  postJson('./state', state);
}

async function init(state: Record<string, any>) {
  const submitButton = document.getElementById("submit") as HTMLButtonElement;
  submitButton.addEventListener('click', onSubmit);

  const [locations, encounters] = await Promise.all([
    getJson('./locations') as Promise<{ name: string; }[]>,
    getJson('./encounters') as Promise<{ name: string; id: string; }[]>,
  ]);

  const form = document.getElementById("form") as HTMLFormElement;
  Object.entries(state).forEach(([key, value]) => {
    let row = document.createElement('div');
    row.dataset.key = key;
    row.dataset.type = Array.isArray(value) ? 'array' : typeof value;
    form.appendChild(row);
    const label = document.createElement('label') as HTMLLabelElement;
    label.htmlFor = key;
    label.innerText = `${key.charAt(0).toUpperCase()}${key.substr(1)}:`;
    row.appendChild(label);
    switch (key) {
      case 'path':
        createSelect(row, key, [['--', DISABLED], ['hither', '../hither'], ['vermeillon', '../vermeillon']], value);
        return;
      case 'destination':
      case 'location':
          createSelect(row, key, [['--', DISABLED], ...locations.map(({ name }) => [name, name])], value);
        return;
      case 'encounter':
        createSelect(row, key, [['[none]', ''], ...encounters.map(({ name, id }) => [name, `${id} ${name}`])], value);
        return;
      case 'votes':
        createTextArea(row, key, JSON.stringify(value, null, 2)).disabled = true;
        return;
      default:
        if (Array.isArray(value)) {
          label.htmlFor = `${key}_0`;
          value.forEach((subValue, i) => {
            createInput(row, `${key}_${i}`, subValue);
          });
        } else {
          createInput(row, key, value);
        }
        return;
    }
  });
}

getJson('./state').then(init);
