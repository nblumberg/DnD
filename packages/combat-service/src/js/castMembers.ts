import { CastMember, CastMemberParams } from "creature";
import { Express, Request, Response } from "express";
import {
  addCastMember as _addCastMember,
  setCastMemberState,
  setState,
  state,
} from "./state";
import { getTurnOrder } from "./turnOrder";

export const castMembers = new Map<string, CastMember>();

function listCastMembers(_req: Request, res: Response): void {
  const result = getTurnOrder().map((castMember) => castMember.raw());
  res.json(result);
}

function addCastMember(req: Request, res: Response): void {
  const castMemberRaw = JSON.parse(req.body) as CastMemberParams;
  const castMember = _addCastMember(castMemberRaw);
  res.json(castMember.raw());
}

function lookUpCastMember(req: Request, res: Response): CastMember | undefined {
  const { id } = req.params;
  const castMember = state.castMembers[id];
  if (!castMember) {
    res.status(404);
    res.json({ error: `CastMember ${id} not found` });
    return;
  }
  return castMember;
}

function getCastMember(req: Request, res: Response): void {
  const castMember = lookUpCastMember(req, res);
  if (!castMember) {
    return;
  }
  res.json(castMember.raw());
}

function delayInitiative(req: Request, res: Response): void {
  const castMember = lookUpCastMember(req, res);
  if (!castMember) {
    return;
  }
  setCastMemberState(castMember.id, "delayInitiative", true);
  res.json(castMember.raw());
}

function changeInitiativeOrder(req: Request, res: Response): void {
  const castMember = lookUpCastMember(req, res);
  if (!castMember) {
    return;
  }
  const initiativeOrder = parseInt(req.params.initiativeOrder, 10);
  if (isNaN(initiativeOrder) || initiativeOrder < 1) {
    res.status(400);
    res.json({
      error: `Invalid initiativeOrder ${req.params.initiativeOrder}, must be >= 1`,
    });
  }
  castMember.initiative.add(initiativeOrder);
  setCastMemberState(castMember.id, "initiativeOrder", initiativeOrder);
  setState(
    "turnOrder",
    getTurnOrder().map(({ id }) => id)
  );
  res.json(castMember.raw());
}

export function attachCastMemberEndpoints(app: Express): void {
  app.get("/v1/cast", listCastMembers);
  app.get("/v1/cast/:id", getCastMember);
  app.post("/v1/cast", addCastMember);

  app.patch("/v1/cast/:id/delay", delayInitiative);
  app.patch(
    "/v1/cast/:id/initiativeOrder/:initiativeOrder",
    changeInitiativeOrder
  );
}
