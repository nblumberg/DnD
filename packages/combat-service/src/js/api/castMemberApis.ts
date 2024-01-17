import { Auditioner, CastMember } from "creature";
import { Express, Request, Response } from "express";
import {
  castActor as castActorAction,
  changeInitiativeOrder as changeInitiativeOrderAction,
  delayInitiative as delayInitiativeAction,
  getCastMember as getCastMemberAction,
} from "../actions/castMemberActions";
import { getTurnOrder } from "../actions/initiativeActions";

function listCastMembers(_req: Request, res: Response): void {
  const result = getTurnOrder().map((castMember) => castMember.raw());
  res.json(result);
}

async function castActor(req: Request, res: Response): Promise<void> {
  const auditioner = JSON.parse(req.body) as Auditioner;
  const castMember = await castActorAction(auditioner);
  res.json(castMember.raw());
}

function lookUpCastMember(req: Request, res: Response): CastMember | undefined {
  const { id } = req.params;
  const castMember = getCastMemberAction(id);
  if (!castMember) {
    res.status(404).json({ error: `CastMember ${id} not found` });
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
  let castMember = lookUpCastMember(req, res);
  if (!castMember) {
    return;
  }
  castMember = delayInitiativeAction(castMember.id);
  if (!castMember) {
    return;
  }
  res.json(castMember.raw());
}

function changeInitiativeOrder(req: Request, res: Response): void {
  let castMember = lookUpCastMember(req, res);
  if (!castMember) {
    return;
  }
  const initiativeOrder = parseInt(req.body, 10);
  if (isNaN(initiativeOrder) || initiativeOrder < 1) {
    res.status(400).json({
      error: `Invalid initiativeOrder ${req.params.initiativeOrder}, must be >= 1`,
    });
    return;
  }
  castMember = changeInitiativeOrderAction(castMember.id, initiativeOrder);
  if (!castMember) {
    return;
  }
  res.json(castMember.raw());
}

export function attachCastMemberEndpoints(app: Express): void {
  app.get("/v1/cast", listCastMembers);
  app.get("/v1/cast/:id", getCastMember);
  app.post("/v1/cast", castActor);
  app.patch("/v1/cast/:id/delay", delayInitiative);
  app.patch("/v1/cast/:id/initiativeOrder", changeInitiativeOrder);
}
