import { Express, Request, Response } from "express";
import { readFileSync, readdirSync } from "fs";
import { basename, join } from "path";
import { dataPath } from "./constants";

const characterPath = join(dataPath, "characters");

function listCharacters(_req: Request, res: Response): void {
  const files = readdirSync(characterPath);
  const results = files
    .filter((file) => !file.startsWith(".") && file.endsWith(".json"))
    .map((file) => basename(file, ".json"));
  res.send(JSON.stringify(results));
}

function getCharacter(req: Request, res: Response): void {
  const { name } = req.params;
  const file = join(characterPath, `${name}.json`);
  const content = readFileSync(file, "utf8");
  res.send(content);
}

export function attachCharacterEndpoints(app: Express): void {
  app.get("/v1/characters", listCharacters);
  app.get("/v1/characters/:name", getCharacter);
}
