import { Express, Request, Response } from "express";
import {
  getTurnOrder,
  startTurn as startTurnAction,
} from "../actions/initiativeActions";

function getInitiativeOrder(_req: Request, res: Response): void {
  const result = getTurnOrder().map(({ id }) => id);
  res.json(result);
}

function startTurn(req: Request, res: Response): void {
  const id = req.body;
  const currentTurn = startTurnAction(id);
  if (!currentTurn) {
    res.status(400).json({ error: `Couldn't find cast member ${id}` });
    return;
  }

  res.json(currentTurn);
}

export function attachInitiativeEndpoints(app: Express): void {
  app.get("/v1/initiative", getInitiativeOrder);
  app.post("/v1/initiative", startTurn);
}
