import path from "node:path";

import { Request, Response } from "express";
import { dataFile, htmlFile, readFile, writeFile } from "../../service";
import { crossWords } from "./crossWords";
import { addWord, clearWords, getWords } from "./wordBank";

let data: string;

export function generateCrossword(request: Request, response: Response): void {
  const fileName = path.basename(request.path);
  console.log(`Generating crossword from ${fileName}`);
  const json = JSON.parse(
    readFile(dataFile(path.join("word-clues", `${fileName}.json`)))
  );
  clearWords();
  for (const [word, clue] of Object.entries(json)) {
    addWord(word, clue as string);
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
