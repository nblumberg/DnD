import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

function findPackageJsonDirectory(
  directory = path.dirname(fileURLToPath(import.meta.url))
): string {
  const packageJson = fs
    .readdirSync(directory)
    .find((file) => file === "package.json");
  if (packageJson) {
    return directory;
  } else {
    return findPackageJsonDirectory(path.dirname(directory));
  }
}

export const moduleDirectory = findPackageJsonDirectory();

function staticAsset(fileName: string, extension: string): string {
  const browserPath = distFile(path.join("browser", "assets"));
  if (fileName === "index") {
    const foundFile = fs
      .readdirSync(browserPath)
      .find(
        (file) => file.startsWith("index-") && file.endsWith(`.${extension}`)
      );
    if (!foundFile) {
      throw new Error(`Could not find index-....${extension}`);
    }
    fileName = foundFile;
  }
  return path.join(browserPath, fileName);
}

export function cssFile(fileName: string): string {
  return staticAsset(fileName, "css");
}

export function jsFile(fileName: string): string {
  return staticAsset(fileName, "js");
}

export function dataFile(fileName: string): string {
  return path.resolve(path.join(moduleDirectory, "data", fileName));
}

export function htmlFile(fileName: string): string {
  return path.resolve(path.join(moduleDirectory, "src", "html", fileName));
}

export function distFile(fileName: string): string {
  return path.resolve(path.join(moduleDirectory, "dist", fileName));
}
