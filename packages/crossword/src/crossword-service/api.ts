import { Application } from "express";
import { generateCrossword, saveCrossword } from "./generateCrossword";
import { getCrosswordJavaScript } from "./getCrosswordJavaScript";
import { getCrosswordStylesheet } from "./getCrosswordStylesheet";
import { playCrossword } from "./playCrossword";

export function attachCrosswordEndpoints(app: Application): void {
  app.get("/crossword/generate/*", generateCrossword);

  app.get("/crossword/save/*", saveCrossword);

  app.get("/crossword/*", playCrossword);

  app.get("/style/*", getCrosswordStylesheet);

  app.get("/script/*", getCrosswordJavaScript);
}
