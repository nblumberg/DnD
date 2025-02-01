import { Request, Response } from "express";
import fs from "node:fs";
import path from "node:path";
import { distFile, readFile } from "../fileSystem";

export function getCrosswordJavaScript(
  request: Request,
  response: Response
): void {
  const browserPath = distFile(path.join("browser", "assets"));
  let filePath = request.path.split("script/").pop();
  if (filePath === "index") {
    filePath = fs
      .readdirSync(browserPath)
      .find((file) => file.startsWith("index-") && file.endsWith(".js"));
  }
  const js = readFile(path.join(browserPath, filePath!));
  response.contentType("application/javascript").send(js);
}
