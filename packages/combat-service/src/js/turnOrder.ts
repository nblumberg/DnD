import { Express, Request, Response } from "express";
import { setState, state } from "./state";

export function getTurnOrder() {
  return Object.values(state.castMembers).sort(
    (
      { initiativeOrder: a, dex: { score: aDex } },
      { initiativeOrder: b, dex: { score: bDex } }
    ) => {
      if (a === b) {
        return bDex - aDex;
      }
      return b - a;
    }
  );
}

function getInitiativeOrder(_req: Request, res: Response): void {
  const result = getTurnOrder().map(({ id }) => id);
  res.json(result);
}

function nextTurn(_req: Request, res: Response): void {
  setState("turnIndex", state.turnIndex + 1);
  res.json(getTurnOrder()[state.turnIndex].id);
}

export function attachTurnOrderEndpoints(app: Express): void {
  app.get("/v1/initiative", getInitiativeOrder);
  app.post("/v1/initiative", nextTurn);
}
