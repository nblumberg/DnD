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
    initiativeOrder: params.initiativeOrder ?? 1,
    unique: !!params.unique,
  };
}

export function castMemberDoSomething(
  castMember: CastMember,
  something: string
): void {
  console.log(`${castMember.nickname ?? castMember.name} ${something}`);
}
