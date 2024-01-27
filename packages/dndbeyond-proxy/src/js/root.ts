import { join, resolve } from "path";

const projectRoot = resolve(join(__dirname, "..", ".."));

export function fileRelativeToRoot(path: string): string {
  return resolve(join(projectRoot, path));
}

export const dataPath = join(projectRoot, "data");

export function fileRelativeToData(path: string): string {
  return resolve(join(dataPath, path));
}

export type PathParam = "items" | "monsters" | "magic-items" | "spells";
