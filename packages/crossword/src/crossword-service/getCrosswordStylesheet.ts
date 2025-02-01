import fs from "node:fs";
import path from "node:path";

import { Request, Response } from "express";
import { distFile, readFile } from "../fileSystem";

export function getCrosswordStylesheet(
  request: Request,
  response: Response
): void {
  const browserPath = distFile(path.join("browser", "assets"));
  let filePath = request.path.split("style/").pop();
  if (filePath === "index") {
    filePath = fs
      .readdirSync(browserPath)
      .find((file) => file.startsWith("index-") && file.endsWith(".css"));
  }
  const css = readFile(path.join(browserPath, filePath!));
  response.contentType("text/css").send(css);
}
