import { Application } from "express";
import { generateWordSearch, saveCrossword } from "./generateWordSearch";
import { getCrosswordJavaScript } from "./getWordSearchJavaScript";
import { getCrosswordStylesheet } from "./getWordSearchStylesheet";
import { playCrossword } from "./playWordSearch";

const SERVLET_CONTEXT = "/word-search";

export function attachWordSearchEndpoints(app: Application): void {
  app.get(`${SERVLET_CONTEXT}/generate/*`, generateWordSearch);

  app.get(`${SERVLET_CONTEXT}/save/*`, saveCrossword);

  app.get(`${SERVLET_CONTEXT}/play/*`, playCrossword);

  app.get(`${SERVLET_CONTEXT}/style/*`, getCrosswordStylesheet);

  app.get(`${SERVLET_CONTEXT}/script/*`, getCrosswordJavaScript);
}
