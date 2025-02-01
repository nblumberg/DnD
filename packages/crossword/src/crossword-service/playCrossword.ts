import path from "node:path";

import { Request, Response } from "express";
import { dataFile, htmlFile, readFile } from "../fileSystem";

export function playCrossword(request: Request, response: Response): void {
  const id = path.basename(request.path);
  const data = readFile(dataFile(path.join("crosswords", `${id}.json`)));
  const html = readFile(htmlFile("board.html"))
    .replace("MODE", '"play"')
    .replace("DATA", data)
    .replace("ID", id);
  response.send(html);
}
