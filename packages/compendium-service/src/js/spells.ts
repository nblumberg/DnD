import { Spell } from "creature";
import { Express, Request, Response } from "express";
import { readFileSync, readdirSync } from "fs";
import { basename, join } from "path";
import { dataPath } from "./constants";

const spellPath = join(dataPath, "spells");

function listSpells(_req: Request, res: Response): void {
  const files = readdirSync(spellPath);
  const results = files
    .filter((file) => !file.startsWith(".") && file.endsWith(".json"))
    .map((file) => basename(file, ".json"));
  res.send(results);
}

function getSpell(req: Request, res: Response): void {
  const { name } = req.params;
  const file = join(spellPath, `${name}.json`);
  const content = readFileSync(file, "utf8");
  const spell: Spell = JSON.parse(content);
  res.send(spell);
}

export function attachSpellEndpoints(app: Express): void {
  app.get("/v1/spells", listSpells);
  app.get("/v1/spells/:name", getSpell);
}
