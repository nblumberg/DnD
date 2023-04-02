import Card from './Card.js';
import getItems from './items.js';
import './sheets.js';

const params = new URLSearchParams(window.location.search);
const filterNames = (params.get('name') || '').toLowerCase();
const filterTags = (params.get('tags') || '').toLowerCase();
let page = parseInt(params.get('page'), 10);
const pageSize = parseInt(params.get('pageSize'), 10) || 4;
const parentElement = document.getElementById('items');

function injectItem(item) {
  new Card({ ...item, parentElement });
}

function injectNav() {
  const nav = document.createElement('nav');
  document.body.append(nav);

  const previous = document.createElement('button');
  nav.append(previous);
  previous.innerHTML = '⏪';
  previous.addEventListener('click', () => {
    params.set('page', page - 1);
    window.location = `${window.location.href}`.replace(window.location.search, `?${params.toString()}`);
  });
  const next = document.createElement('button');
  nav.append(next);
  next.innerHTML = '⏩';
  next.addEventListener('click', () => {
    params.set('page', page + 1);
    window.location = `${window.location.href}`.replace(window.location.search, `?${params.toString()}`);
  });
}

function parseList(str) {
    return str.toLowerCase().split(',').map(item => item.trim());
}

async function main() {
  let items = await getItems();

  if (filterNames) {
    if (filterNames.includes('!')) {
      const negativeFilterTerm = filterNames.replace('!', '');
      items = items.filter(({ name }) => !name.toLowerCase().includes(negativeFilterTerm));
    } else {
      items = items.filter(({ name }) => name.toLowerCase().includes(filterNames));
    }
  }
  if (filterTags) {
    const targetTags = parseList(filterTags);
    items = items.filter(({ tags = '' }) => {
        const itemTags = parseList(tags);
        return targetTags.every(tag => itemTags.includes(tag));
    });
  }

  if (page) {
    items.slice((page - 1) * pageSize, page * pageSize).forEach(injectItem);
    injectNav();
  } else {
    items.forEach(injectItem);
  }
}
main();
