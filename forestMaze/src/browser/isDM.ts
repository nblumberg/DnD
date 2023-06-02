import { getUrlParam } from './getUrlParam.js';

const character = getUrlParam('name')!;

export function isDM(): boolean {
  return character === 'DM';
}
