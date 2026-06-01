import { Request, Response } from "express";
import { jsFile, readFile } from "../../service";

export function getCrosswordJavaScript(
  request: Request,
  response: Response
): void {
  const js = readFile(jsFile(request.path.split("script/").pop()!));
  response.contentType("application/javascript").send(js);
}
