import { Request, Response } from "express";
import { cssFile, readFile } from "../../service/fileSystem";

export function getCrosswordStylesheet(
  request: Request,
  response: Response
): void {
  const css = readFile(cssFile(request.path.split("style/").pop()!));
  response.contentType("text/css").send(css);
}
