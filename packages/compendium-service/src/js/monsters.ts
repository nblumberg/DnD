import { CreatureParams } from "creature";
import { Express, Request, Response } from "express";
import { readFileSync, readdirSync } from "fs";
import { basename, join } from "path";
import { dataPath } from "./constants";

const monsterPath = join(dataPath, "monsters");

function listMonsters(_req: Request, res: Response): void {
  const files = readdirSync(monsterPath);
  const results = files
    .filter((file) => !file.startsWith(".") && file.endsWith(".json"))
    .map((file) => basename(file, ".json"));
  res.send(results);
}

function getMonster(req: Request, res: Response): void {
  const { name } = req.params;
  const file = join(monsterPath, `${name}.json`);
  const content = readFileSync(file, "utf8");
  const creature: CreatureParams = JSON.parse(content);
  res.send(creature);
}

export function attachMonsterEndpoints(app: Express): void {
  app.get("/v1/monsters", listMonsters);
  app.get("/v1/monsters/:name", getMonster);
}
