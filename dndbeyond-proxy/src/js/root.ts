import { join, resolve } from 'path';

const projectRoot = resolve(join(__dirname, '..', '..'));

export function fileRelativeToRoot(path: string): string {
  return resolve(join(projectRoot, path));
}
