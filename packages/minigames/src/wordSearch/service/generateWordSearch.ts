import path from "node:path";

import { Request, Response } from "express";
import { dataFile, htmlFile, readFile, writeFile } from "../../service";
import { crossWords } from "./crossWords";
import { addWord, clearWords, getWords } from "./wordBank";

let data: string;

export function generateWordSearch(request: Request, response: Response): void {
  const fileName = path.basename(request.path);
  console.log(`Generating word search from ${fileName}`);
  const json = JSON.parse(
    readFile(dataFile(path.join("words", `${fileName}.json`)))
  );
  clearWords();
  for (const [word, exists] of Object.entries(json)) {
    addWord(word, exists as boolean);
  }
  const { board } = crossWords(getWords());
  if (!board) {
    response.send("Failed to form a proper crossword");
    return;
  }
  data = board.serialize();
  const id = `${fileName}-${Date.now()}`;
  const html = readFile(htmlFile("crossword.html"))
    .replace("MODE", '"generate"')
    .replace("DATA", data)
    .replace("ID", `"${id}"`);
  response.send(html);
}

export function saveCrossword(request: Request, response: Response): void {
  const id = path.basename(request.path);
  writeFile(dataFile(path.join("crosswords", `${id}.json`)), data);
  console.log(`Saved crossword from ${id}`);
  response.sendStatus(201);
}
