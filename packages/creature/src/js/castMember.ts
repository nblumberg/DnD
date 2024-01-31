import { setLog } from "roll";
import { Auditioner } from ".";
import { Actor } from "./actor";
import { ActiveCondition } from "./condition";
import { Creature, CreatureParams, creatureParamsToCreature } from "./creature";

setLog(() => {});

interface CastMemberNonOptional {
  delayInitiative: boolean;
  hpCurrent: number;
  hpTemp: number;
  initiativeOrder: number;
  myTurn: boolean;
}

export interface CastMemberParams
  extends CreatureParams,
    Partial<CastMemberNonOptional>,
    Omit<Partial<Auditioner>, keyof CreatureParams> {
  actor: Actor;
  conditions?: { [x: string]: ActiveCondition };
  id: string;
}

export interface CastMember
  extends Creature,
    Auditioner,
    CastMemberNonOptional {
  conditions: { [x: string]: ActiveCondition };
}

export function castMemberParamsToCastMember(
  params: CastMemberParams
): CastMember {
  return {
    ...params,
    ...creatureParamsToCreature(params),
    character: !!params.character,
    conditions: params.conditions ?? {},
    delayInitiative: !!params.delayInitiative,
    initiativeOrder: params.initiativeOrder ?? 0,
    myTurn: !!params.myTurn,
    unique: !!params.unique,
  };
}

export function idCastMember(castMember: CastMember): string {
  return castMember.nickname ?? castMember.name;
}

export function castMemberDoSomething(
  castMember: CastMember,
  something: string
): void {
  console.log(`${idCastMember(castMember)} ${something}`);
}
