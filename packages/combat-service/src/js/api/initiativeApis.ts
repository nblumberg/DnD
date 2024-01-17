import { Express, Request, Response } from "express";
import { getTurnOrder, startNextTurn } from "../actions/initiativeActions";

function getInitiativeOrder(_req: Request, res: Response): void {
  const result = getTurnOrder().map(({ id }) => id);
  res.json(result);
}

function nextTurn(_req: Request, res: Response): void {
  res.json(startNextTurn());
}

export function attachInitiativeEndpoints(app: Express): void {
  app.get("/v1/initiative", getInitiativeOrder);
  app.post("/v1/initiative", nextTurn);
}
