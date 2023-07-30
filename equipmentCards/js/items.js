import unsortedItems from './data.js';

async function createItem([
  name,
  itemUrl,
  type,
  image,
  clickable,
  imageUrl,
  character,
  quantity,
  weightEach,
  weightTotal,
  valueEach,
  valueTotal,
  location,
  magic,
  attunement,
  acquired,
  acquiredDetail
]) {

  if (itemUrl) {
    return fetch(itemUrl, { cache: 'force-cache' }).then((response) => {
      return response.text();
    }).then((text) => {
      const documentFragment = document.createDocumentFragment();
      const body = document.createElement('div');
      documentFragment.append(div);
      body.innerHTML = text;
      const itemInfo = body.querySelector('#content .detail-content .item-info .details').innerText.trim();
      console.log(itemInfo);
      const description = body.querySelector('#content .detail-content .more-info-content').innerHTML.trim();
      return {
        name,
        hero: imageUrl,
        weight: weightEach,
        description,
      };
    }).catch((error) => {
      console.log(error);
      return {
        name,
        hero: imageUrl,
        weight: weightEach,
        description: 'Error fetching data',
      };
    });
  }

  return {
    name,
    hero: imageUrl,
    weight: weightEach,
    description: 'No description',
  };
}

async function getItems() {
  const items = [...unsortedItems].sort(({ name: nameA }, { name: nameB }) => nameA < nameB ? -1 : 1);
  return items;
  // return fetch('./Party Inventory - Inventory.tsv')
  //     .then((response) => {
  //         return response.text();
  //     })
  //     .then(async (text) => {
  //         const rows = text.split('\n').map((row) => row.split('\t')).slice(1);
  //         const itemRequestMap = {};
  //         rows.forEach(((row) => {
  //             const [name, itemUrl] = row;
  //             if (itemUrl) {
  //                 itemRequestMap[name] = row;
  //             }
  //         }));
  //
  //         const itemsFromText = await Promise.all(Object.values(itemRequestMap).map(createItem));
  //         const combinedItems = items.concat(itemsFromText);
  //         return combinedItems;
  //     })
  //     .catch((error) => {
  //         console.error(error);
  //     });
}

export default getItems;
