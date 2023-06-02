import { existsSync, readFileSync, renameSync, writeFileSync } from 'fs';
import { defaultState, State } from '../shared/state';
import { History } from '../shared/history';
import { fileRelativeToRoot } from './root';

interface StorageData {
  history: History;
  state: State;
}

const storageFile = fileRelativeToRoot('state.json');
const errorFile = fileRelativeToRoot('state-error.json');

function getData(): StorageData {
  const defaultData: StorageData = {
    history: [],
    state: { ...defaultState },
  };
  if (!existsSync(storageFile)) {
    return defaultData;
  }
  let tmpData = {};
  try {
    tmpData = JSON.parse(readFileSync(storageFile, { encoding: 'utf8' }));
  } catch (e) {
    console.error(`Failed to parse ${storageFile}`, e);
    renameSync(storageFile, errorFile);
  }
  console.log(`Read in ${storageFile}`);
  return { ...defaultData, ...tmpData };
}

const data: StorageData = getData();

function storeData(): void {
  writeFileSync(storageFile, JSON.stringify(data, null, '  '), { encoding: 'utf8' });
}

function generateReadStore<P extends keyof StorageData>(property: P) {
  return {
    read(): StorageData[P] {
      return data[property];
    },
    store(value: StorageData[P]) {
      data[property] = value;
      storeData();
    }
  };
}

export const { read: readHistory, store: storeHistory } = generateReadStore('history');
export const { read: readState, store: storeState } = generateReadStore('state');
