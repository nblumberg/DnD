import { Application } from "express";
import { generateCrossword, saveCrossword } from "./generateCrossword";
import { getCrosswordJavaScript } from "./getCrosswordJavaScript";
import { getCrosswordStylesheet } from "./getCrosswordStylesheet";
import { playCrossword } from "./playCrossword";

const SERVLET_CONTEXT = "/crossword";

export function attachCrosswordEndpoints(app: Application): void {
  app.get(`${SERVLET_CONTEXT}/generate/*`, generateCrossword);

  app.get(`${SERVLET_CONTEXT}/save/*`, saveCrossword);

  app.get(`${SERVLET_CONTEXT}/play/*`, playCrossword);

  app.get(`${SERVLET_CONTEXT}/style/*`, getCrosswordStylesheet);

  app.get(`${SERVLET_CONTEXT}/script/*`, getCrosswordJavaScript);
}
